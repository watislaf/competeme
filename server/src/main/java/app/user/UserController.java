package app.user;


import app.config.annotations.UserRead;
import app.user.service.UserProfileResponse;
import app.user.service.UserSearchResponse;
import app.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}/profile")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @UserRead
    public UserProfileResponse getUserProfile(@PathVariable Integer userId) {
        return userService.getUserProfile(userId);
    }

    @GetMapping("/search")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public List<UserSearchResponse> searchUsers(@RequestParam String query) {
        return userService.searchUsersSorted(query);
    }

    @PutMapping("/{id}/image")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void updateProfileImage(@PathVariable Integer id, @RequestBody String imageUrl) {
        userService.updateProfileImage(id, imageUrl);
    }
}
