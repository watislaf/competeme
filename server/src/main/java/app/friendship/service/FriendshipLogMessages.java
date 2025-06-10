package app.friendship.service;

public final class FriendshipLogMessages {
    
    private FriendshipLogMessages() {
    }
    public static final String SENDING_FRIEND_REQUEST = "Attempting to send friend request from {} to {}";
    public static final String FRIEND_REQUEST_SENT = "New friend request created from {} to {}";
    public static final String FRIEND_REQUEST_EXISTS = "Friend request already exists from {} to {}";
    public static final String RECIPROCAL_REQUEST_FOUND = "Found reciprocal request - auto-accepting friendship between {} and {}";

    public static final String ACCEPTING_FRIEND_REQUEST = "Accepting friend request between {} and {}";
    public static final String FRIENDSHIP_ESTABLISHED = "Friendship established between {} and {}";
    public static final String REMOVING_FRIENDSHIP = "Removing friendship between {} and {}";
    public static final String FRIENDSHIP_REMOVED = "Friendship records deleted";

    public static final String FETCHING_PENDING_REQUESTS = "Fetching pending friend requests for user {}";
    public static final String FETCHING_SENT_REQUESTS = "Fetching sent friend requests by user {}";
    public static final String FETCHING_FRIENDS_LIST = "Fetching friends list for user {}";
    public static final String FRIENDS_FOUND = "Found {} friends for user {}";

    public static final String CANCELING_FRIEND_REQUEST = "Canceling friend request from {} to {}";
    public static final String FRIEND_REQUEST_CANCELED = "Friend request canceled";

    public static final String CHECKING_FRIENDSHIP_STATUS = "Checking if {} and {} are friends";
    public static final String CHECKING_PENDING_REQUESTS = "Checking pending requests between {} and {}";
    public static final String CHECKING_STATUS_BATCH = "Checking friendship statuses between {} and {} users";

    public static final String NO_PENDING_REQUEST_ERROR = "No pending friendship request found between {} and {}";
    public static final String DUPLICATE_REQUESTS_FOUND = "Found duplicate requests - removing redundant one";
    public static final String SOCIAL_GRAPH_ANALYSIS = "Analyzing social connections for user {}";
    public static final String FRIENDSHIP_NETWORK_SIZE = "User {} has {} direct connections";
    public static final String MUTUAL_FRIENDS_COUNT = "Users {} and {} have {} mutual friends";
} 