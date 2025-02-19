package app.challenge;

import app.challenge.service.ChallengeRequest;
import app.challenge.service.ChallengeResponse;
import app.challenge.service.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/{userId}/challenges")
@RequiredArgsConstructor
public class ChallengeController {
    private final ChallengeService challengeService;

    @PostMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void addChallenge(@PathVariable Integer userId, @RequestBody ChallengeRequest challengeRequest) {
        challengeService.addChallenge(userId, challengeRequest);
    }

    @GetMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public List<ChallengeResponse> getChallenges(@PathVariable Integer userId) {
        return challengeService.getChallenges(userId);
    }

    @PostMapping("/{challengeId}/progress")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public void updateProgress(@PathVariable Integer userId, @PathVariable Long challengeId, @RequestParam Integer progress) {
        challengeService.updateProgress(userId, challengeId, progress);
    }
}
