package app.challenge.service;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ParticipantResponse(
    @Schema(requiredMode = REQUIRED) String username,
    @Schema(requiredMode = REQUIRED) Integer progres
) {
}
