package app.activity.service;

import app.activity.entity.Type;
import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ActivityRequest(
    @Schema(requiredMode = REQUIRED) String title,
    @Schema(requiredMode = REQUIRED) Type type,
    @Schema(requiredMode = REQUIRED) Long duration) {
}
