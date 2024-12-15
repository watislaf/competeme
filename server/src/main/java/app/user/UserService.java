package app.user;

import app.friendship.FriendshipRepository;
import app.friendship.FriendshipStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with receiverId: " + userId));
    }

    public boolean isFriend(Integer userId, Integer requesterId) {
        return friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(requesterId, userId, FriendshipStatus.ACCEPTED)
            || friendshipRepository.existsBySenderIdAndReceiverIdAndStatus(userId, requesterId, FriendshipStatus.ACCEPTED);
    }

    public UserProfileResponse getUserProfile(Integer userId, UserDetails userDetails) {
        System.out.println("userId: " + userId);
        Integer requesterId = ((User) userDetails).getId();
        if (!userId.equals(requesterId) && !isFriend(userId, requesterId)) return null;

        User user = getUserById(userId);

        return UserProfileResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .imageUrl(user.getImageUrl())
            .dateJoined(user.getDateJoined())
            .build();
    }

    public List<UserSearchResponse> searchUsersSorted(String keyword) {
        Sort sort = Sort.by(Sort.Direction.ASC, "name");
        return userRepository.findByNameContainingIgnoreCase(keyword, sort).stream()
            .map(user -> new UserSearchResponse(user.getId(), user.getName(), user.getImageUrl()))
            .collect(Collectors.toList());
    }
}
