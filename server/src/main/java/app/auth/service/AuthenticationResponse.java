package app.auth.service;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record AuthenticationResponse(
    @Schema(requiredMode = REQUIRED) String accessToken,
    @Schema(requiredMode = REQUIRED) String refreshToken,
    @Schema(requiredMode = REQUIRED) Integer userId
) {
}
