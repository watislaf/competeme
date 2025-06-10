package app.auth.service;

import app.config.logging.BaseLogger;
import org.slf4j.Logger;

import static app.auth.service.AuthLogMessages.*;

public final class AuthLogger extends BaseLogger {
    
    public AuthLogger(Logger logger) {
        super(logger);
    }

    public void logRegistrationAttempt(String email) {
        logger.info(REGISTRATION_ATTEMPT, email);
        logSecurityEvent("REGISTRATION_ATTEMPT", null, "Email: " + email);
    }

    public void logRegistrationSuccess(Integer userId, String email) {
        logger.info(REGISTRATION_SUCCESS, userId, email);
        logUserAction("REGISTER", userId, "Email: " + email);
    }

    public void logUsernameTaken(String username) {
        logger.warn(USERNAME_TAKEN, username);
        logSecurityEvent("USERNAME_TAKEN", null, "Username: " + username);
    }

    public void logEmailAlreadyExists(String email) {
        logger.warn(EMAIL_ALREADY_EXISTS, email);
        logSecurityEvent("EMAIL_ALREADY_EXISTS", null, "Email: " + email);
    }

    public void logTokensGenerated(Integer userId) {
        logger.debug(TOKENS_GENERATED, userId);
    }

    public void logAuthAttempt(String email) {
        logger.info(AUTH_ATTEMPT, email);
        logSecurityEvent("LOGIN_ATTEMPT", null, "Email: " + email);
    }

    public void logAuthSuccess(Integer userId, String email) {
        logger.info(AUTH_SUCCESS, userId, email);
        logUserAction("LOGIN", userId, "Email: " + email);
    }

    public void logAuthUserNotFound(String email) {
        logger.warn(AUTH_USER_NOT_FOUND, email);
        logSecurityEvent("LOGIN_USER_NOT_FOUND", null, "Email: " + email);
    }

    public void logAuthCredentialsSuccess(Integer userId) {
        logger.debug(AUTH_CREDENTIALS_SUCCESS, userId);
    }

    public void logAuthInvalidCredentials(String email) {
        logger.warn(AUTH_INVALID_CREDENTIALS, email);
        logSecurityEvent("INVALID_CREDENTIALS", null, "Email: " + email);
    }

    public void logRefreshRequest() {
        logger.debug(REFRESH_REQUEST);
    }

    public void logRefreshSuccess(String userId) {
        logger.info(REFRESH_SUCCESS, userId);
        logUserAction("TOKEN_REFRESH", Integer.valueOf(userId));
    }

    public void logRefreshInvalidToken() {
        logger.warn(REFRESH_INVALID_TOKEN);
        logSecurityEvent("INVALID_REFRESH_TOKEN", null, "Token refresh failed");
    }

    public void logRefreshProcessing(String userId) {
        logger.debug(REFRESH_PROCESSING, userId);
    }

    public void logRefreshUserNotFound(String userId) {
        logger.error(REFRESH_USER_NOT_FOUND, userId);
        logSecurityEvent("REFRESH_USER_NOT_FOUND", null, "User ID: " + userId);
    }

    public void logRegistrationPerformance(String email, long startTime) {
        logPerformanceEnd("USER_REGISTRATION[" + email + "]", startTime);
    }

    public void logAuthenticationPerformance(String email, long startTime) {
        logPerformanceEnd("USER_AUTHENTICATION[" + email + "]", startTime);
    }

    public void logTokenRefreshPerformance(String userId, long startTime) {
        logPerformanceEnd("TOKEN_REFRESH[" + userId + "]", startTime);
    }

    public void logSuspiciousActivity(String email, String activity) {
        logger.warn(SECURITY_SUSPICIOUS_ACTIVITY, email);
        logSecurityEvent("SUSPICIOUS_ACTIVITY", null, activity + " for email: " + email);
    }
} 