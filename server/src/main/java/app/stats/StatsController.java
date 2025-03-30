package app.stats;

import app.config.annotations.UserRead;
import app.stats.service.StatsResponse;
import app.stats.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/stats")
@RequiredArgsConstructor
@Tag(name = "User Statistics", description = "Endpoints for retrieving user statistics and analytics")
public class StatsController {
    private final StatsService statsService;

    @GetMapping("/")
    @Operation(
        summary = "Get user statistics",
        description = "Retrieves statistics and analytics for the specified user",
        security = {@SecurityRequirement(name = "JwtAuth")}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized access"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @UserRead
    public StatsResponse getStats(@PathVariable Integer userId) {
        return statsService.getStats(userId);
    }
}