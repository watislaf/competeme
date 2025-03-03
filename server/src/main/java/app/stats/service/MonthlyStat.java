package app.stats.service;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record MonthlyStat(
    @Schema(requiredMode = REQUIRED) String week,
    @Schema(requiredMode = REQUIRED) Double duration) {
}
