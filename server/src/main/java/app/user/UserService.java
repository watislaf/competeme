package app.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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

    public List<UserSearchResponse> searchUsers(String query) {
        Pageable pageable = PageRequest.of(0, 5); // Pierwsza strona, 5 wyników
        return userRepository.findByNameContainingIgnoreCase(query, pageable).stream()
                .map(user -> new UserSearchResponse(user.getId(), user.getName(), user.getImageUrl()))
                .collect(Collectors.toList());
    }
}

