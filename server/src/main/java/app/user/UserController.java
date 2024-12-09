package app.user;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}/idprofile")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Integer userId, @AuthenticationPrincipal UserDetails userDetails) throws AccessDeniedException {
        return userService.getUserProfile(userId, userDetails);
    }

    @GetMapping("/search")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public List<UserSearchResponse> searchUsers(@RequestParam String query) {
        return userService.searchUsersSorted(query);
    }
}
