package app.auth.service;

public final class AuthLogMessages {
    
    private AuthLogMessages() {
    }

    public static final String REGISTRATION_ATTEMPT = "Attempting to register new user with email: {}";
    public static final String REGISTRATION_SUCCESS = "User registered successfully - ID: {}, Email: {}";
    public static final String USERNAME_TAKEN = "Registration failed - username already taken: {}";
    public static final String EMAIL_ALREADY_EXISTS = "Registration failed - email already registered: {}";
    public static final String TOKENS_GENERATED = "Tokens generated for user ID: {}";
    public static final String AUTH_ATTEMPT = "Authentication attempt for email: {}";
    public static final String AUTH_SUCCESS = "User authenticated successfully - ID: {}, Email: {}";
    public static final String AUTH_USER_NOT_FOUND = "Authentication failed - user not found for email: {}";
    public static final String AUTH_CREDENTIALS_SUCCESS = "Authentication successful for user ID: {}";
    public static final String AUTH_INVALID_CREDENTIALS = "Authentication failed - invalid credentials for email: {}";
    public static final String REFRESH_REQUEST = "Refresh token request received";
    public static final String REFRESH_SUCCESS = "Tokens refreshed successfully for user ID: {}";
    public static final String REFRESH_INVALID_TOKEN = "Invalid refresh token attempt";
    public static final String REFRESH_PROCESSING = "Processing refresh token for user ID: {}";
    public static final String REFRESH_USER_NOT_FOUND = "User not found during refresh for ID: {}";
    public static final String SECURITY_REGISTRATION_ATTEMPT = "New user registration attempt from email: {}";
    public static final String SECURITY_LOGIN_FAILURE = "Failed login attempt for email: {}";
    public static final String SECURITY_TOKEN_REFRESH_FAILURE = "Failed token refresh attempt";
    public static final String SECURITY_SUSPICIOUS_ACTIVITY = "Suspicious activity detected for user: {}";
} 