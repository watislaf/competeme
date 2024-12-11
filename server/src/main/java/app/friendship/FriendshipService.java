package app.friendship;

import app.user.User;
import app.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public void sendFriendRequest(Integer senderId, FriendshipRequest request) {
        boolean exists = friendshipRepository.existsBySenderIdAndReceiverIdOrSenderIdAndReceiverId(
                senderId,
                request.id(),
                request.id(),
                senderId
        );

        if (exists) return;

        Friendship friendship = Friendship.builder()
                .senderId(senderId)
                .receiverId(request.id())
                .status(FriendshipStatus.PENDING)
                .build();

        friendshipRepository.save(friendship);
    }

    public void acceptFriendRequest(Integer receiverId, FriendshipRequest request) {

        Friendship friendship = friendshipRepository.findAll().stream()
                .filter(f -> f.getReceiverId().equals(receiverId) && f.getSenderId().equals(request.id()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Friendship request not found"));

        friendship.setStatus(FriendshipStatus.ACCEPTED);

        friendshipRepository.save(friendship);
    }

    public void removeFriend(Integer userId, FriendshipRequest request) {
        Friendship friendship = friendshipRepository.findAll().stream()
                .filter(f -> (f.getSenderId().equals(userId) && f.getReceiverId().equals(request.id())) ||
                        (f.getSenderId().equals(request.id()) && f.getReceiverId().equals(userId)))
                .findFirst()
                .orElse(null);

        if (friendship != null) {
            friendshipRepository.delete(friendship);
        }
    }

    public List<Integer> getPendingFriendRequests(Integer userId) {
        return friendshipRepository.findByReceiverIdAndStatus(userId, FriendshipStatus.PENDING).stream()
                .map(Friendship::getSenderId)
                .toList();
    }

    public List<Integer> getFriends(Integer requesterId, Integer userId) {
        boolean isRequesterFriend = friendshipRepository.findByStatusAndSenderIdOrStatusAndReceiverId(FriendshipStatus.ACCEPTED, requesterId, FriendshipStatus.ACCEPTED, requesterId).stream()
                .anyMatch(friendship -> friendship.getSenderId().equals(userId) || friendship.getReceiverId().equals(userId));

        if (!isRequesterFriend && !requesterId.equals(userId)) {
            return Collections.emptyList();
        }

        return friendshipRepository.findByStatusAndSenderIdOrStatusAndReceiverId(FriendshipStatus.ACCEPTED, userId, FriendshipStatus.ACCEPTED, userId).stream()
                .map(friendship -> friendship.getSenderId().equals(userId) ? friendship.getReceiverId() : friendship.getSenderId())
                .toList();
    }
}
