package app.activity.service;

import app.activity.entity.Activity;
import app.activity.entity.ActivityRepository;
import app.stats.service.TimeFormatter;
import app.user.entity.User;
import app.user.entity.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final TimeFormatter timeFormatter;

    @CacheEvict(value = "statsCache", key = "#userId")
    public void addActivity(Integer userId, ActivityRequest activityRequest) {
        log.info("Attempting to add activity for user ID: {}", userId);
        User user = findUser(userId);

        Activity activity = Activity.builder()
            .title(activityRequest.title())
            .type(activityRequest.type())
            .duration(Duration.ofMinutes(activityRequest.duration()))
            .date(ZonedDateTime.now())
            .user(user)
            .build();

        activityRepository.save(activity);
        log.info("Successfully added activity: {} for user: {}", activity.getTitle(), user.getUsername());
    }

    @CacheEvict(value = "statsCache", key = "#userId")
    public void addProgress(Long activityId, Long progressInMinutes, Integer userId) {
        log.debug("Adding progress: {} minutes to activity ID: {}", progressInMinutes, activityId);
        Activity activity = findActivity(activityId);

        Duration progress = Duration.ofMinutes(progressInMinutes);
        Duration currentDuration = activity.getDuration();
        Duration updatedDuration = currentDuration.plus(progress);

        activity.setDuration(updatedDuration);
        activity.setDate(ZonedDateTime.now());
        activityRepository.save(activity);

        log.info("Updated activity ID: {}. New duration: {}", activityId, timeFormatter.formatDuration(updatedDuration));
    }

    @CacheEvict(value = "statsCache", key = "#userId")
    public void deleteActivity(Long activityId, Integer userId) {
        log.warn("Deleting activity ID: {} for user ID: {}", activityId, userId);
        Activity activity = findActivity(activityId);
        activityRepository.delete(activity);
        log.info("Activity ID: {} successfully deleted", activityId);
    }

    private Activity findActivity(Long activityId) {
        log.debug("Looking for activity ID: {}", activityId);
        return activityRepository.findById(activityId)
            .orElseThrow(() -> {
                log.error("Activity not found for ID: {}", activityId);
                return new IllegalArgumentException("Activity not found");
            });
    }

    public UserActivityResponse getActivities(Integer userId) {
        log.info("Fetching activities for user ID: {}", userId);
        List<Activity> activities = activityRepository.findByUserId(userId);

        List<ActivityResponse> available = activities.stream()
            .collect(Collectors.toMap(
                Activity::getTitle,
                activity -> new ActivityResponse(activity.getId(), activity.getTitle(), activity.getType()),
                (existing, replacement) -> existing
            ))
            .values()
            .stream()
            .sorted(Comparator.comparing(ActivityResponse::title))
            .toList();

        List<RecentActivityResponse> recent = activities.stream()
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .map(activity -> new RecentActivityResponse(
                activity.getId(),
                activity.getTitle(),
                activity.getType(),
                timeFormatter.formatDuration(activity.getDuration())
            ))
            .toList();

        log.debug("Returning {} available and {} recent activities for user ID: {}",
            available.size(), recent.size(), userId
        );
        return new UserActivityResponse(available, recent);
    }

    private User findUser(Integer userId) {
        log.debug("Looking for user ID: {}", userId);
        return userRepository.findById(userId)
            .orElseThrow(() -> {
                log.error("User not found for ID: {}", userId);
                return new IllegalArgumentException("User not found");
            });
    }
}