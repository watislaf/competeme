package app.friendship;

import app.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/{userId}/friends")
@RequiredArgsConstructor
public class FriendshipController {
    private final FriendshipService friendshipService;

    @PostMapping("/sendRequest")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void sendFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.sendFriendRequest(userId, request.receiverId());
    }

    @PostMapping("/accept")
    public void acceptFriendRequest(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.acceptFriendRequest(userId, request.receiverId());
    }

    @PostMapping("/remove")
    public void removeFriend(@PathVariable Integer userId, @RequestBody FriendshipRequest request) {
        friendshipService.removeFriend(userId, request.receiverId());
    }

    @GetMapping("/request")
    public List<Integer> getFriendRequests(@PathVariable Integer userId) {
        return friendshipService.getPendingFriendRequests(userId);
    }

    @GetMapping("/")
    public List<Integer> getFriends(@PathVariable Integer userId, User sender) {
        return friendshipService.getFriends(sender.getId(), userId);
    }
}
