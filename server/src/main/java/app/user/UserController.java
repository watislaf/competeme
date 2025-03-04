package app.user;


import app.user.service.UserProfileResponse;
import app.user.service.UserSearchResponse;
import app.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}/profile")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public UserProfileResponse getUserProfile(@PathVariable Integer userId) {
        return userService.getUserProfile(userId);
    }

    @GetMapping("/search")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public List<UserSearchResponse> searchUsers(@RequestParam String query) {
        return userService.searchUsersSorted(query);
    }
}
