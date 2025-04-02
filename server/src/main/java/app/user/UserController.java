package app.user;

import app.config.annotations.UserReadAccess;
import app.user.service.UserProfileResponse;
import app.user.service.UserSearchResponse;
import app.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for user profile management and search operations")
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}/profile")
    @Operation(
        summary = "Get user profile",
        description = "Retrieves complete profile information for a specific user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User profile retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @UserReadAccess
    public UserProfileResponse getUserProfile(@PathVariable Integer userId) {
        return userService.getUserProfile(userId);
    }

    @GetMapping("/search")
    @Operation(
        summary = "Search users",
        description = "Searches users by name and returns sorted results",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search completed successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<UserSearchResponse> searchUsers(@RequestParam String query) {
        return userService.searchUsersSorted(query);
    }

    @PutMapping("/{id}/image")
    @Operation(
        summary = "Update profile image",
        description = "Updates the profile image URL for the authenticated user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Profile image updated successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void updateProfileImage(@PathVariable Integer id, @RequestBody String imageUrl) {
        userService.updateProfileImage(id, imageUrl);
    }

    @PutMapping("/{userId}/updateName")
    @Operation(
            summary = "Update profile name",
            description = "Updates the profile name for the authenticated user",
            security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile name updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void updateProfileName(@PathVariable Integer userId, @RequestBody String name) {
        userService.updateProfileName(userId, name);
    }
}