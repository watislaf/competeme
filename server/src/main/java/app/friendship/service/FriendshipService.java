package app.friendship.service;

import app.friendship.entity.Friendship;
import app.friendship.entity.FriendshipKey;
import app.friendship.entity.FriendshipRepository;
import app.friendship.entity.FriendshipStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;

    public void sendFriendRequest(Integer senderId, Integer receiverId) {
        if (isFriendRequestExists(senderId, receiverId)) return;

        if (isFriendRequestExists(receiverId, senderId)) {
            acceptFriendRequest(receiverId, senderId);
            return;
        }

        Friendship friendship = requestFriendship(senderId, receiverId);
        friendshipRepository.save(friendship);
    }

    public void acceptFriendRequest(Integer friend1Id, Integer friend2Id) {
        List<Friendship> friendships = findFriendshipRequests(friend1Id, friend2Id, FriendshipStatus.PENDING);

        if (friendships.isEmpty()) {
            throw new IllegalArgumentException("Friendship request not found");
        }

        if (friendships.size() == 2) {
            friendshipRepository.delete(friendships.get(1));
        }

        Friendship accepted = friendships.get(0);
        accepted.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(accepted);
    }

    public void removeFriend(Integer userId1, Integer userId2) {
        friendshipRepository.deleteAll(findFriendshipRequests(userId1, userId2, FriendshipStatus.ACCEPTED));
    }

    public List<Integer> getPendingFriendRequests(Integer userId) {
        return friendshipRepository.findById_ReceiverIdAndStatus(userId, FriendshipStatus.PENDING).stream()
            .map(Friendship::getId)
            .map(FriendshipKey::getSenderId)
            .toList();
    }

    public List<Integer> getSentFriendRequests(Integer userId) {
        return friendshipRepository.findById_SenderIdAndStatus(userId, FriendshipStatus.PENDING).stream()
            .map(Friendship::getId)
            .map(FriendshipKey::getReceiverId)
            .toList();
    }

    public List<Integer> getFriends(Integer userId) {
        List<Integer> sent = friendshipRepository.findByStatusAndId_SenderId(FriendshipStatus.ACCEPTED, userId).stream()
            .map(Friendship::getId)
            .map(FriendshipKey::getReceiverId)
            .toList();

        List<Integer> received = friendshipRepository.findByStatusAndId_ReceiverId(FriendshipStatus.ACCEPTED, userId).stream()
            .map(Friendship::getId)
            .map(FriendshipKey::getSenderId)
            .toList();

        List<Integer> result = new ArrayList<>(sent);
        result.addAll(received);
        return result;
    }

    public void cancelFriendRequest(Integer senderId, Integer receiverId) {
        friendshipRepository.deleteAll(findFriendshipRequests(senderId, receiverId, FriendshipStatus.PENDING));
    }

    public List<Friendship> getStatuses(Integer userId1, List<FriendshipRequest> userId2) {
        List<Integer> userIds = userId2.stream()
            .map(FriendshipRequest::receiverId)
            .toList();
        return friendshipRepository.findBySenderAndReceiversOrReceiverAndSenders(userId1, userIds);
    }

    private Friendship requestFriendship(Integer senderId, Integer receiverId) {
        return Friendship.builder()
            .id(FriendshipKey.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .build())
            .status(FriendshipStatus.PENDING)
            .build();
    }

    private List<Friendship> findFriendshipRequests(Integer userId1, Integer userId2, FriendshipStatus status) {
        return friendshipRepository.findByStatusAndSenderOrReceiver(status, userId1, userId2);
    }

    private boolean isFriendRequestExists(Integer senderId, Integer receiverId) {
        return friendshipRepository.existsById_SenderIdAndId_ReceiverId(senderId, receiverId);
    }

    public boolean isFriend(Integer senderId, Integer receiverId) {
        return friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(senderId, receiverId, FriendshipStatus.ACCEPTED) ||
            friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(receiverId, senderId, FriendshipStatus.ACCEPTED);
    }

    public boolean hasPendingRequest(Integer senderId, Integer receiverId) {
        return friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(senderId, receiverId, FriendshipStatus.PENDING) ||
            friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(receiverId, senderId, FriendshipStatus.PENDING);
    }

}
