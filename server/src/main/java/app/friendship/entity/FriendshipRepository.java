package app.friendship.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, FriendshipKey> {

    List<Friendship> findById_ReceiverIdAndStatus(Integer receiverId, FriendshipStatus status);

    List<Friendship> findById_SenderIdAndStatus(Integer receiverId, FriendshipStatus status);

    List<Friendship> findByStatusAndId_SenderId(FriendshipStatus status, Integer senderId);

    List<Friendship> findByStatusAndId_ReceiverId(FriendshipStatus status, Integer receiverId);

    @Query("""
            SELECT f FROM Friendship f 
            WHERE f.status = :status 
            AND ((f.id.senderId = :user1 AND f.id.receiverId = :user2) 
                 OR (f.id.senderId = :user2 AND f.id.receiverId = :user1))
        """)
    List<Friendship> findByStatusAndSenderOrReceiver(
        @Param("status") FriendshipStatus status,
        @Param("user1") Integer user1,
        @Param("user2") Integer user2
    );

    boolean existsById_SenderIdAndId_ReceiverId(Integer senderId, Integer receiverId);

    default boolean isFriendRequestExists(Integer senderId, Integer receiverId) {
        return existsById_SenderIdAndId_ReceiverId(senderId, receiverId);
    }

    @Query("""
            SELECT f FROM Friendship f 
            WHERE (f.id.senderId = :user1 AND f.id.receiverId IN :user2) 
               OR (f.id.senderId IN :user2 AND f.id.receiverId = :user1)
        """)
    List<Friendship> findBySenderAndReceiversOrReceiverAndSenders(
        @Param("user1") Integer user1,
        @Param("user2") List<Integer> user2
    );

}
