package app.challenge;

import app.challenge.service.ChallengeModificationRequest;
import app.challenge.service.ChallengeRequest;
import app.challenge.service.ChallengeResponse;
import app.challenge.service.ChallengeService;
import app.config.annotations.UserModificationAccess;
import app.config.annotations.UserReadAccess;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/{userId}/challenges")
@RequiredArgsConstructor
@UserModificationAccess
@Tag(name = "Challenges", description = "Endpoints for managing user challenges and tracking progress")
public class ChallengeController {
    private final ChallengeService challengeService;

    @PostMapping("/")
    @Operation(
        summary = "Create new challenge",
        description = "Adds a new challenge for the specified user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenge created successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void addChallenge(@PathVariable Integer userId, @RequestBody ChallengeRequest challengeRequest) {
        challengeService.addChallenge(userId, challengeRequest);
    }

    @GetMapping("/")
    @Operation(
        summary = "Get user challenges",
        description = "Retrieves all challenges for the specified user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @UserReadAccess
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenges retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public List<ChallengeResponse> getChallenges(@PathVariable Integer userId) {
        return challengeService.getChallenges(userId);
    }

    @PostMapping("/{challengeId}/progress")
    @Operation(
        summary = "Update challenge progress",
        description = "Updates the progress of a specific challenge",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Progress updated successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void updateProgress(
        @PathVariable Integer userId,
        @PathVariable Long challengeId,
        @RequestParam Integer progress
    ) {
        challengeService.updateProgress(userId, challengeId, progress);
    }

    @PostMapping("/{challengeId}/modify")
    @Operation(
        summary = "Modify challenge",
        description = "Updates the details of an existing challenge",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenge modified successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void modifyChallenge(
        @PathVariable Integer userId,
        @PathVariable Long challengeId,
        @RequestBody ChallengeModificationRequest challengeModificationRequest
    ) {
        challengeService.modifyChallenge(challengeId, challengeModificationRequest);
    }

    @DeleteMapping("/{challengeId}")
    @Operation(
        summary = "Delete challenge",
        description = "Removes a specific challenge from the user's profile",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Challenge deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public void deleteChallenge(@PathVariable Integer userId, @PathVariable Long challengeId) {
        challengeService.deleteChallenge(userId, challengeId);
    }
}