package app.challenge;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ChallengeResponse(
    @Schema(requiredMode = REQUIRED) Long id,
    @Schema(requiredMode = REQUIRED) String title,
    @Schema(requiredMode = REQUIRED) String description,
    @Schema(requiredMode = REQUIRED) Integer goal,
    @Schema(requiredMode = REQUIRED) String unit,
    @Schema(requiredMode = REQUIRED) List<ParticipantResponse> participants,
    @Schema(requiredMode = REQUIRED) Integer totalProgress,
    @Schema(requiredMode = REQUIRED) List<LeaderboardEntry> leaderboard
) {
}
