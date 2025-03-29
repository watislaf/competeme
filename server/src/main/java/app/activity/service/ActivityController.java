package app.activity.service;

import app.config.annotations.UserRead;
import app.config.annotations.UserWrite;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{userId}/activities")
@RequiredArgsConstructor
@UserWrite
public class ActivityController {
    private final ActivityService activityService;

    @PostMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void addActivity(@PathVariable Integer userId, @RequestBody ActivityRequest activityRequest) {
        activityService.addActivity(userId, activityRequest);
    }

    @PostMapping("/{activityId}/progress")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void addProgress(@PathVariable Integer userId, @PathVariable Long activityId, Long progressInMinutes) {
        activityService.addProgress(activityId, progressInMinutes, userId);
    }

    @DeleteMapping("/{activityId}")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void deleteActivity(@PathVariable Integer userId, @PathVariable Long activityId) {
        activityService.deleteActivity(activityId, userId);
    }

    @GetMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @UserRead
    public UserActivityResponse getActivities(@PathVariable Integer userId) {
        return activityService.getActivities(userId);
    }
}
