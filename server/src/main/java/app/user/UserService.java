package app.user;

import app.friendship.FriendshipRepository;
import app.friendship.FriendshipStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.nio.file.AccessDeniedException;
import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
    }

    public boolean isFriend(Integer userId, Integer requesterId) {
        return friendshipRepository.findByStatusAndSenderIdOrStatusAndReceiverId(
                        FriendshipStatus.ACCEPTED, requesterId, FriendshipStatus.ACCEPTED, requesterId).stream()
                .anyMatch(friendship -> friendship.getSenderId().equals(userId) || friendship.getReceiverId().equals(userId));
    }

    public UserProfileResponse getUserProfile(Integer userId, UserDetails userDetails) {

        Integer requesterId = ((User) userDetails).getId();
        if (!userId.equals(requesterId) && !isFriend(userId, requesterId))  return null;

        User user = getUserById(userId);
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .dateJoined(user.getDateJoined())
                .build();

        return response;
    }

    public List<UserSearchResponse> searchUsersSorted(String keyword) {
        Sort sort = Sort.by(Sort.Direction.ASC, "name");
        return userRepository.findByNameContainingIgnoreCase(keyword, sort).stream()
                .map(user -> new UserSearchResponse(user.getId(), user.getName(), user.getImageUrl()))
                .collect(Collectors.toList());
    }
}

