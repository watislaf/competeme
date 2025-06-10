package app.challenge.service;

public final class ChallengeLogMessages {
    
    private ChallengeLogMessages() {
    }
    public static final String ADDING_CHALLENGE = "Attempting to add new challenge by user ID: {}";
    public static final String CHALLENGE_CREATED = "Challenge created successfully - ID: {}, Title: {}";
    public static final String PARTICIPANTS_ADDED = "Added {} participants to challenge ID: {}";
    public static final String FETCHING_CHALLENGES = "Fetching challenges for user ID: {}";
    public static final String UPDATING_PROGRESS = "Updating progress - User ID: {}, Challenge ID: {}, Progress: {}";
    public static final String MODIFYING_CHALLENGE = "Modifying challenge ID: {}";
    public static final String CHALLENGE_UPDATED = "Challenge ID: {} updated successfully";
    public static final String DELETING_CHALLENGE = "Deleting challenge - User ID: {}, Challenge ID: {}";
    public static final String CHALLENGE_DELETED = "Challenge ID: {} deleted (no remaining participants)";
    public static final String CHALLENGE_DETAILS = "Challenge details - Title: {}, Participants: {}";
    public static final String NO_CHALLENGES_FOUND = "No challenges found for user ID: {}";
    public static final String CHALLENGES_FOUND = "Found {} challenges for user ID: {}";
    public static final String PROGRESS_UPDATED = "Progress updated successfully for participant ID: {}";
    public static final String MODIFICATION_DETAILS = "Modification details: {}";
    public static final String UPDATING_TITLE = "Updating title from '{}' to '{}'";
    public static final String UPDATING_DESCRIPTION = "Updating description";
    public static final String UPDATING_GOAL = "Updating goal from {} to {}";
    public static final String UPDATING_UNIT = "Updating unit from '{}' to '{}'";
    public static final String PROCESSING_PARTICIPANTS = "Processing participants modification";
    public static final String MODIFYING_PARTICIPANTS = "Modifying participants for challenge ID: {}";
    public static final String ADDING_PARTICIPANT = "Adding new participant - User ID: {}";
    public static final String PARTICIPANT_REMOVED = "Removed participant - User ID: {} from Challenge ID: {}";
    public static final String CHALLENGE_RETAINED = "Challenge ID: {} retained (remaining participants exist)";
    public static final String PARTICIPANT_ADDED = "Added participant - User ID: {} to Challenge ID: {}";
    public static final String PARTICIPANTS_NOT_FOUND_ERROR = "Failed to add challenge - one or more participants not found";
    public static final String PARTICIPANT_NOT_FOUND_ERROR = "Participant not found - User ID: {}, Challenge ID: {}";
    public static final String CHALLENGE_NOT_FOUND_ERROR = "Challenge not found - ID: {}";
    public static final String PARTICIPANT_MODIFICATION_ERROR = "Participant modification failed - one or more participants not found";
    public static final String DELETE_CHALLENGE_NOT_FOUND_ERROR = "Delete failed - challenge not found - ID: {}";
    public static final String DELETE_USER_NOT_PARTICIPATING_ERROR = "Delete failed - user not participating - User ID: {}, Challenge ID: {}";
} 