package app.user.service;

import app.config.logging.BaseLogger;
import org.slf4j.Logger;

import static app.user.service.UserLogMessages.*;

public final class UserLogger extends BaseLogger {
    
    public UserLogger(Logger logger) {
        super(logger);
    }

    public void logFetchingUserProfile(Integer userId) {
        logger.info(FETCHING_USER_PROFILE, userId);
        logUserAction("FETCH_PROFILE", userId);
    }

    public void logProfileFetched(Integer userId) {
        logger.debug(PROFILE_FETCHED, userId);
    }

    public void logUpdatingProfileImage(Integer userId) {
        logger.info(UPDATING_PROFILE_IMAGE, userId);
        logUserAction("UPDATE_PROFILE_IMAGE", userId);
    }

    public void logUpdatingProfileName(Integer userId) {
        logger.info(UPDATING_PROFILE_NAME, userId);
        logUserAction("UPDATE_PROFILE_NAME", userId);
    }

    public void logSearchingUsers(String keyword) {
        logger.info(SEARCHING_USERS, keyword);
    }

    public void logUsersFound(int count, String keyword) {
        logger.debug(USERS_FOUND, count, keyword);
    }

    public void logUserLookup(Integer userId) {
        logger.debug(USER_LOOKUP, userId);
    }

    public void logImageUpdated(Integer userId, String oldImage, String newImage) {
        logger.debug(IMAGE_UPDATED, userId, oldImage, newImage);
    }

    public void logNameUpdated(Integer userId, String oldName, String newName) {
        logger.debug(NAME_UPDATED, userId, oldName, newName);
    }

    public void logUserNotFoundError(Integer userId) {
        logger.error(USER_NOT_FOUND_ERROR, userId);
        logNotFound("User", userId);
    }

    public void logInvalidUserId(Object invalidId) {
        logger.warn(INVALID_USER_ID, invalidId);
        logValidationError("userId", invalidId);
    }

    public void logEmptySearchKeyword() {
        logger.warn(EMPTY_SEARCH_KEYWORD);
        logValidationError("searchKeyword", "empty");
    }

    public void logSearchTooShort(String keyword) {
        logger.debug(SEARCH_TOO_SHORT, keyword);
    }

    public void logImageUrlTooLong() {
        logger.warn("Image URL too long");
        logValidationError("imageUrl", "too long");
    }

    public void logProfileNameEmpty() {
        logger.warn("Profile name is empty");
        logValidationError("profileName", "empty");
    }

    public void logProfileNameTooLong() {
        logger.warn("Profile name too long");
        logValidationError("profileName", "too long");
    }

    public void logSearchPerformance(String keyword, long startTime) {
        long duration = System.currentTimeMillis() - startTime;
        logger.debug(SEARCH_PERFORMANCE, duration, keyword);
        
        if (duration > 500) {
            logger.warn("Slow user search detected: '{}' took {}ms", keyword, duration);
        }
    }

    public void logProfileFetchPerformance(Integer userId, long startTime) {
        long duration = System.currentTimeMillis() - startTime;
        logger.debug(PROFILE_FETCH_PERFORMANCE, duration, userId);
        
        if (duration > 200) {
            logger.warn("Slow profile fetch detected for user {} took {}ms", userId, duration);
        }
    }

    public void logProfileCached(Integer userId) {
        logger.debug(PROFILE_CACHED, userId);
    }

    public void logCacheMiss(Integer userId) {
        logger.debug(CACHE_MISS, userId);
    }

    public void logDatabaseOperation(String operation, Integer userId, long startTime) {
        long duration = System.currentTimeMillis() - startTime;
        
        if (duration > 300) {
            logger.warn("Slow database operation detected: {} for user {} took {}ms", 
                operation, userId, duration);
        } else {
            logger.debug("Database operation {} for user {} completed in {}ms", 
                operation, userId, duration);
        }
    }

    public void logUserProfileUpdatePerformance(Integer userId, String field, long startTime) {
        logPerformanceEnd("UPDATE_PROFILE_" + field.toUpperCase() + "[User:" + userId + "]", startTime);
    }

    public void logUserSearchPerformance(String keyword, long startTime) {
        logPerformanceEnd("USER_SEARCH['" + keyword + "']", startTime);
    }
} 