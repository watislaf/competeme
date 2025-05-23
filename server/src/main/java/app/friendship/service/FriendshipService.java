package app.friendship.service;

import app.friendship.entity.Friendship;
import app.friendship.entity.FriendshipKey;
import app.friendship.entity.FriendshipRepository;
import app.friendship.entity.FriendshipStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;

    public void sendFriendRequest(Integer senderId, Integer receiverId) {
        log.info("Attempting to send friend request from {} to {}", senderId, receiverId);

        if (isFriendRequestExists(senderId, receiverId)) {
            log.debug("Friend request already exists from {} to {}", senderId, receiverId);
            return;
        }

        if (isFriendRequestExists(receiverId, senderId)) {
            log.info("Found reciprocal request - auto-accepting friendship between {} and {}", receiverId, senderId);
            acceptFriendRequest(receiverId, senderId);
            return;
        }

        Friendship friendship = requestFriendship(senderId, receiverId);
        friendshipRepository.save(friendship);
        log.info("New friend request created from {} to {}", senderId, receiverId);
    }

    public void acceptFriendRequest(Integer friend1Id, Integer friend2Id) {
        log.info("Accepting friend request between {} and {}", friend1Id, friend2Id);

        List<Friendship> friendships = findFriendshipRequests(friend1Id, friend2Id, FriendshipStatus.PENDING);

        if (friendships.isEmpty()) {
            log.error("No pending friendship request found between {} and {}", friend1Id, friend2Id);
            throw new IllegalArgumentException("Friendship request not found");
        }

        if (friendships.size() == 2) {
            log.debug("Found duplicate requests - removing redundant one");
            friendshipRepository.delete(friendships.get(1));
        }

        Friendship accepted = friendships.get(0);
        accepted.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(accepted);
        log.info("Friendship established between {} and {}", friend1Id, friend2Id);
    }

    public void removeFriend(Integer userId1, Integer userId2) {
        log.info("Removing friendship between {} and {}", userId1, userId2);
        friendshipRepository.deleteAll(findFriendshipRequests(userId1, userId2, FriendshipStatus.ACCEPTED));
        log.debug("Friendship records deleted");
    }

    public List<Integer> getPendingFriendRequests(Integer userId) {
        log.debug("Fetching pending friend requests for user {}", userId);
        return friendshipRepository.findById_ReceiverIdAndStatus(userId, FriendshipStatus.PENDING).stream()
            .map(Friendship::getId)
            .map(FriendshipKey::getSenderId)
            .toList();
    }

    public List<Integer> getSentFriendRequests(Integer userId) {
        log.debug("Fetching sent friend requests by user {}", userId);
        return friendshipRepository.findById_SenderIdAndStatus(userId, FriendshipStatus.PENDING).stream()
            .map(Friendship::getId)
            .map(FriendshipKey::getReceiverId)
            .toList();
    }

    public List<Integer> getFriends(Integer userId) {
        log.debug("Fetching friends list for user {}", userId);

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
        log.debug("Found {} friends for user {}", result.size(), userId);
        return result;
    }

    public void cancelFriendRequest(Integer senderId, Integer receiverId) {
        log.info("Canceling friend request from {} to {}", senderId, receiverId);
        friendshipRepository.deleteAll(findFriendshipRequests(senderId, receiverId, FriendshipStatus.PENDING));
        friendshipRepository.deleteAll(findFriendshipRequests(receiverId, senderId, FriendshipStatus.PENDING));
        log.debug("Friend request canceled");
    }

    public List<Friendship> getStatuses(Integer userId1, List<FriendshipRequest> userId2) {
        log.debug("Checking friendship statuses between {} and {} users", userId1, userId2.size());
        List<Integer> userIds = userId2.stream()
            .map(FriendshipRequest::receiverId)
            .toList();
        return friendshipRepository.findBySenderAndReceiversOrReceiverAndSenders(userId1, userIds);
    }

    private Friendship requestFriendship(Integer senderId, Integer receiverId) {
        log.trace("Creating new friendship request object");
        return Friendship.builder()
            .id(FriendshipKey.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .build())
            .status(FriendshipStatus.PENDING)
            .build();
    }

    private List<Friendship> findFriendshipRequests(Integer userId1, Integer userId2, FriendshipStatus status) {
        log.trace("Finding friendship requests between {} and {} with status {}", userId1, userId2, status);
        return friendshipRepository.findByStatusAndSenderOrReceiver(status, userId1, userId2);
    }

    private boolean isFriendRequestExists(Integer senderId, Integer receiverId) {
        log.trace("Checking if friend request exists from {} to {}", senderId, receiverId);
        return friendshipRepository.existsById_SenderIdAndId_ReceiverId(senderId, receiverId);
    }

    public boolean isFriend(Integer senderId, Integer receiverId) {
        log.debug("Checking if {} and {} are friends", senderId, receiverId);
        return friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(senderId, receiverId, FriendshipStatus.ACCEPTED) ||
            friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(receiverId, senderId, FriendshipStatus.ACCEPTED);
    }

    public boolean hasPendingRequest(Integer senderId, Integer receiverId) {
        log.debug("Checking pending requests between {} and {}", senderId, receiverId);
        return friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(senderId, receiverId, FriendshipStatus.PENDING) ||
            friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(receiverId, senderId, FriendshipStatus.PENDING);
    }
}