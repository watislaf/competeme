package app.stats.service;

import app.activity.entity.Activity;
import app.activity.entity.ActivityRepository;
import lombok.RequiredArgsConstructor;
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
    private final ActivityRepository activityRepository;
    private final TimeFormatter timeFormatter;

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
        LocalDate endOfLastWeek = startOfLastWeek.plusDays(6);

        return calculateTotalDuration(activities, startOfLastWeek, endOfLastWeek);
    }

    private Map<String, Double> getMonthlyStats(List<Activity> activities) {
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());

        Map<String, Duration> weeklyDurations = activities.stream()
            .filter(activity -> isWithinRange(activity.getDate().toLocalDate(), firstDayOfMonth, lastDayOfMonth))
            .collect(Collectors.groupingBy(this::getWeekKey, Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)));

        fillMissingWeeks(weeklyDurations, lastDayOfMonth);

        return convertToHourlyMap(weeklyDurations);
    }

    private Map<String, Double> getWeeklyStats(List<Activity> activities) {
        LocalDate startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY);
        Map<String, Double> statsMap = new LinkedHashMap<>();

        Arrays.stream(DayOfWeek.values())
            .sorted(Comparator.comparingInt(DayOfWeek::getValue))
            .forEach(day -> statsMap.put(timeFormatter.formatDayOfWeek(day), calculateDailyDuration(activities, startOfWeek, day)));

        return statsMap;
    }

    private List<ActivityBreakdown> getActivityBreakdown(List<Activity> activities) {
        return activities.stream()
            .collect(Collectors.groupingBy(Activity::getTitle, Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)))
            .entrySet()
            .stream()
            .map(entry -> new ActivityBreakdown(entry.getKey(), entry.getValue().toMinutes() / 60.0))
            .toList();
    }

    private Map<String, String> getTopActivity(List<Activity> activities) {
        return activities.stream()
            .collect(Collectors.groupingBy(
                Activity::getTitle,
                Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)
            ))
            .entrySet()
            .stream()
            .max(Comparator.comparingLong(entry -> entry.getValue().toMinutes()))
            .map(entry -> {
                Map<String, String> result = new HashMap<>();
                result.put("activity", entry.getKey());
                result.put("totalTime", timeFormatter.formatDuration(entry.getValue()));
                return result;
            })
            .orElse(null);
    }

    private Map<String, String> getMostFrequentActivity(List<Activity> activities) {
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
                Map<String, String> result = new HashMap<>();
                result.put("activity", entry.getKey());
                result.put("totalTime", timeFormatter.formatDuration(totalTime));
                return result;
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

    private Map<String, String> getMostActiveDay(List<Activity> activities) {
        Map<DayOfWeek, Duration> totalDurationByDay = activities.stream()
            .collect(Collectors.groupingBy(
                activity -> activity.getDate().getDayOfWeek(),
                Collectors.reducing(Duration.ZERO, Activity::getDuration, Duration::plus)
            ));

        return totalDurationByDay.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(entry -> createMostActiveDayResult(entry.getKey(), entry.getValue(), activities))
            .orElse(Collections.emptyMap());
    }

    private Period getLongestStreak(List<Activity> activities) {
        return calculateStreak(activities, false);
    }

    private Period getCurrentStreak(List<Activity> activities) {
        return calculateStreak(activities, true);
    }

    private Duration getTotalTimeThisWeek(List<Activity> activities) {
        LocalDate startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY);
        return calculateTotalDuration(activities, startOfWeek.minusDays(1), LocalDate.now());
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
        return "Week " + ((dayOfMonth - 1) / 7 + 1);
    }

    private void fillMissingWeeks(Map<String, Duration> weeklyDurations, LocalDate lastDayOfMonth) {
        int totalWeeks = (int) Math.ceil(lastDayOfMonth.getDayOfMonth() / 7.0);
        for (int i = 1; i <= totalWeeks; i++) {
            weeklyDurations.putIfAbsent("Week " + i, Duration.ZERO);
        }
    }

    private Map<String, Double> convertToHourlyMap(Map<String, Duration> weeklyDurations) {
        return weeklyDurations.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().toMinutes() / 60.0));
    }

    private double calculateDailyDuration(List<Activity> activities, LocalDate startOfWeek, DayOfWeek day) {
        return activities.stream()
            .filter(activity -> isWithinRange(activity.getDate().toLocalDate(), startOfWeek, startOfWeek.plusDays(6)) &&
                activity.getDate().toLocalDate().getDayOfWeek() == day)
            .map(Activity::getDuration)
            .reduce(Duration.ZERO, Duration::plus)
            .toMinutes() / 60.0;
    }

    private Map<String, String> createMostActiveDayResult(DayOfWeek mostActiveDay, Duration totalDuration, List<Activity> activities) {
        Set<LocalDate> uniqueWeeks = activities.stream()
            .filter(activity -> activity.getDate().getDayOfWeek() == mostActiveDay)
            .map(activity -> activity.getDate().toLocalDate().with(DayOfWeek.MONDAY))
            .collect(Collectors.toSet());

        long weeksCount = uniqueWeeks.size();
        Duration averageDuration = weeksCount > 0 ? totalDuration.dividedBy(weeksCount) : Duration.ZERO;

        Map<String, String> result = new HashMap<>();
        result.put("day", timeFormatter.formatDayOfWeek(mostActiveDay));
        result.put("averageTime", timeFormatter.formatDuration(averageDuration));
        return result;
    }

    private Period calculateStreak(List<Activity> activities, boolean current) {
        Set<LocalDate> activityDays = activities.stream()
            .map(activity -> activity.getDate().toLocalDate())
            .collect(Collectors.toSet());

        LocalDate today = LocalDate.now();
        int streak = 0;

        while (activityDays.contains(today)) {
            streak++;
            today = current ? today.minusDays(1) : today.plusDays(1);
        }

        return Period.ofDays(streak);
    }
}