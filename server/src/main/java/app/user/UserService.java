package app.user;

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

import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
    }

    public ResponseEntity<UserProfileResponse> getUserProfile(Integer userId, UserDetails userDetails) {
        if (!userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN") || auth.getAuthority().equals("USER"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

        User user = getUserById(userId);
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .dateJoined(user.getDateJoined())
                .build();
        return ResponseEntity.ok(response);
    }

    public List<UserSearchResponse> searchUsersSorted(String keyword) {
        Sort sort = Sort.by(Sort.Direction.ASC, "name");
        return userRepository.findByNameContainingIgnoreCase(keyword, sort).stream()
                .map(user -> new UserSearchResponse(user.getId(), user.getName(), user.getImageUrl()))
                .collect(Collectors.toList());
    }
}

