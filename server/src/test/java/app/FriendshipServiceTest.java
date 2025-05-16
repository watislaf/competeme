package app;

import app.friendship.entity.*;
import app.friendship.service.FriendshipRequest;
import app.friendship.service.FriendshipService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

class FriendshipServiceTest {

    private FriendshipRepository friendshipRepository;
    private FriendshipService friendshipService;

    private final Integer senderId = 1;
    private final Integer receiverId = 2;
    private final Integer userId = 1;

    @BeforeEach
    void setUp() {
        friendshipRepository = mock(FriendshipRepository.class);
        friendshipService = new FriendshipService(friendshipRepository);
    }

    @Test
    void shouldSendFriendRequest_whenRequestNotExists() {
        when(friendshipRepository.existsById_SenderIdAndId_ReceiverId(senderId, receiverId)).thenReturn(false);
        when(friendshipRepository.existsById_SenderIdAndId_ReceiverId(receiverId, senderId)).thenReturn(false);

        friendshipService.sendFriendRequest(senderId, receiverId);

        ArgumentCaptor<Friendship> captor = ArgumentCaptor.forClass(Friendship.class);
        verify(friendshipRepository).save(captor.capture());

        Friendship saved = captor.getValue();
        assertThat(saved.getId().getSenderId()).isEqualTo(senderId);
        assertThat(saved.getId().getReceiverId()).isEqualTo(receiverId);
        assertThat(saved.getStatus()).isEqualTo(FriendshipStatus.PENDING);
    }

    @Test
    void shouldNotSendFriendRequest_whenRequestAlreadyExists() {
        when(friendshipRepository.existsById_SenderIdAndId_ReceiverId(senderId, receiverId)).thenReturn(true);

        friendshipService.sendFriendRequest(senderId, receiverId);

        verify(friendshipRepository, never()).save(any());
    }


