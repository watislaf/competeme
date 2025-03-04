package app.stats;

import app.stats.service.StatsResponse;
import app.stats.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/stats")
@RequiredArgsConstructor
public class StatsController {
    private final StatsService statsService;

    @GetMapping("/")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    @PreAuthorize("@jwtService.hasAccess(authentication, #userId)")
    public StatsResponse getStats(@PathVariable Integer userId) {
        return statsService.getStats(userId);
    }
}
