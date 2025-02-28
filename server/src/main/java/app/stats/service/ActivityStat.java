package app.stats.service;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ActivityStat(
    @Schema(requiredMode = REQUIRED) String activityName,
    @Schema(requiredMode = REQUIRED) String duration) {
}
