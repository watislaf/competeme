package app.challenge.service;

import app.challenge.entity.Challenge;
import app.challenge.entity.ChallengeParticipants;
import app.challenge.entity.ChallengeParticipantsRepository;
import app.challenge.entity.ChallengeRepository;
import app.user.entity.User;
import app.user.entity.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChallengeService {
    
    private static final String PARTICIPANTS_NOT_FOUND_MESSAGE = "One or more participants not found";
    private static final String CHALLENGE_NOT_FOUND_MESSAGE = "Challenge not found";
    private static final String USER_NOT_PARTICIPATING_MESSAGE = "User %d isn't participating in challenge %d";
    private static final String USER_NOT_IN_CHALLENGE_MESSAGE = "User is not participating in this challenge";
    
    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantsRepository challengeParticipantsRepository;
    private final UserRepository userRepository;
    private final ChallengeMapper challengeMapper;
    private final ChallengeLogger challengeLogger = new ChallengeLogger(log);

    public void addChallenge(Integer userId, ChallengeRequest challengeRequest) {
        challengeLogger.logAddingChallenge(userId);
        challengeLogger.logChallengeDetails(challengeRequest.title(), challengeRequest.participants());

        List<Integer> participantIds = buildParticipantIds(userId, challengeRequest.participants());
        List<User> participants = validateAndGetUsers(participantIds);

        Challenge challenge = buildChallenge(challengeRequest);
        challengeRepository.save(challenge);
        challengeLogger.logChallengeCreated(challenge.getId(), challenge.getTitle());
        
        addParticipantsToChallenge(participants, challenge);
        challengeLogger.logParticipantsAdded(participants.size(), challenge.getId());
    }

    private List<Integer> buildParticipantIds(Integer userId, List<Integer> requestParticipants) {
        List<Integer> participantIds = new ArrayList<>(requestParticipants);
        participantIds.add(userId);
        return participantIds;
    }

    private List<User> validateAndGetUsers(List<Integer> participantIds) {
        List<User> participants = userRepository.findAllById(participantIds);
        if (participants.size() != participantIds.size()) {
            challengeLogger.logParticipantsNotFoundError();
            throw new IllegalArgumentException(PARTICIPANTS_NOT_FOUND_MESSAGE);
        }
        return participants;
    }

    private Challenge buildChallenge(ChallengeRequest challengeRequest) {
        return Challenge.builder()
            .title(challengeRequest.title())
            .description(challengeRequest.description())
            .goal(challengeRequest.goal())
            .unit(challengeRequest.unit())
            .createdAt(ZonedDateTime.now())
            .build();
    }

    private void addParticipantsToChallenge(List<User> participants, Challenge challenge) {
        participants.forEach(user -> addParticipant(user, challenge));
    }

    private void addParticipant(User user, Challenge challenge) {
        ChallengeParticipants participant = ChallengeParticipants.builder()
            .challenge(challenge)
            .progress(0)
            .user(user)
            .build();

        challengeParticipantsRepository.save(participant);
        challengeLogger.logParticipantAdded(user.getId(), challenge.getId());
    }

    public List<ChallengeResponse> getChallenges(Integer userId) {
        challengeLogger.logFetchingChallenges(userId);

        List<ChallengeParticipants> participantRecords = challengeParticipantsRepository.findByUserId(userId);

        if (participantRecords.isEmpty()) {
            challengeLogger.logNoChallengesFound(userId);
            return new ArrayList<>();
        }

        List<Challenge> challenges = extractAndSortChallenges(participantRecords);
        challengeLogger.logChallengesFound(challenges.size(), userId);
        return mapToResponses(challenges);
    }

    private List<Challenge> extractAndSortChallenges(List<ChallengeParticipants> participantRecords) {
        return participantRecords.stream()
            .map(ChallengeParticipants::getChallenge)
            .sorted(Comparator.comparingLong(Challenge::getId))
            .toList();
    }

    private List<ChallengeResponse> mapToResponses(List<Challenge> challenges) {
        return challenges.stream()
            .map(challengeMapper::mapToChallengeResponse)
            .collect(Collectors.toList());
    }

    public void updateProgress(Integer userId, Long challengeId, Integer progress) {
        challengeLogger.logUpdatingProgress(userId, challengeId, progress);

        ChallengeParticipants participant = findParticipantOrThrow(userId, challengeId);
        participant.setProgress(progress);
        challengeParticipantsRepository.save(participant);
        challengeLogger.logProgressUpdated(participant.getId());
    }

    private ChallengeParticipants findParticipantOrThrow(Integer userId, Long challengeId) {
        return challengeParticipantsRepository.findByUserIdAndChallengeId(userId, challengeId)
            .orElseThrow(() -> {
                challengeLogger.logParticipantNotFoundError(userId, challengeId);
                return new RuntimeException(
                    String.format(USER_NOT_PARTICIPATING_MESSAGE, userId, challengeId));
            });
    }

    public void modifyChallenge(Long challengeId, ChallengeModificationRequest challengeModificationRequest) {
        challengeLogger.logModifyingChallenge(challengeId);
        challengeLogger.logModificationDetails(challengeModificationRequest);

        Challenge challenge = findChallengeOrThrow(challengeId);
        
        updateChallengeFields(challenge, challengeModificationRequest);
        challengeRepository.save(challenge);
        challengeLogger.logChallengeUpdated(challengeId);

        if (challengeModificationRequest.participants() != null) {
            challengeLogger.logProcessingParticipants();
            modifyParticipants(challenge, challengeModificationRequest.participants());
        }
    }

    private Challenge findChallengeOrThrow(Long challengeId) {
        return challengeRepository.findById(challengeId)
            .orElseThrow(() -> {
                challengeLogger.logChallengeNotFoundError(challengeId);
                return new RuntimeException(CHALLENGE_NOT_FOUND_MESSAGE);
            });
    }

    private void updateChallengeFields(Challenge challenge, ChallengeModificationRequest request) {
        if (request.title() != null) {
            challengeLogger.logUpdatingTitle(challenge.getTitle(), request.title());
            challenge.setTitle(request.title());
        }
        if (request.description() != null) {
            challengeLogger.logUpdatingDescription();
            challenge.setDescription(request.description());
        }
        if (request.goal() != null) {
            challengeLogger.logUpdatingGoal(challenge.getGoal(), request.goal());
            challenge.setGoal(request.goal());
        }
        if (request.unit() != null) {
            challengeLogger.logUpdatingUnit(challenge.getUnit(), request.unit());
            challenge.setUnit(request.unit());
        }
    }

    private void modifyParticipants(Challenge challenge, List<String> participantNames) {
        challengeLogger.logModifyingParticipants(challenge.getId());
        List<User> users = validateAndGetUsersByNames(participantNames);
        addNewParticipants(challenge, users);
    }

    private List<User> validateAndGetUsersByNames(List<String> participantNames) {
        List<User> users = userRepository.findAllByNameIn(participantNames);
        if (users.size() != participantNames.size()) {
            challengeLogger.logParticipantModificationError();
            throw new IllegalArgumentException(PARTICIPANTS_NOT_FOUND_MESSAGE);
        }
        return users;
    }

    private void addNewParticipants(Challenge challenge, List<User> users) {
        users.forEach(user -> {
            boolean alreadyParticipating = challengeParticipantsRepository
                .existsByUserIdAndChallengeId(user.getId(), challenge.getId());
            if (!alreadyParticipating) {
                challengeLogger.logAddingParticipant(user.getId());
                addParticipant(user, challenge);
            }
        });
    }

    public void deleteChallenge(Integer userId, Long challengeId) {
        challengeLogger.logDeletingChallenge(userId, challengeId);

        Challenge challenge = findChallengeOrThrow(challengeId);
        ChallengeParticipants participant = findParticipantForDeletion(userId, challengeId);

        challengeParticipantsRepository.delete(participant);
        challengeLogger.logParticipantRemoved(userId, challengeId);
        
        deleteChallengeIfNoParticipants(challengeId, challenge);
    }

    private ChallengeParticipants findParticipantForDeletion(Integer userId, Long challengeId) {
        return challengeParticipantsRepository.findByUserIdAndChallengeId(userId, challengeId)
            .orElseThrow(() -> {
                challengeLogger.logDeleteUserNotParticipatingError(userId, challengeId);
                return new RuntimeException(USER_NOT_IN_CHALLENGE_MESSAGE);
            });
    }

    private void deleteChallengeIfNoParticipants(Long challengeId, Challenge challenge) {
        boolean hasParticipants = challengeParticipantsRepository.existsByChallengeId(challengeId);
        if (!hasParticipants) {
            challengeRepository.delete(challenge);
            challengeLogger.logChallengeDeleted(challengeId);
        } else {
            challengeLogger.logChallengeRetained(challengeId);
        }
    }
}