package app.activity.service;

public final class ActivityLogMessages {
    
    private ActivityLogMessages() {
    }
    public static final String ADDING_ACTIVITY = "Attempting to add activity for user ID: {}";
    public static final String ACTIVITY_ADDED = "Successfully added activity: {} for user: {}";
    public static final String ACTIVITY_DELETED = "Activity ID: {} successfully deleted";
    public static final String DELETING_ACTIVITY = "Deleting activity ID: {} for user ID: {}";

    public static final String ADDING_PROGRESS = "Adding progress: {} minutes to activity ID: {}";
    public static final String PROGRESS_UPDATED = "Updated activity ID: {}. New duration: {}";

    public static final String FETCHING_ACTIVITIES = "Fetching activities for user ID: {}";
    public static final String ACTIVITIES_RETURNED = "Returning {} available and {} recent activities for user ID: {}";
    public static final String LOOKING_FOR_ACTIVITY = "Looking for activity ID: {}";
    public static final String LOOKING_FOR_USER = "Looking for user ID: {}";

    public static final String FETCHING_RANDOM_ACTIVITY = "Fetching random activity for user ID: {}";
    public static final String RANDOM_ACTIVITY_SUCCESS = "Successfully fetched random activity for user ID: {}";
    public static final String RANDOM_ACTIVITY_CACHED = "Returning cached random activity for user ID: {}";

    public static final String ACTIVITY_NOT_FOUND_ERROR = "Activity not found for ID: {}";
    public static final String USER_NOT_FOUND_ERROR = "User not found for ID: {}";
    public static final String RANDOM_ACTIVITY_ERROR = "Error fetching random activity";
    public static final String EXTERNAL_API_ERROR = "External API call failed for random activity";
    public static final String CACHE_EVICTION = "Cache evicted for user ID: {} due to activity change";
    public static final String DATABASE_OPERATION = "Database operation {} completed for user ID: {} in {}ms";
    public static final String EXTERNAL_API_CALL = "External API call to {} completed in {}ms";
} 