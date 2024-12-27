package app.friendship.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
public record FriendshipRequest(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) Integer receiverId) {
}
