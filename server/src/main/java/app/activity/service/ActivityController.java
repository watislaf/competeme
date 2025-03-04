package app.activity.service;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{userId}/activities")
@RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;

    @PostMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public void addActivity(@PathVariable Integer userId, @RequestBody ActivityRequest activityRequest) {
        activityService.addActivity(userId, activityRequest);
    }

    @PostMapping("/{activityId}/progress")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public void addProgress(@PathVariable Integer userId, @PathVariable Long activityId, Long progressInMinutes) {
        activityService.addProgress(activityId, progressInMinutes);
    }

    @DeleteMapping("/{activityId}")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public void deleteActivity(@PathVariable Integer userId, @PathVariable Long activityId) {
        activityService.deleteActivity(activityId);
    }

    @GetMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public UserActivityResponse getActivities(@PathVariable Integer userId) {
        return activityService.getActivities(userId);
    }
}
