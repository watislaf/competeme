package app.challenge.service;

import app.challenge.entity.Challenge;
import app.challenge.entity.ChallengeParticipants;
import app.challenge.entity.ChallengeParticipantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ChallengeMapper {
    private final ChallengeParticipantsRepository challengeParticipantsRepository;

    public ChallengeResponse mapToChallengeResponse(Challenge challenge) {
        List<ChallengeParticipants> allParticipants = challengeParticipantsRepository.findByChallengeId(challenge.getId());

        List<ParticipantResponse> participantResponses = allParticipants.stream()
            .map(this::mapToParticipantResponse)
            .collect(Collectors.toList());

        int totalProgress = allParticipants.stream()
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
            totalProgress,
            leaderboard
        );
    }

    private ParticipantResponse mapToParticipantResponse(ChallengeParticipants participant) {
        return new ParticipantResponse(
            participant.getUser().getName(),
            participant.getProgress()
        );
    }
}
