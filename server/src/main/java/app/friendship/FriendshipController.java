package app.friendship;

import app.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/friends")
@RequiredArgsConstructor
public class FriendshipController {
    private final FriendshipService friendshipService;

    @PostMapping("/sendRequest")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public Void sendFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.sendFriendRequest(userId, request);
        return null;
    }

    @PostMapping("/accept")
    public Void acceptFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.acceptFriendRequest(userId, request);
        return null;
    }

    @PostMapping("/remove")
    public Void removeFriend(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.removeFriend(userId, request);
        return null;
    }

    @GetMapping("/request")
    public List<Integer> getFriendRequests(@PathVariable Integer userId) {
        return friendshipService.getPendingFriendRequests(userId);
    }

    @GetMapping("/")
    public ResponseEntity<List<Integer>> getFriends(@PathVariable Integer userId, Authentication authentication) {
        Integer requesterId = ((User) authentication.getPrincipal()).getId();
        List<Integer> friends = friendshipService.getFriends(requesterId, userId);
        return ResponseEntity.ok(friends);
    }
}
