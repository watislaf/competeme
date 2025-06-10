package app.user.service;

public final class UserLogMessages {
    
    private UserLogMessages() {
    }
    public static final String FETCHING_USER_PROFILE = "Fetching profile for user ID: {}";
    public static final String PROFILE_FETCHED = "Successfully fetched profile for user ID: {}";
    public static final String SEARCHING_USERS = "Initiating user search with keyword: '{}'";
    public static final String USERS_FOUND = "Found {} users matching keyword '{}'";
    public static final String UPDATING_PROFILE_IMAGE = "Updating profile image for user ID: {}";
    public static final String UPDATING_PROFILE_NAME = "Updating profile name for user ID: {}";

    public static final String USER_LOOKUP = "Looking for user ID: {}";
    public static final String IMAGE_UPDATED = "Profile image updated for user ID: {}. Old: {}, New: {}";
    public static final String NAME_UPDATED = "Profile name updated for user ID: {}. Old: '{}', New: '{}'";

    public static final String USER_NOT_FOUND_ERROR = "User not found with ID: {}";
    
    public static final String SEARCH_PERFORMANCE = "User search completed in {}ms for keyword: '{}'";
    public static final String PROFILE_FETCH_PERFORMANCE = "Profile fetch completed in {}ms for user ID: {}";
    
    public static final String INVALID_USER_ID = "Invalid user ID provided: {}";
    public static final String EMPTY_SEARCH_KEYWORD = "Empty search keyword provided";
    public static final String SEARCH_TOO_SHORT = "Search keyword too short: '{}'";
    
    public static final String PROFILE_CACHED = "Profile served from cache for user ID: {}";
    public static final String CACHE_MISS = "Cache miss for user ID: {}, fetching from database";
} 