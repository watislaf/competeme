package app.activity.service;

import app.activity.entity.Activity;
import app.activity.entity.ActivityRepository;
import app.user.entity.User;
import app.user.entity.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public void addActivity(Integer userId, ActivityRequest activityRequest) {
        User user = findUser(userId);

        Activity activity = Activity.builder()
            .title(activityRequest.title())
            .type(activityRequest.type())
            .duration(Duration.ofMinutes(activityRequest.duration()))
            .date(ZonedDateTime.now())
            .user(user)
            .build();

        activityRepository.save(activity);
    }

    public void addProgress(Long activityId, Long progressInMinutes) {
        Activity activity = findActivity(activityId);

        Duration progress = Duration.ofMinutes(progressInMinutes);
        Duration currentDuration = activity.getDuration();
        Duration updatedDuration = currentDuration.plus(progress);
        activity.setDuration(updatedDuration);
        activity.setDate(ZonedDateTime.now());
        activityRepository.save(activity);
    }

    public void deleteActivity(Long activityId) {
        Activity activity = findActivity(activityId);
        activityRepository.delete(activity);
    }

    private Activity findActivity(Long activityId) {
        return activityRepository.findById(activityId)
            .orElseThrow(() -> new IllegalArgumentException("Activity not found"));
    }

    public UserActivityResponse getActivities(Integer userId) {
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
                formatDuration(activity.getDuration())
            ))
            .toList();

        return new UserActivityResponse(available, recent);
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;

        StringBuilder formattedDuration = new StringBuilder();

        if (hours > 0) {
            formattedDuration.append(hours).append("h ");
        }
        if (minutes > 0) {
            formattedDuration.append(minutes).append("min");
        }

        return formattedDuration.toString().trim();
    }

    private User findUser(Integer userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}