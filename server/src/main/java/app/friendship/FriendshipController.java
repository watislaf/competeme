package app.friendship;

import app.config.annotations.UserModificationAccess;
import app.config.annotations.UserReadAccess;
import app.friendship.entity.Friendship;
import app.friendship.service.FriendshipRequest;
import app.friendship.service.FriendshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/{userId}/friends")
@RequiredArgsConstructor
@UserModificationAccess
@Tag(name = "Friendship Management", description = "Endpoints for managing user friendships and friend requests")
public class FriendshipController {
    private final FriendshipService friendshipService;

    @PostMapping("/sendRequest")
    @Operation(
        summary = "Send friend request",
        description = "Sends a friend request to another user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend request sent successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void sendFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.sendFriendRequest(userId, request.receiverId());
    }

    @PostMapping("/accept")
    @Operation(
        summary = "Accept friend request",
        description = "Accepts a pending friend request from another user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend request accepted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void acceptFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.acceptFriendRequest(userId, request.receiverId());
    }

    @PostMapping("/remove")
    @Operation(
        summary = "Remove friend",
        description = "Removes a friend from the user's friend list",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend removed successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void removeFriend(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.removeFriend(userId, request.receiverId());
    }

    @GetMapping("/request")
    @Operation(
        summary = "Get pending friend requests",
        description = "Retrieves list of user IDs who sent friend requests to the current user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pending requests retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<Integer> getFriendRequests(@PathVariable Integer userId) {
        return friendshipService.getPendingFriendRequests(userId);
    }

    @GetMapping("/sent")
    @Operation(
        summary = "Get sent friend requests",
        description = "Retrieves list of user IDs to whom the current user sent friend requests",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sent requests retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<Integer> getSentFriendRequests(@PathVariable Integer userId) {
        return friendshipService.getSentFriendRequests(userId);
    }

    @GetMapping("/")
    @Operation(
        summary = "Get friends list",
        description = "Retrieves list of user IDs who are friends with the current user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @UserReadAccess
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friends list retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<Integer> getFriends(@PathVariable Integer userId) {
        return friendshipService.getFriends(userId);
    }

    @PostMapping("/cancel")
    @Operation(
        summary = "Cancel friend request",
        description = "Cancels a previously sent friend request",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend request cancelled successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void cancelFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.cancelFriendRequest(userId, request.receiverId());
    }

    @GetMapping("/statuses")
    @Operation(
        summary = "Get friendship statuses",
        description = "Retrieves friendship statuses between current user and multiple other users",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statuses retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<Friendship> getStatuses(@PathVariable Integer userId, @RequestBody List<FriendshipRequest> receiverIds) {
        return friendshipService.getStatuses(userId, receiverIds);
    }

    @GetMapping("/status/{receiverId}")
    @Operation(
        summary = "Check friendship status",
        description = "Checks if the current user is friends with another user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status check completed successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public boolean isFriend(@PathVariable Integer userId, @PathVariable Integer receiverId) {
        return friendshipService.isFriend(userId, receiverId);
    }

    @GetMapping("/pending/{receiverId}")
    @Operation(
        summary = "Check pending request",
        description = "Checks if there's a pending friend request between users",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Check completed successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public boolean hasPendingRequest(@PathVariable Integer userId, @PathVariable Integer receiverId) {
        return friendshipService.hasPendingRequest(userId, receiverId);
    }
}