package app.activity.service;

import app.activity.entity.Activity;
import app.activity.entity.ActivityRepository;
import app.stats.service.TimeFormatter;
import app.user.entity.User;
import app.user.entity.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
    private final ActivityLogger activityLogger = new ActivityLogger(log);

    @CacheEvict(value = "statsCache", key = "#userId")
    public void addActivity(Integer userId, ActivityRequest activityRequest) {
        long startTime = System.currentTimeMillis();
        activityLogger.logAddingActivity(userId);
        activityLogger.logCacheEviction(userId);

        User user = findUser(userId);
        Activity activity = createActivity(activityRequest, user);
        
        long dbStartTime = System.currentTimeMillis();
        activityRepository.save(activity);
        activityLogger.logDatabaseOperation("SAVE_ACTIVITY", userId, dbStartTime);
        
        activityLogger.logActivityAdded(activity.getTitle(), user.getUsername());
        activityLogger.logActivityAddPerformance(userId, startTime);
    }

    @CacheEvict(value = "statsCache", key = "#userId")
    public void addProgress(Long activityId, Long progressInMinutes, Integer userId) {
        long startTime = System.currentTimeMillis();
        activityLogger.logAddingProgress(progressInMinutes, activityId);
        activityLogger.logCacheEviction(userId);

        Activity activity = findActivity(activityId);
        Duration updatedDuration = updateActivityDuration(activity, progressInMinutes);
        
        long dbStartTime = System.currentTimeMillis();
        activityRepository.save(activity);
        activityLogger.logDatabaseOperation("UPDATE_ACTIVITY", userId, dbStartTime);

        activityLogger.logProgressUpdated(activityId, timeFormatter.formatDuration(updatedDuration));
        activityLogger.logProgressUpdatePerformance(activityId, startTime);
    }

    @CacheEvict(value = "statsCache", key = "#userId")
    public void deleteActivity(Long activityId, Integer userId) {
        activityLogger.logDeletingActivity(activityId, userId);
        activityLogger.logCacheEviction(userId);
        
        Activity activity = findActivity(activityId);
        
        long dbStartTime = System.currentTimeMillis();
        activityRepository.delete(activity);
        activityLogger.logDatabaseOperation("DELETE_ACTIVITY", userId, dbStartTime);
        
        activityLogger.logActivityDeleted(activityId);
    }

    public UserActivityResponse getActivities(Integer userId) {
        long startTime = System.currentTimeMillis();
        activityLogger.logFetchingActivities(userId);

        long dbStartTime = System.currentTimeMillis();
        List<Activity> activities = activityRepository.findByUserId(userId);
        activityLogger.logDatabaseOperation("FETCH_ACTIVITIES", userId, dbStartTime);

        UserActivityResponse response = buildActivityResponse(activities, userId);
        activityLogger.logActivityFetchPerformance(userId, startTime);
        
        return response;
    }

    public String getRandomActivity(Integer userId) {
        long startTime = System.currentTimeMillis();
        activityLogger.logFetchingRandomActivity(userId);

        String apiUrl = "https://bored-api.appbrewery.com/random";
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();

        try {
            long apiStartTime = System.currentTimeMillis();
            String fullJson = restTemplate.getForObject(apiUrl, String.class);
            activityLogger.logExternalApiCall(apiUrl, apiStartTime);
            
            JsonNode rootNode = mapper.readTree(fullJson);
            String activityName = rootNode.get("activity").asText();
            
            activityLogger.logRandomActivitySuccess(userId);
            return activityName;
        } catch (Exception e) {
            activityLogger.logExternalApiError(apiUrl, e);
            return "Could not fetch activity";
        }
    }

    private Activity findActivity(Long activityId) {
        activityLogger.logLookingForActivity(activityId);
        return activityRepository.findById(activityId)
            .orElseThrow(() -> {
                activityLogger.logActivityNotFoundError(activityId);
                return new IllegalArgumentException("Activity not found");
            });
    }

    private User findUser(Integer userId) {
        activityLogger.logLookingForUser(userId);
        return userRepository.findById(userId)
            .orElseThrow(() -> {
                activityLogger.logUserNotFoundError(userId);
                return new IllegalArgumentException("User not found");
            });
    }

    private Activity createActivity(ActivityRequest activityRequest, User user) {
        return Activity.builder()
            .title(activityRequest.title())
            .type(activityRequest.type())
            .duration(Duration.ofMinutes(activityRequest.duration()))
            .date(ZonedDateTime.now())
            .user(user)
            .build();
    }

    private Duration updateActivityDuration(Activity activity, Long progressInMinutes) {
        Duration progress = Duration.ofMinutes(progressInMinutes);
        Duration currentDuration = activity.getDuration();
        Duration updatedDuration = currentDuration.plus(progress);
        
        activity.setDuration(updatedDuration);
        activity.setDate(ZonedDateTime.now());
        
        return updatedDuration;
    }

    private UserActivityResponse buildActivityResponse(List<Activity> activities, Integer userId) {
        List<ActivityResponse> available = buildAvailableActivities(activities);
        List<RecentActivityResponse> recent = buildRecentActivities(activities);

        activityLogger.logActivitiesReturned(available.size(), recent.size(), userId);
        return new UserActivityResponse(available, recent);
    }

    private List<ActivityResponse> buildAvailableActivities(List<Activity> activities) {
        return activities.stream()
            .collect(Collectors.toMap(
                Activity::getTitle,
                activity -> new ActivityResponse(activity.getId(), activity.getTitle(), activity.getType()),
                (existing, replacement) -> existing
            ))
            .values()
            .stream()
            .sorted(Comparator.comparing(ActivityResponse::title))
            .toList();
    }

    private List<RecentActivityResponse> buildRecentActivities(List<Activity> activities) {
        return activities.stream()
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .map(activity -> new RecentActivityResponse(
                activity.getId(),
                activity.getTitle(),
                activity.getType(),
                timeFormatter.formatDuration(activity.getDuration())
            ))
            .toList();
    }
}