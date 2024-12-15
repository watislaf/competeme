package app.friendship;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    List<Friendship> findByReceiverIdAndStatus(Integer receiverId, FriendshipStatus status);


    List<Friendship> findByStatusAndSenderId(
        FriendshipStatus status1,
        Integer senderId
    );

    List<Friendship> findByStatusAndReceiverId(
        FriendshipStatus status,
        Integer receiverId
    );


    boolean existsBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

    boolean existsBySenderIdAndReceiverIdAndStatus(
        Integer senderId,
        Integer receiverId,
        FriendshipStatus status
    );
}
