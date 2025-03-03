package app.stats.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@Builder
public record StatsResponse(
    @Schema(requiredMode = REQUIRED) String totalTimeThisWeek,
    @Schema(requiredMode = REQUIRED) String currentStreak,
    @Schema(requiredMode = REQUIRED) String longestStreak,
    @Schema(requiredMode = REQUIRED) MostActiveDay mostActiveDay,
    @Schema(requiredMode = REQUIRED) String timeLoggedToday,
    @Schema(requiredMode = REQUIRED) String totalTimeLogged,
    @Schema(requiredMode = REQUIRED) ActivityStat mostFrequentActivity,
    @Schema(requiredMode = REQUIRED) ActivityStat topActivity,
    @Schema(requiredMode = REQUIRED) List<ActivityBreakdown> activityBreakdown,
    @Schema(requiredMode = REQUIRED) List<WeeklyStat> weeklyStats,
    @Schema(requiredMode = REQUIRED) List<MonthlyStat> monthlyStats,
    @Schema(requiredMode = REQUIRED) String totalTimeLastWeek) {
}
