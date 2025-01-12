package app.user.service;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserSearchResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    Integer id,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String username,

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    String imageUrl
) {
}
