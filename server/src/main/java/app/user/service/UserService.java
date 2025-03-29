package app.user.service;

import app.friendship.entity.FriendshipRepository;
import app.user.entity.User;
import app.user.entity.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with receiverId: " + userId));
    }

    public UserProfileResponse getUserProfile(Integer userId) {
        User user = getUserById(userId);

        return UserProfileResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .imageUrl(user.getImageUrl())
            .dateJoined(user.getDateJoined())
            .role(user.getRole().toString())
            .build();
    }

    public List<UserSearchResponse> searchUsersSorted(String keyword) {
        Sort sort = Sort.by(Sort.Direction.ASC, "name");
        return userRepository.findByNameContainingIgnoreCase(keyword, sort).stream()
                .map(user -> new UserSearchResponse(user.getId(), user.getName(), user.getImageUrl()))
                .collect(Collectors.toList());
    }

    public void updateProfileImage(Integer userId, String imageUrl) {
        User user = getUserById(userId);
        user.setImageUrl(imageUrl);
        userRepository.save(user);
    }

    public void updateProfileName (Integer userId, String name) {
        User user = getUserById(userId);
        user.setName(name);
        userRepository.save(user);
    }
}