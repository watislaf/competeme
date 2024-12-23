package app.challenge;

import app.user.User;
import app.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantsRepository challengeParticipantsRepository;
    private final UserRepository userRepository;

    public void addChallenge(Integer userId, ChallengeRequest challengeRequest) {
        Challenge challenge = Challenge.builder()
            .title(challengeRequest.title())
            .description(challengeRequest.description())
            .goal(challengeRequest.goal())
            .unit(challengeRequest.unit())
            .createdAt(ZonedDateTime.now())
            .build();

        challengeRepository.save(challenge);

        List<User> participants = userRepository.findAllById(challengeRequest.participants());
        Map<Integer, User> userMap = participants.stream()
            .collect(Collectors.toMap(User::getId, user -> user));

        addParticipantsToChallenge(userMap, challenge, challengeRequest.participants());

        User creator = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        addParticipant(creator, challenge);
    }

    private void addParticipant(User user, Challenge challenge) {
        ChallengeParticipants participant = ChallengeParticipants.builder()
            .challenge(challenge)
            .progress(0)
            .user(user)
            .build();

        challengeParticipantsRepository.save(participant);
    }

    private void addParticipantsToChallenge(Map<Integer, User> userMap, Challenge challenge, List<Integer> participants) {
        participants.forEach(participantId -> {
            User user = userMap.get(participantId);
            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }
            addParticipant(user, challenge);
        });
    }

    public List<ChallengeResponse> getChallenges(Integer userId) {
        List<ChallengeParticipants> participantRecords = challengeParticipantsRepository.findByUserId(userId);

        if (participantRecords.isEmpty()) return new ArrayList<>();

        List<Challenge> challenges = participantRecords.stream()
            .map(ChallengeParticipants::getChallenge)
            .sorted(Comparator.comparingLong(Challenge::getId))
            .toList();

        return challenges.stream()
            .map(this::mapToChallengeResponse)
            .collect(Collectors.toList());
    }

    private ChallengeResponse mapToChallengeResponse(Challenge challenge) {
        List<ChallengeParticipants> allParticipants = challengeParticipantsRepository.findByChallengeId(challenge.getId());

        List<ParticipantResponse> participantResponses = allParticipants.stream()
            .map(this::mapToParticipantResponse)
            .collect(Collectors.toList());

        int totalProgess = allParticipants.stream()
            .mapToInt(ChallengeParticipants::getProgress)
            .sum();

        List<LeaderboardEntry> leaderboard = allParticipants.stream()
            .sorted((a, b) -> Integer.compare(b.getProgress(), a.getProgress()))
            .limit(3)
            .map(p -> new LeaderboardEntry(p.getUser().getName(), p.getProgress()))
            .collect(Collectors.toList());

        return new ChallengeResponse(
            challenge.getId(),
            challenge.getTitle(),
            challenge.getDescription(),
            challenge.getGoal(),
            challenge.getUnit(),
            participantResponses,
            totalProgess,
            leaderboard
        );
    }

    private ParticipantResponse mapToParticipantResponse(ChallengeParticipants participant) {
        return new ParticipantResponse(
            participant.getUser().getName(),
            participant.getProgress()
        );
    }

    public void updateProgress(Integer userId, Long challengeId, Integer progress) {
        ChallengeParticipants participant = challengeParticipantsRepository.findByUserIdAndChallengeId(userId, challengeId)
            .orElseThrow(() -> new RuntimeException("User " + userId + "isnt participating in challenge " + challengeId));

        participant.setProgress(participant.getProgress() + progress);
        challengeParticipantsRepository.save(participant);
    }
}