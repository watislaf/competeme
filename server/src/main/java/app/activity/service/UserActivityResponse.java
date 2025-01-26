package app.activity.service;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record UserActivityResponse(
    @Schema(requiredMode = REQUIRED) List<ActivityResponse> available,
    @Schema(requiredMode = REQUIRED) List<RecentActivityResponse> recent) {
}
