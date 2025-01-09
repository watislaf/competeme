package app.friendship.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "friendships")
public class Friendship {

    @EmbeddedId
    @Schema(requiredMode = REQUIRED)
    private FriendshipKey id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(requiredMode = REQUIRED)
    private FriendshipStatus status;
}
