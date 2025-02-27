package app.stats.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;
import java.util.Map;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Builder
public record StatsResponse(
    @Schema(requiredMode = REQUIRED) String totalTimeThisWeek,
    @Schema(requiredMode = REQUIRED) String currentStreak,
    @Schema(requiredMode = REQUIRED) String longestStreak,
    @Schema(requiredMode = REQUIRED) Map<String, String> mostActiveDay,
    @Schema(requiredMode = REQUIRED) String timeLoggedToday,
    @Schema(requiredMode = REQUIRED) String totalTimeLogged,
    @Schema(requiredMode = REQUIRED) Map<String, String> mostFrequentActivity,
    @Schema(requiredMode = REQUIRED) Map<String, String> topActivity,
    @Schema(requiredMode = REQUIRED) List<ActivityBreakdown> activityBreakdown,
    @Schema(requiredMode = REQUIRED) Map<String, Double> weeklyStats,
    @Schema(requiredMode = REQUIRED) Map<String, Double> monthlyStats,
    @Schema(requiredMode = REQUIRED) String totalTimeLastWeek) {
}
