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
    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantsRepository challengeParticipantsRepository;
    private final UserRepository userRepository;
    private final ChallengeMapper challengeMapper;

    public void addChallenge(Integer userId, ChallengeRequest challengeRequest) {
        log.info("Attempting to add new challenge by user ID: {}", userId);
        log.debug("Challenge details - Title: {}, Participants: {}",
            challengeRequest.title(), challengeRequest.participants()
        );

        List<Integer> participantIds = challengeRequest.participants();
        participantIds.add(userId);
        List<User> participants = userRepository.findAllById(participantIds);

        if (participants.size() != participantIds.size()) {
            log.error("Failed to add challenge - one or more participants not found");
            throw new IllegalArgumentException("One or more participants not found");
        }

        Challenge challenge = Challenge.builder()
            .title(challengeRequest.title())
            .description(challengeRequest.description())
            .goal(challengeRequest.goal())
            .unit(challengeRequest.unit())
            .createdAt(ZonedDateTime.now())
            .build();

        challengeRepository.save(challenge);
        log.info("Challenge created successfully - ID: {}, Title: {}", challenge.getId(), challenge.getTitle());

        participants.forEach(user -> addParticipant(user, challenge));
        log.debug("Added {} participants to challenge ID: {}", participants.size(), challenge.getId());
    }

    private void addParticipant(User user, Challenge challenge) {
        ChallengeParticipants participant = ChallengeParticipants.builder()
            .challenge(challenge)
            .progress(0)
            .user(user)
            .build();

        challengeParticipantsRepository.save(participant);
        log.trace("Added participant - User ID: {} to Challenge ID: {}", user.getId(), challenge.getId());
    }

    public List<ChallengeResponse> getChallenges(Integer userId) {
        log.info("Fetching challenges for user ID: {}", userId);

        List<ChallengeParticipants> participantRecords = challengeParticipantsRepository.findByUserId(userId);

        if (participantRecords.isEmpty()) {
            log.debug("No challenges found for user ID: {}", userId);
            return new ArrayList<>();
        }

        List<Challenge> challenges = participantRecords.stream()
            .map(ChallengeParticipants::getChallenge)
            .sorted(Comparator.comparingLong(Challenge::getId))
            .toList();

        log.debug("Found {} challenges for user ID: {}", challenges.size(), userId);
        return challenges.stream()
            .map(challengeMapper::mapToChallengeResponse)
            .collect(Collectors.toList());
    }

    public void updateProgress(Integer userId, Long challengeId, Integer progress) {
        log.info("Updating progress - User ID: {}, Challenge ID: {}, Progress: {}",
            userId, challengeId, progress
        );

        ChallengeParticipants participant = challengeParticipantsRepository
            .findByUserIdAndChallengeId(userId, challengeId)
            .orElseThrow(() -> {
                log.error("Participant not found - User ID: {}, Challenge ID: {}", userId, challengeId);
                return new RuntimeException("User " + userId + " isn't participating in challenge " + challengeId);
            });

        participant.setProgress(progress);
        challengeParticipantsRepository.save(participant);
        log.debug("Progress updated successfully for participant ID: {}", participant.getId());
    }

    public void modifyChallenge(Long challengeId, ChallengeModificationRequest challengeModificationRequest) {
        log.info("Modifying challenge ID: {}", challengeId);
        log.debug("Modification details: {}", challengeModificationRequest);

        Challenge challenge = challengeRepository.findById(challengeId)
            .orElseThrow(() -> {
                log.error("Challenge not found - ID: {}", challengeId);
                return new RuntimeException("Challenge not found");
            });

        if (challengeModificationRequest.title() != null) {
            log.debug("Updating title from '{}' to '{}'",
                challenge.getTitle(), challengeModificationRequest.title()
            );
            challenge.setTitle(challengeModificationRequest.title());
        }
        if (challengeModificationRequest.description() != null) {
            log.debug("Updating description");
            challenge.setDescription(challengeModificationRequest.description());
        }
        if (challengeModificationRequest.goal() != null) {
            log.debug("Updating goal from {} to {}",
                challenge.getGoal(), challengeModificationRequest.goal()
            );
            challenge.setGoal(challengeModificationRequest.goal());
        }
        if (challengeModificationRequest.unit() != null) {
            log.debug("Updating unit from '{}' to '{}'",
                challenge.getUnit(), challengeModificationRequest.unit()
            );
            challenge.setUnit(challengeModificationRequest.unit());
        }

        challengeRepository.save(challenge);
        log.info("Challenge ID: {} updated successfully", challengeId);

        if (challengeModificationRequest.participants() != null) {
            log.debug("Processing participants modification");
            modifyParticipants(challenge, challengeModificationRequest.participants());
        }
    }

    private void modifyParticipants(Challenge challenge, List<String> participants) {
        log.debug("Modifying participants for challenge ID: {}", challenge.getId());

        List<User> users = userRepository.findAllByNameIn(participants);

        if (users.size() != participants.size()) {
            log.error("Participant modification failed - one or more participants not found");
            throw new IllegalArgumentException("One or more participants not found");
        }

        users.forEach(user -> {
            boolean alreadyParticipating = challengeParticipantsRepository
                .existsByUserIdAndChallengeId(user.getId(), challenge.getId());
            if (!alreadyParticipating) {
                log.debug("Adding new participant - User ID: {}", user.getId());
                addParticipant(user, challenge);
            }
        });
    }

    public void deleteChallenge(Integer userId, Long challengeId) {
        log.info("Deleting challenge - User ID: {}, Challenge ID: {}", userId, challengeId);

        Challenge challenge = challengeRepository.findById(challengeId)
            .orElseThrow(() -> {
                log.error("Delete failed - challenge not found - ID: {}", challengeId);
                return new RuntimeException("Challenge not found");
            });

        ChallengeParticipants participant = challengeParticipantsRepository
            .findByUserIdAndChallengeId(userId, challengeId)
            .orElseThrow(() -> {
                log.error("Delete failed - user not participating - User ID: {}, Challenge ID: {}",
                    userId, challengeId
                );
                return new RuntimeException("User is not participating in this challenge");
            });

        challengeParticipantsRepository.delete(participant);
        log.debug("Removed participant - User ID: {} from Challenge ID: {}", userId, challengeId);

        boolean hasParticipants = challengeParticipantsRepository.existsByChallengeId(challengeId);
        if (!hasParticipants) {
            challengeRepository.delete(challenge);
            log.info("Challenge ID: {} deleted (no remaining participants)", challengeId);
        } else {
            log.debug("Challenge ID: {} retained (remaining participants exist)", challengeId);
        }
    }
}