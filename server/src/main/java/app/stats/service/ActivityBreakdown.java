package app.stats.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Builder
public record ActivityBreakdown(
    @Schema(requiredMode = REQUIRED) String activityName,
    @Schema(requiredMode = REQUIRED) Double duration) {
}
