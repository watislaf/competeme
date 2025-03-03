package app.challenge.service;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record LeaderboardEntry(
    @Schema(requiredMode = REQUIRED) Integer userId,
    @Schema(requiredMode = REQUIRED) Integer score) {
}
