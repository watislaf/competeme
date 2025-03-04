package app.friendship;

import app.friendship.entity.Friendship;
import app.friendship.service.FriendshipRequest;
import app.friendship.service.FriendshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/{userId}/friends")
@RequiredArgsConstructor
public class FriendshipController {
    private final FriendshipService friendshipService;

    @PostMapping("/sendRequest")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public void sendFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.sendFriendRequest(userId, request.receiverId());
    }

    @PostMapping("/accept")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public void acceptFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.acceptFriendRequest(userId, request.receiverId());
    }

    @PostMapping("/remove")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public void removeFriend(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.removeFriend(userId, request.receiverId());
    }

    @GetMapping("/request")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public List<Integer> getFriendRequests(@PathVariable Integer userId) {
        return friendshipService.getPendingFriendRequests(userId);
    }

    @GetMapping("/sent")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public List<Integer> getSentFriendRequests(@PathVariable Integer userId) {
        return friendshipService.getSentFriendRequests(userId);
    }

    @GetMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public List<Integer> getFriends(@PathVariable Integer userId) {
        return friendshipService.getFriends(userId);
    }

    @PostMapping("/cancel")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public void cancelFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.cancelFriendRequest(userId, request.receiverId());
    }

    @GetMapping("/statuses")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public List<Friendship> getStatuses(@PathVariable Integer userId, @RequestBody List<FriendshipRequest> receiverIds) {
        return friendshipService.getStatuses(userId, receiverIds);
    }

    @GetMapping("/status/{receiverId}")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public boolean isFriend(@PathVariable Integer userId, @PathVariable Integer receiverId) {
        return friendshipService.isFriend(userId, receiverId);
    }

    @GetMapping("/pending/{receiverId}")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public boolean hasPendingRequest(@PathVariable Integer userId, @PathVariable Integer receiverId) {
        return friendshipService.hasPendingRequest(userId, receiverId);
    }

}
