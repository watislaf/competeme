package app.activity.service;

import app.config.annotations.UserModificationAccess;
import app.config.annotations.UserReadAccess;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{userId}/activities")
@RequiredArgsConstructor
@UserModificationAccess
@Tag(name = "Activities", description = "Endpoints for managing user activities and progress tracking")
public class ActivityController {
    private final ActivityService activityService;

    @PostMapping("/")
    @Operation(
        summary = "Add new activity",
        description = "Creates a new activity record for the specified user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Activity successfully created"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void addActivity(@PathVariable Integer userId, @RequestBody ActivityRequest activityRequest) {
        activityService.addActivity(userId, activityRequest);
    }

    @PostMapping("/{activityId}/progress")
    @Operation(
        summary = "Add progress to activity",
        description = "Records progress time (in minutes) for a specific activity",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Progress successfully recorded"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void addProgress(@PathVariable Integer userId, @PathVariable Long activityId, Long progressInMinutes) {
        activityService.addProgress(activityId, progressInMinutes, userId);
    }

    @DeleteMapping("/{activityId}")
    @Operation(
        summary = "Delete activity",
        description = "Removes a specific activity from the user's records",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Activity successfully deleted"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void deleteActivity(@PathVariable Integer userId, @PathVariable Long activityId) {
        activityService.deleteActivity(activityId, userId);
    }

    @GetMapping("/")
    @Operation(
        summary = "Get user activities",
        description = "Retrieves all activities for the specified user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @UserReadAccess
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Activities successfully retrieved"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public UserActivityResponse getActivities(@PathVariable Integer userId) {
        return activityService.getActivities(userId);
    }

    @GetMapping("/random")
    @Operation(
        summary = "Get random activity",
        description = "Retrieves a random activity",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Activity successfully retrieved"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public String getRandomActivity(@PathVariable Integer userId) {
        return activityService.getRandomActivity(userId);
    }
}