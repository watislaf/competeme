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
    private final UserLogger userLogger = new UserLogger(log);

    public User getUserById(Integer userId) {
        validateUserId(userId);
        userLogger.logUserLookup(userId);
        
        long dbStartTime = System.currentTimeMillis();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                userLogger.logUserNotFoundError(userId);
                return new UsernameNotFoundException("User not found with ID: " + userId);
            });
        
        userLogger.logDatabaseOperation("FETCH_USER_BY_ID", userId, dbStartTime);
        return user;
    }

    public UserProfileResponse getUserProfile(Integer userId) {
        long startTime = System.currentTimeMillis();
        userLogger.logFetchingUserProfile(userId);

        User user = getUserById(userId);
        UserProfileResponse response = buildProfileResponse(user);

        userLogger.logProfileFetched(userId);
        userLogger.logProfileFetchPerformance(userId, startTime);
        
        return response;
    }

    public List<UserSearchResponse> searchUsersSorted(String keyword) {
        long startTime = System.currentTimeMillis();
        validateSearchKeyword(keyword);
        userLogger.logSearchingUsers(keyword);

        Sort sort = Sort.by(Sort.Direction.ASC, "name");

        long dbStartTime = System.currentTimeMillis();
        List<UserSearchResponse> results = userRepository.findByNameContainingIgnoreCase(keyword, sort).stream()
            .map(this::mapToSearchResponse)
            .collect(Collectors.toList());
        userLogger.logDatabaseOperation("SEARCH_USERS", null, dbStartTime);

        userLogger.logUsersFound(results.size(), keyword);
        userLogger.logSearchPerformance(keyword, startTime);
        
        return results;
    }

    public void updateProfileImage(Integer userId, String imageUrl) {
        long startTime = System.currentTimeMillis();
        validateUserId(userId);
        validateImageUrl(imageUrl);
        userLogger.logUpdatingProfileImage(userId);

        User user = getUserById(userId);
        String oldImageUrl = user.getImageUrl();
        
        long dbStartTime = System.currentTimeMillis();
        user.setImageUrl(imageUrl);
        userRepository.save(user);
        userLogger.logDatabaseOperation("UPDATE_PROFILE_IMAGE", userId, dbStartTime);

        userLogger.logImageUpdated(userId, oldImageUrl, imageUrl);
        userLogger.logUserProfileUpdatePerformance(userId, "IMAGE", startTime);
    }

    public void updateProfileName(Integer userId, String name) {
        long startTime = System.currentTimeMillis();
        validateUserId(userId);
        validateProfileName(name);
        userLogger.logUpdatingProfileName(userId);

        User user = getUserById(userId);
        String oldName = user.getName();
        
        long dbStartTime = System.currentTimeMillis();
        user.setName(name);
        userRepository.save(user);
        userLogger.logDatabaseOperation("UPDATE_PROFILE_NAME", userId, dbStartTime);

        userLogger.logNameUpdated(userId, oldName, name);
        userLogger.logUserProfileUpdatePerformance(userId, "NAME", startTime);
    }

    private void validateUserId(Integer userId) {
        if (userId == null || userId <= 0) {
            userLogger.logInvalidUserId(userId);
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
    }

    private void validateSearchKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            userLogger.logEmptySearchKeyword();
            throw new IllegalArgumentException("Search keyword cannot be empty");
        }
        
        if (keyword.trim().length() < 2) {
            userLogger.logSearchTooShort(keyword);
        }
    }

    private void validateImageUrl(String imageUrl) {
        if (imageUrl != null && imageUrl.length() > 1000) {
            userLogger.logImageUrlTooLong();
            throw new IllegalArgumentException("Image URL too long");
        }
    }

    private void validateProfileName(String name) {
        if (name == null || name.trim().isEmpty()) {
            userLogger.logProfileNameEmpty();
            throw new IllegalArgumentException("Profile name cannot be empty");
        }
        
        if (name.length() > 100) {
            userLogger.logProfileNameTooLong();
            throw new IllegalArgumentException("Profile name too long");
        }
    }

    private UserProfileResponse buildProfileResponse(User user) {
        return UserProfileResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .imageUrl(user.getImageUrl())
            .dateJoined(user.getDateJoined())
            .role(user.getRole().toString())
            .build();
    }

    private UserSearchResponse mapToSearchResponse(User user) {
        return new UserSearchResponse(user.getId(), user.getName(), user.getImageUrl());
    }
}