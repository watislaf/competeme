package app.user.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.ZonedDateTime;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Builder
public record UserProfileResponse(
    @Schema(requiredMode = REQUIRED)
    Integer id,

    @Schema(requiredMode = REQUIRED)
    String name,

    @Schema(requiredMode = REQUIRED)
    String email,

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    String imageUrl,

    @Schema(requiredMode = REQUIRED)
    ZonedDateTime dateJoined,

    @Schema(requiredMode = REQUIRED)
    String role
) {
}
