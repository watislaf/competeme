package app.friendship;

import app.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    // Finds all friendships where the specified user is the receiver and the friendship has a specific status.
    List<Friendship> findByReceiverIdAndStatus(Integer receiverId, FriendshipStatus status);

    // Finds friendships where:
    // - The friendship has a specific status, and the specified user is the sender.
    // OR
    // - The friendship has a specific status, and the specified user is the receiver.
    // This method is useful for querying friendships regardless of whether the user initiated or received the request.
    List<Friendship> findByStatusAndSenderIdOrStatusAndReceiverId(FriendshipStatus status1, Integer senderId, FriendshipStatus status2, Integer receiverId);

    // Checks if a friendship exists between two users in either direction (sender to receiver or receiver to sender).
    boolean existsBySenderIdAndReceiverIdOrSenderIdAndReceiverId(Integer senderId, Integer receiverId, Integer receiverIdSwap, Integer senderIdSwap);
}
