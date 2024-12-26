package app.challenge.service;

import app.challenge.entity.Challenge;
import app.challenge.entity.ChallengeParticipants;
import app.challenge.entity.ChallengeParticipantsRepository;
import app.challenge.entity.ChallengeRepository;
import app.user.entity.User;
import app.user.entity.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantsRepository challengeParticipantsRepository;
    private final UserRepository userRepository;
    private final ChallengeMapper challengeMapper;

    public void addChallenge(Integer userId, ChallengeRequest challengeRequest) {
        List<Integer> participantIds = challengeRequest.participants();
        participantIds.add(userId);
        List<User> participants = userRepository.findAllById(participantIds);
        if (participants.size() != challengeRequest.participants().size()) {
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
        participants.forEach(user -> addParticipant(user, challenge));
    }

    private void addParticipant(User user, Challenge challenge) {
        ChallengeParticipants participant = ChallengeParticipants.builder()
            .challenge(challenge)
            .progress(0)
            .user(user)
            .build();

        challengeParticipantsRepository.save(participant);
    }

    public List<ChallengeResponse> getChallenges(Integer userId) {
        List<ChallengeParticipants> participantRecords = challengeParticipantsRepository.findByUserId(userId);

        if (participantRecords.isEmpty()) return new ArrayList<>();

        List<Challenge> challenges = participantRecords.stream()
            .map(ChallengeParticipants::getChallenge)
            .sorted(Comparator.comparingLong(Challenge::getId))
            .toList();

        return challenges.stream()
            .map(challengeMapper::mapToChallengeResponse)
            .collect(Collectors.toList());
    }

    public void updateProgress(Integer userId, Long challengeId, Integer progress) {
        ChallengeParticipants participant = challengeParticipantsRepository.findByUserIdAndChallengeId(userId, challengeId)
            .orElseThrow(() -> new RuntimeException("User " + userId + "isnt participating in challenge " + challengeId));

        participant.setProgress(participant.getProgress() + progress);
        challengeParticipantsRepository.save(participant);
    }
}
