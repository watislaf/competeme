package app.activity.service;

import app.config.logging.BaseLogger;
import org.slf4j.Logger;

import static app.activity.service.ActivityLogMessages.*;

public final class ActivityLogger extends BaseLogger {
    
    public ActivityLogger(Logger logger) {
        super(logger);
    }

    public void logAddingActivity(Integer userId) {
        logger.info(ADDING_ACTIVITY, userId);
        logUserAction("ADD_ACTIVITY", userId);
    }

    public void logActivityAdded(String activityTitle, String username) {
        logger.info(ACTIVITY_ADDED, activityTitle, username);
    }

    public void logDeletingActivity(Long activityId, Integer userId) {
        logger.warn(DELETING_ACTIVITY, activityId, userId);
        logUserAction("DELETE_ACTIVITY", userId, "Activity ID: " + activityId);
    }

    public void logActivityDeleted(Long activityId) {
        logger.info(ACTIVITY_DELETED, activityId);
    }

    public void logAddingProgress(Long progressInMinutes, Long activityId) {
        logger.debug(ADDING_PROGRESS, progressInMinutes, activityId);
    }

    public void logProgressUpdated(Long activityId, String newDuration) {
        logger.info(PROGRESS_UPDATED, activityId, newDuration);
    }

    public void logFetchingActivities(Integer userId) {
        logger.info(FETCHING_ACTIVITIES, userId);
        logUserAction("FETCH_ACTIVITIES", userId);
    }

    public void logActivitiesReturned(int availableCount, int recentCount, Integer userId) {
        logger.debug(ACTIVITIES_RETURNED, availableCount, recentCount, userId);
    }

    public void logLookingForActivity(Long activityId) {
        logger.debug(LOOKING_FOR_ACTIVITY, activityId);
    }

    public void logLookingForUser(Integer userId) {
        logger.debug(LOOKING_FOR_USER, userId);
    }

    public void logFetchingRandomActivity(Integer userId) {
        logger.info(FETCHING_RANDOM_ACTIVITY, userId);
        logUserAction("FETCH_RANDOM_ACTIVITY", userId);
    }

    public void logRandomActivitySuccess(Integer userId) {
        logger.debug(RANDOM_ACTIVITY_SUCCESS, userId);
    }

    public void logRandomActivityCached(Integer userId) {
        logger.debug(RANDOM_ACTIVITY_CACHED, userId);
    }

    public void logActivityNotFoundError(Long activityId) {
        logger.error(ACTIVITY_NOT_FOUND_ERROR, activityId);
        logNotFound("Activity", activityId);
    }

    public void logUserNotFoundError(Integer userId) {
        logger.error(USER_NOT_FOUND_ERROR, userId);
        logNotFound("User", userId);
    }

    public void logRandomActivityError() {
        logger.error(RANDOM_ACTIVITY_ERROR);
    }

    public void logExternalApiError(String apiUrl, Exception e) {
        logger.error(EXTERNAL_API_ERROR + " URL: {}, Error: {}", apiUrl, e.getMessage());
    }

    public void logCacheEviction(Integer userId) {
        logger.debug(CACHE_EVICTION, userId);
    }

    public void logDatabaseOperation(String operation, Integer userId, long startTime) {
        long duration = System.currentTimeMillis() - startTime;
        logger.debug(DATABASE_OPERATION, operation, userId, duration);
        
        if (duration > 500) {
            logger.warn("Slow database operation detected: {} for user {} took {}ms", 
                operation, userId, duration);
        }
    }

    public void logExternalApiCall(String apiUrl, long startTime) {
        long duration = System.currentTimeMillis() - startTime;
        logger.debug(EXTERNAL_API_CALL, apiUrl, duration);
        
        if (duration > 2000) {
            logger.warn("Slow external API call detected: {} took {}ms", apiUrl, duration);
        }
    }

    public void logActivityAddPerformance(Integer userId, long startTime) {
        logPerformanceEnd("ADD_ACTIVITY[User:" + userId + "]", startTime);
    }

    public void logActivityFetchPerformance(Integer userId, long startTime) {
        logPerformanceEnd("FETCH_ACTIVITIES[User:" + userId + "]", startTime);
    }

    public void logProgressUpdatePerformance(Long activityId, long startTime) {
        logPerformanceEnd("UPDATE_PROGRESS[Activity:" + activityId + "]", startTime);
    }
} 