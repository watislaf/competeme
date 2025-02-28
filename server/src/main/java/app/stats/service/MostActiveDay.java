package app.stats.service;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record MostActiveDay(
    @Schema(requiredMode = REQUIRED) String dayOfWeek,
    @Schema(requiredMode = REQUIRED) String averageDuration) {
}
