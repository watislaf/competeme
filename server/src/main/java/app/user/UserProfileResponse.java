package app.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record UserProfileResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Integer id,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String name,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String email,

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    String imageUrl,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    ZonedDateTime dateJoined
) {
}
