package app.stats.service;

import app.activity.entity.Activity;
import app.activity.entity.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {
    private static final int DAYS_IN_WEEK = 7;
    private static final int HOURS_IN_DAY = 24;
    private static final int FIRST_DAY_OF_WEEK = 1;
    private final ActivityRepository activityRepository;
    private final TimeFormatter timeFormatter;

    @Cacheable(value = "statsCache", key = "#userId")
    public StatsResponse getStats(Integer userId) {
        List<Activity> userActivities = activityRepository.findByUserId(userId);

        return StatsResponse.builder()
            .totalTimeThisWeek(timeFormatter.formatDuration(getTotalTimeThisWeek(userActivities)))
            .currentStreak(timeFormatter.formatPeriod(getCurrentStreak(userActivities)))
            .longestStreak(timeFormatter.formatPeriod(getLongestStreak(userActivities)))
            .mostActiveDay(getMostActiveDay(userActivities))
            .timeLoggedToday(timeFormatter.formatDuration(getTimeLoggedToday(userActivities)))
            .totalTimeLogged(timeFormatter.formatDuration(getTotalTimeLogged(userActivities)))
            .mostFrequentActivity(getMostFrequentActivity(userActivities))
            .topActivity(getTopActivity(userActivities))
            .activityBreakdown(getActivityBreakdown(userActivities))
            .weeklyStats(getWeeklyStats(userActivities))
            .monthlyStats(getMonthlyStats(userActivities))
            .totalTimeLastWeek(timeFormatter.formatDuration(getTotalTimeLastWeek(userActivities)))
            .build();
    }

    private Duration getTotalTimeLastWeek(List<Activity> activities) {
        LocalDate startOfLastWeek = LocalDate.now().with(DayOfWeek.MONDAY).minusWeeks(1);
        LocalDate endOfLastWeek = startOfLastWeek.plusDays(DAYS_IN_WEEK - 1);

        return calculateTotalDuration(activities, startOfLastWeek, endOfLastWeek);
    }

    private List<MonthlyStat> getMonthlyStats(List<Activity> activities) {
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());

        Map<String, Duration> weeklyDurations = activities.stream()
            .filter(activity -> isWithinRange(activity.getDate().toLocalDate(), firstDayOfMonth, lastDayOfMonth))
            .collect(Collectors.groupingBy(this::getWeekKey, Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)));

        fillMissingWeeks(weeklyDurations, lastDayOfMonth);

        List<MonthlyStat> monthlyStats = new ArrayList<>();
        weeklyDurations.forEach((weekKey, duration) -> monthlyStats.add(new MonthlyStat(weekKey, timeFormatter.formatToHours(duration))));

        return monthlyStats;
    }

    private List<WeeklyStat> getWeeklyStats(List<Activity> activities) {
        LocalDate startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY);
        List<WeeklyStat> weeklyStats = new ArrayList<>();

        Arrays.stream(DayOfWeek.values())
            .sorted(Comparator.comparingInt(DayOfWeek::getValue))
            .forEach(day -> {
                String dayName = timeFormatter.formatDayOfWeek(day);
                Double dailyDuration = calculateDailyDuration(activities, startOfWeek, day);
                weeklyStats.add(new WeeklyStat(dayName, dailyDuration));
            });

        return weeklyStats;
    }

    private List<ActivityBreakdown> getActivityBreakdown(List<Activity> activities) {
        return activities.stream()
            .collect(Collectors.groupingBy(Activity::getTitle, Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)))
            .entrySet()
            .stream()
            .map(entry -> new ActivityBreakdown(entry.getKey(), timeFormatter.formatToHours(entry.getValue())))
            .toList();
    }

    private ActivityStat getTopActivity(List<Activity> activities) {
        return activities.stream()
            .collect(Collectors.groupingBy(
                Activity::getTitle,
                Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)
            ))
            .entrySet()
            .stream()
            .max(Comparator.comparingLong(entry -> entry.getValue().toMinutes()))
            .map(entry -> new ActivityStat(entry.getKey(), timeFormatter.formatDuration(entry.getValue())))
            .orElse(null);
    }

    private ActivityStat getMostFrequentActivity(List<Activity> activities) {
        return activities.stream()
            .collect(Collectors.groupingBy(Activity::getTitle, Collectors.counting()))
            .entrySet()
            .stream()
            .max(Comparator.comparingLong(Map.Entry::getValue))
            .map(entry -> {
                Duration totalTime = activities.stream()
                    .filter(activity -> activity.getTitle().equals(entry.getKey()))
                    .map(Activity::getDuration)
                    .reduce(Duration.ZERO, Duration::plus);
                return new ActivityStat(entry.getKey(), timeFormatter.formatDuration(totalTime));
            })
            .orElse(null);
    }

    private Duration getTotalTimeLogged(List<Activity> activities) {
        return activities.stream()
            .map(Activity::getDuration)
            .reduce(Duration.ZERO, Duration::plus);
    }

    private Duration getTimeLoggedToday(List<Activity> activities) {
        LocalDate today = LocalDate.now();
        return activities.stream()
            .filter(activity -> activity.getDate().toLocalDate().equals(today))
            .map(Activity::getDuration)
            .reduce(Duration.ZERO, Duration::plus);
    }

    private MostActiveDay getMostActiveDay(List<Activity> activities) {
        Map<DayOfWeek, Duration> totalDurationByDay = activities.stream()
            .collect(Collectors.groupingBy(
                activity -> activity.getDate().getDayOfWeek(),
                Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)
            ));

        return totalDurationByDay.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(entry -> new MostActiveDay(timeFormatter.formatDayOfWeek(entry.getKey()), timeFormatter.formatDuration(entry.getValue())))
            .orElse(null);
    }

    private Period getCurrentStreak(List<Activity> activities) {
        Set<LocalDate> activityDays = extractActivityDays(activities);

        LocalDate today = LocalDate.now();
        int streakCount = 0;

        while (activityDays.contains(today)) {
            streakCount++;
            today = today.minusDays(1);
        }

        return Period.ofDays(streakCount);
    }

    private Period getLongestStreak(List<Activity> activities) {
        Set<LocalDate> activityDays = extractActivityDays(activities);

        int longestStreak = 0;
        int currentStreak = 0;

        LocalDate previousDay = null;

        for (LocalDate day : activityDays.stream().sorted().toList()) {
            if (previousDay == null || day.equals(previousDay.plusDays(1))) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
            previousDay = day;
        }

        longestStreak = Math.max(longestStreak, currentStreak);

        return Period.ofDays(longestStreak);
    }

    private Set<LocalDate> extractActivityDays(List<Activity> activities) {
        return activities.stream()
            .map(activity -> activity.getDate().toLocalDate())
            .collect(Collectors.toSet());
    }

    private Duration getTotalTimeThisWeek(List<Activity> activities) {
        LocalDate startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY);
        return calculateTotalDuration(activities, startOfWeek.minusDays(FIRST_DAY_OF_WEEK), LocalDate.now());
    }

    private Duration calculateTotalDuration(List<Activity> activities, LocalDate startDate, LocalDate endDate) {
        return activities.stream()
            .filter(activity -> isWithinRange(activity.getDate().toLocalDate(), startDate, endDate))
            .map(Activity::getDuration)
            .reduce(Duration.ZERO, Duration::plus);
    }

    private boolean isWithinRange(LocalDate date, LocalDate start, LocalDate end) {
        return !date.isBefore(start) && !date.isAfter(end);
    }

    private String getWeekKey(Activity activity) {
        int dayOfMonth = activity.getDate().toLocalDate().getDayOfMonth();
        return "Week " + ((dayOfMonth - 1) / DAYS_IN_WEEK + 1);
    }

    private void fillMissingWeeks(Map<String, Duration> weeklyDurations, LocalDate lastDayOfMonth) {
        int totalWeeks = (int) Math.ceil(lastDayOfMonth.getDayOfMonth() / (double) DAYS_IN_WEEK);
        for (int i = 1; i <= totalWeeks; i++) {
            weeklyDurations.putIfAbsent("Week " + i, Duration.ZERO);
        }
    }

    private double calculateDailyDuration(List<Activity> activities, LocalDate startOfWeek, DayOfWeek day) {
        Duration totalDuration = activities.stream()
            .filter(activity -> isWithinRange(activity.getDate().toLocalDate(), startOfWeek, startOfWeek.plusDays(DAYS_IN_WEEK - 1)) &&
                activity.getDate().toLocalDate().getDayOfWeek() == day)
            .map(Activity::getDuration)
            .reduce(Duration.ZERO, Duration::plus);

        return timeFormatter.formatToHours(totalDuration);
    }
}