    @Test
    void shouldAcceptFriendRequest_whenPendingExists() {
        Friendship pending = Friendship.builder()
                .id(FriendshipKey.builder().senderId(senderId).receiverId(receiverId).build())
                .status(FriendshipStatus.PENDING)
                .build();

        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, senderId, receiverId))
                .thenReturn(List.of(pending));

        friendshipService.acceptFriendRequest(senderId, receiverId);

        assertThat(pending.getStatus()).isEqualTo(FriendshipStatus.ACCEPTED);
        verify(friendshipRepository).save(pending);
    }

    @Test
    void shouldThrowException_whenAcceptingNonexistentFriendRequest() {
        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, senderId, receiverId))
                .thenReturn(List.of());

        assertThatThrownBy(() -> friendshipService.acceptFriendRequest(senderId, receiverId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Friendship request not found");

        verify(friendshipRepository, never()).save(any());
    }

    @Test
    void shouldRemoveFriend_whenFriendshipAcceptedExists() {
        Integer userId1 = 1;
        Integer userId2 = 2;

        Friendship accepted = Friendship.builder()
                .id(FriendshipKey.builder().senderId(userId1).receiverId(userId2).build())
                .status(FriendshipStatus.ACCEPTED)
                .build();

        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.ACCEPTED, userId1, userId2))
                .thenReturn(List.of(accepted));

        friendshipService.removeFriend(userId1, userId2);

        verify(friendshipRepository).deleteAll(List.of(accepted));
    }

    @Test
    void shouldDoNothing_whenNoPendingFriendRequestExists() {
        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, senderId, receiverId))
                .thenReturn(List.of());
        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, receiverId, senderId))
                .thenReturn(List.of());

        friendshipService.cancelFriendRequest(senderId, receiverId);

        verify(friendshipRepository, times(2)).deleteAll(eq(List.of()));
    }

    @Test
    void shouldReturnPendingFriendRequests_whenTheyExist() {
        Friendship pending1 = Friendship.builder()
                .id(FriendshipKey.builder().senderId(2).receiverId(userId).build())
                .status(FriendshipStatus.PENDING)
                .build();
        Friendship pending2 = Friendship.builder()
                .id(FriendshipKey.builder().senderId(3).receiverId(userId).build())
                .status(FriendshipStatus.PENDING)
                .build();

        when(friendshipRepository.findById_ReceiverIdAndStatus(userId, FriendshipStatus.PENDING))
                .thenReturn(List.of(pending1, pending2));

        List<Integer> result = friendshipService.getPendingFriendRequests(userId);

        assertThat(result).containsExactlyInAnyOrder(2, 3);
    }

    @Test
    void shouldReturnEmptyList_whenNoPendingFriendRequestsExist() {
        when(friendshipRepository.findById_ReceiverIdAndStatus(userId, FriendshipStatus.PENDING))
                .thenReturn(List.of());

        List<Integer> result = friendshipService.getPendingFriendRequests(userId);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnSentFriendRequests_whenTheyExist() {
        Friendship sent1 = TestFriendshipFactory.create(userId, 2, FriendshipStatus.PENDING);
        Friendship sent2 = TestFriendshipFactory.create(userId, 3, FriendshipStatus.PENDING);

        when(friendshipRepository.findById_SenderIdAndStatus(userId, FriendshipStatus.PENDING))
                .thenReturn(List.of(sent1, sent2));

        List<Integer> result = friendshipService.getSentFriendRequests(userId);

        assertThat(result).containsExactlyInAnyOrder(2, 3);
    }

    @Test
    void shouldReturnEmptyList_whenNoSentFriendRequestsExist() {
        when(friendshipRepository.findById_SenderIdAndStatus(userId, FriendshipStatus.PENDING))
                .thenReturn(List.of());

        List<Integer> result = friendshipService.getSentFriendRequests(userId);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnListOfFriends_whenFriendsExist() {
        Friendship sentFriendship = Friendship.builder()
                .id(FriendshipKey.builder().senderId(userId).receiverId(2).build())
                .status(FriendshipStatus.ACCEPTED)
                .build();

        Friendship receivedFriendship = Friendship.builder()
                .id(FriendshipKey.builder().senderId(3).receiverId(userId).build())
                .status(FriendshipStatus.ACCEPTED)
                .build();

        when(friendshipRepository.findByStatusAndId_SenderId(FriendshipStatus.ACCEPTED, userId))
                .thenReturn(List.of(sentFriendship));
        when(friendshipRepository.findByStatusAndId_ReceiverId(FriendshipStatus.ACCEPTED, userId))
                .thenReturn(List.of(receivedFriendship));

        List<Integer> result = friendshipService.getFriends(userId);

        assertThat(result).containsExactlyInAnyOrder(2, 3);
    }

    @Test
    void shouldReturnEmptyList_whenNoFriendsExist() {
        when(friendshipRepository.findByStatusAndId_SenderId(FriendshipStatus.ACCEPTED, userId))
                .thenReturn(List.of());
        when(friendshipRepository.findByStatusAndId_ReceiverId(FriendshipStatus.ACCEPTED, userId))
                .thenReturn(List.of());

        List<Integer> result = friendshipService.getFriends(userId);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldCancelFriendRequest_whenPendingRequestsExistInBothDirections() {
       Friendship pending1 = Friendship.builder()
                .id(FriendshipKey.builder().senderId(senderId).receiverId(receiverId).build())
                .status(FriendshipStatus.PENDING)
                .build();
        Friendship pending2 = Friendship.builder()
                .id(FriendshipKey.builder().senderId(receiverId).receiverId(senderId).build())
                .status(FriendshipStatus.PENDING)
                .build();

        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, senderId, receiverId))
                .thenReturn(List.of(pending1));
        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, receiverId, senderId))
                .thenReturn(List.of(pending2));

        friendshipService.cancelFriendRequest(senderId, receiverId);

        verify(friendshipRepository).deleteAll(List.of(pending1));
        verify(friendshipRepository).deleteAll(List.of(pending2));
    }

    @Test
    void shouldNotThrow_whenNoPendingRequestsToCancel() {
        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, senderId, receiverId))
                .thenReturn(List.of());
        when(friendshipRepository.findByStatusAndSenderOrReceiver(FriendshipStatus.PENDING, receiverId, senderId))
                .thenReturn(List.of());

        friendshipService.cancelFriendRequest(senderId, receiverId);

        verify(friendshipRepository, times(2)).deleteAll(eq(List.of()));
    }

    @Test
    void shouldReturnStatusesBetweenUsers() {
        Integer userId1 = 1;
        List<FriendshipRequest> requestList = List.of(
                new FriendshipRequest(2),
                new FriendshipRequest(3)
        );

        List<Friendship> friendships = List.of(
                Friendship.builder()
                        .id(FriendshipKey.builder().senderId(1).receiverId(2).build())
                        .status(FriendshipStatus.ACCEPTED)
                        .build(),
                Friendship.builder()
                        .id(FriendshipKey.builder().senderId(3).receiverId(1).build())
                        .status(FriendshipStatus.PENDING)
                        .build()
        );

        when(friendshipRepository.findBySenderAndReceiversOrReceiverAndSenders(eq(userId1), eq(List.of(2, 3))))
                .thenReturn(friendships);

        List<Friendship> result = friendshipService.getStatuses(userId1, requestList);

        assertThat(result).hasSize(2).containsExactlyInAnyOrderElementsOf(friendships);
    }

    @Test
    void shouldReturnEmptyList_whenNoStatusesFound() {
        Integer userId1 = 1;
        List<FriendshipRequest> requestList = List.of(
                new FriendshipRequest(2),
                new FriendshipRequest(3)
        );

        when(friendshipRepository.findBySenderAndReceiversOrReceiverAndSenders(eq(userId1), eq(List.of(2, 3))))
                .thenReturn(List.of());

        List<Friendship> result = friendshipService.getStatuses(userId1, requestList);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnTrue_whenFriendshipAcceptedExistsInOneDirection() {
        Integer user1 = 1;
        Integer user2 = 2;

        when(friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(user1, user2, FriendshipStatus.ACCEPTED))
                .thenReturn(true);

        boolean result = friendshipService.isFriend(user1, user2);

        assertThat(result).isTrue();
    }

    @Test
    void shouldReturnFalse_whenNoAcceptedFriendshipExists() {
        Integer user1 = 1;
        Integer user2 = 2;

        when(friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(user1, user2, FriendshipStatus.ACCEPTED))
                .thenReturn(false);
        when(friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(user2, user1, FriendshipStatus.ACCEPTED))
                .thenReturn(false);

        boolean result = friendshipService.isFriend(user1, user2);

        assertThat(result).isFalse();
    }

    @Test
    void shouldReturnTrue_whenPendingRequestExistsInOneDirection() {
        Integer user1 = 1;
        Integer user2 = 2;

        when(friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(user1, user2, FriendshipStatus.PENDING))
                .thenReturn(true);

        boolean result = friendshipService.hasPendingRequest(user1, user2);

        assertThat(result).isTrue();
    }

    @Test
    void shouldReturnFalse_whenNoPendingRequestExists() {
        Integer user1 = 1;
        Integer user2 = 2;

        when(friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(user1, user2, FriendshipStatus.PENDING))
                .thenReturn(false);
        when(friendshipRepository.existsById_SenderIdAndId_ReceiverIdAndStatus(user2, user1, FriendshipStatus.PENDING))
                .thenReturn(false);

        boolean result = friendshipService.hasPendingRequest(user1, user2);

        assertThat(result).isFalse();
    }


}
