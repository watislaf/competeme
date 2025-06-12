package app.config.logging;

import org.slf4j.Logger;


public abstract class BaseLogger {
    
    protected final Logger logger;
    
    protected BaseLogger(Logger logger) {
        this.logger = logger;
    }

    protected void logServiceStart(String operation, Object... params) {
        logger.info("Starting {} with parameters: {}", operation, params);
    }

    protected void logServiceComplete(String operation, Object result) {
        logger.info("Completed {} successfully. Result: {}", operation, result);
    }

    protected void logServiceError(String operation, String errorMessage, Object... params) {
        logger.error("Failed to {} - {} with parameters: {}", operation, errorMessage, params);
    }

    protected void logValidationError(String field, Object value) {
        logger.error("Validation failed for field '{}' with value: {}", field, value);
    }

    protected void logNotFound(String entityType, Object identifier) {
        logger.error("{} not found with identifier: {}", entityType, identifier);
    }

    protected void logEntityOperation(String operation, String entityType, Object identifier) {
        logger.info("{} {} with ID: {}", operation, entityType, identifier);
    }

    protected void logProcessingDetails(String message, Object... params) {
        logger.debug(message, params);
    }

    protected void logProgress(String operation, int current, int total) {
        logger.debug("Progress for {}: {}/{} ({}%)", operation, current, total, 
            Math.round((current * 100.0) / total));
    }

    protected void logUserAction(String action, Integer userId, Object... details) {
        logger.info("User {} performed action: {} with details: {}", userId, action, details);
    }

    protected void logSecurityEvent(String event, Integer userId, String details) {
        logger.warn("Security event: {} for user {} - {}", event, userId, details);
    }

    protected void logPerformanceStart(String operation) {
        logger.debug("Starting performance measurement for: {}", operation);
    }

    protected void logPerformanceEnd(String operation, long startTime) {
        long duration = System.currentTimeMillis() - startTime;
        if (duration > 1000) {
            logger.warn("Slow operation detected: {} took {}ms", operation, duration);
        } else {
            logger.debug("Operation {} completed in {}ms", operation, duration);
        }
    }
} 