package app.friendship.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipKey implements Serializable {
    @Schema(requiredMode = REQUIRED)
    private Integer senderId;
    @Schema(requiredMode = REQUIRED)
    private Integer receiverId;
}
