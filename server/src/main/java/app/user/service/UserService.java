package app.user.service;

import app.user.entity.User;
import app.user.entity.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserById(Integer userId) {
        log.debug("Attempting to fetch user by ID: {}", userId);
        return userRepository.findById(userId)
            .orElseThrow(() -> {
                log.error("User not found with ID: {}", userId);
                return new UsernameNotFoundException("User not found with ID: " + userId);
            });
    }

    public UserProfileResponse getUserProfile(Integer userId) {
        log.info("Fetching profile for user ID: {}", userId);
        User user = getUserById(userId);

        UserProfileResponse response = UserProfileResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .imageUrl(user.getImageUrl())
            .dateJoined(user.getDateJoined())
            .role(user.getRole().toString())
            .build();

        log.debug("Successfully fetched profile for user ID: {}", userId);
        return response;
    }

    public List<UserSearchResponse> searchUsersSorted(String keyword) {
        log.info("Initiating user search with keyword: '{}'", keyword);
        Sort sort = Sort.by(Sort.Direction.ASC, "name");

        List<UserSearchResponse> results = userRepository.findByNameContainingIgnoreCase(keyword, sort).stream()
            .map(user -> new UserSearchResponse(user.getId(), user.getName(), user.getImageUrl()))
            .collect(Collectors.toList());

        log.debug("Found {} users matching keyword '{}'", results.size(), keyword);
        return results;
    }

    public void updateProfileImage(Integer userId, String imageUrl) {
        log.info("Updating profile image for user ID: {}", userId);
        User user = getUserById(userId);

        String oldImageUrl = user.getImageUrl();
        user.setImageUrl(imageUrl);
        userRepository.save(user);

        log.debug("Profile image updated for user ID: {}. Old: {}, New: {}",
            userId, oldImageUrl, imageUrl
        );
    }

    public void updateProfileName(Integer userId, String name) {
        log.info("Updating profile name for user ID: {}", userId);
        User user = getUserById(userId);

        String oldName = user.getName();
        user.setName(name);
        userRepository.save(user);

        log.debug("Profile name updated for user ID: {}. Old: '{}', New: '{}'",
            userId, oldName, name
        );
    }
}