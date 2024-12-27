package app.friendship;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;

    public void sendFriendRequest(Integer senderId, Integer receiverId) {
        boolean alreadySent = friendshipRepository.existsBySenderIdAndReceiverId(
            senderId,
            receiverId
        );

        if (alreadySent) return;

        boolean canBeAcceptedInstantly = friendshipRepository.existsBySenderIdAndReceiverId(
            receiverId,
            senderId
        );

        if (canBeAcceptedInstantly) {
            this.acceptFriendRequest(receiverId, senderId);
        }

        Friendship friendship = Friendship.builder()
            .senderId(senderId)
            .receiverId(receiverId)
            .status(FriendshipStatus.PENDING)
            .build();

        friendshipRepository.save(friendship);
    }

    public void acceptFriendRequest(Integer friend1Id, Integer friend2Id) {
        System.out.println(friend1Id);
        System.out.println(friend2Id);
        Friendship friendship = friendshipRepository.findAll().stream()
            .filter(f -> f.getReceiverId().equals(friend1Id) && f.getSenderId().equals(friend2Id))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Friendship request not found"));

        friendship.setStatus(FriendshipStatus.ACCEPTED);

        friendshipRepository.save(friendship);
    }

    public void removeFriend(Integer senderId, Integer friendId) {
        friendshipRepository.deleteAll(friendshipRepository.findByStatusAndSenderId(
            FriendshipStatus.ACCEPTED,
            senderId
        ));

        friendshipRepository.deleteAll(friendshipRepository.findByStatusAndSenderId(
            FriendshipStatus.ACCEPTED,
            friendId
        ));
    }

    public List<Integer> getPendingFriendRequests(Integer userId) {
        return friendshipRepository.findByReceiverIdAndStatus(userId, FriendshipStatus.PENDING).stream()
            .map(Friendship::getSenderId)
            .toList();
    }

    public List<Integer> getSentFriendRequests(Integer userId) {
        return friendshipRepository.findByStatusAndSenderId(FriendshipStatus.PENDING, userId).stream()
            .map(Friendship::getReceiverId)
            .toList();
    }


    public boolean areFriends(Integer senderId, Integer userId) {
        return friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, userId, FriendshipStatus.ACCEPTED)
            || friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(userId, senderId, FriendshipStatus.ACCEPTED);
    }

    public List<Integer> getFriends(Integer senderId, Integer userId) {
//        if (!areFriends(senderId, userId)) {
//            return Collections.emptyList();
//        }

        var sent = friendshipRepository.findByStatusAndSenderId(FriendshipStatus.ACCEPTED, userId).stream()
            .map(Friendship::getReceiverId)
            .toList();
        var received = friendshipRepository.findByStatusAndReceiverId(FriendshipStatus.ACCEPTED, userId).stream()
            .map(Friendship::getSenderId)
            .toList();

        List<Integer> result = new ArrayList<>(sent);
        result.addAll(received);
        return result;
    }

    public void cancelFriendRequest(Integer senderId, Integer receiverId) {

        friendshipRepository.deleteAll(friendshipRepository.findByStatusAndSenderIdAndReceiverId(
            FriendshipStatus.PENDING,
            senderId,
            receiverId
        ));

        friendshipRepository.deleteAll(friendshipRepository.findByStatusAndSenderIdAndReceiverId(
            FriendshipStatus.PENDING,
            receiverId,
            senderId
        ));
    }

    public boolean isFriend(Integer senderId, Integer receiverId) {
        return friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, FriendshipStatus.ACCEPTED) ||
            friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(receiverId, senderId, FriendshipStatus.ACCEPTED);
    }

    public boolean hasPendingRequest(Integer senderId, Integer receiverId) {
        return friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, FriendshipStatus.PENDING) ||
            friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(receiverId, senderId, FriendshipStatus.PENDING);
    }
}
