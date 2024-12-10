package app.auth;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthenticationResponse(
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED) String accessToken,
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED) String refreshToken,
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED) Integer userId
) {
}
