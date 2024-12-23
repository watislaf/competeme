package app.challenge;

import java.util.List;

public record ChallengeResponse(
    Long id,
    String title,
    String description,
    Integer goal,
    String unit,
    List<ParticipantResponse> participants,
    Integer totalProgress,
    List<LeaderboardEntry> leaderboard
) {
}
