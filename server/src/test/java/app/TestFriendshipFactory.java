package app;

import app.friendship.entity.Friendship;
import app.friendship.entity.FriendshipKey;
import app.friendship.entity.FriendshipStatus;

public class TestFriendshipFactory {

    public static Friendship create(Integer senderId, Integer receiverId, FriendshipStatus status) {
        return Friendship.builder()
                .id(FriendshipKey.builder()
                        .senderId(senderId)
                        .receiverId(receiverId)
                        .build())
                .status(status)
                .build();
    }
}