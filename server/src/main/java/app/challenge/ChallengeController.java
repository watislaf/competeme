package app.challenge;

import app.challenge.service.ChallengeModificationRequest;
import app.challenge.service.ChallengeRequest;
import app.challenge.service.ChallengeResponse;
import app.challenge.service.ChallengeService;
import app.config.annotations.UserRead;
import app.config.annotations.UserWrite;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/{userId}/challenges")
@RequiredArgsConstructor
@UserWrite
public class ChallengeController {
    private final ChallengeService challengeService;

    @PostMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void addChallenge(@PathVariable Integer userId, @RequestBody ChallengeRequest challengeRequest) {
        challengeService.addChallenge(userId, challengeRequest);
    }

    @GetMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @UserRead
    public List<ChallengeResponse> getChallenges(@PathVariable Integer userId) {
        return challengeService.getChallenges(userId);
    }

    @PostMapping("/{challengeId}/progress")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void updateProgress(@PathVariable Integer userId, @PathVariable Long challengeId, @RequestParam Integer progress) {
        challengeService.updateProgress(userId, challengeId, progress);
    }

    @PostMapping("/{challengeId}/modify")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void modifyChallenge(
        @PathVariable Integer userId,
        @PathVariable Long challengeId,
        @RequestBody ChallengeModificationRequest challengeModificationRequest
    ) {
        challengeService.modifyChallenge(challengeId, challengeModificationRequest);
    }

    @DeleteMapping("/{challengeId}")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void deleteChallenge(@PathVariable Integer userId, @PathVariable Long challengeId) {
        challengeService.deleteChallenge(userId, challengeId);
    }
}
