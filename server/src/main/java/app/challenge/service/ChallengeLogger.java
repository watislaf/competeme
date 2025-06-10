package app.challenge.service;

import app.config.logging.BaseLogger;
import org.slf4j.Logger;

import static app.challenge.service.ChallengeLogMessages.*;

public final class ChallengeLogger extends BaseLogger {
    
    public ChallengeLogger(Logger logger) {
        super(logger);
    }

    public void logAddingChallenge(Integer userId) {
        logger.info(ADDING_CHALLENGE, userId);
    }

    public void logChallengeCreated(Long challengeId, String title) {
        logger.info(CHALLENGE_CREATED, challengeId, title);
    }

    public void logParticipantsAdded(int participantCount, Long challengeId) {
        logger.debug(PARTICIPANTS_ADDED, participantCount, challengeId);
    }

    public void logFetchingChallenges(Integer userId) {
        logger.info(FETCHING_CHALLENGES, userId);
    }

    public void logUpdatingProgress(Integer userId, Long challengeId, Integer progress) {
        logger.info(UPDATING_PROGRESS, userId, challengeId, progress);
    }

    public void logModifyingChallenge(Long challengeId) {
        logger.info(MODIFYING_CHALLENGE, challengeId);
    }

    public void logChallengeUpdated(Long challengeId) {
        logger.info(CHALLENGE_UPDATED, challengeId);
    }

    public void logDeletingChallenge(Integer userId, Long challengeId) {
        logger.info(DELETING_CHALLENGE, userId, challengeId);
    }

    public void logChallengeDeleted(Long challengeId) {
        logger.info(CHALLENGE_DELETED, challengeId);
    }

    public void logChallengeDetails(String title, Object participants) {
        logger.debug(CHALLENGE_DETAILS, title, participants);
    }

    public void logNoChallengesFound(Integer userId) {
        logger.debug(NO_CHALLENGES_FOUND, userId);
    }

    public void logChallengesFound(int count, Integer userId) {
        logger.debug(CHALLENGES_FOUND, count, userId);
    }

    public void logProgressUpdated(Long participantId) {
        logger.debug(PROGRESS_UPDATED, participantId);
    }

    public void logModificationDetails(Object modificationRequest) {
        logger.debug(MODIFICATION_DETAILS, modificationRequest);
    }

    public void logUpdatingTitle(String oldTitle, String newTitle) {
        logger.debug(UPDATING_TITLE, oldTitle, newTitle);
    }

    public void logUpdatingDescription() {
        logger.debug(UPDATING_DESCRIPTION);
    }

    public void logUpdatingGoal(Integer oldGoal, Integer newGoal) {
        logger.debug(UPDATING_GOAL, oldGoal, newGoal);
    }

    public void logUpdatingUnit(String oldUnit, String newUnit) {
        logger.debug(UPDATING_UNIT, oldUnit, newUnit);
    }

    public void logProcessingParticipants() {
        logger.debug(PROCESSING_PARTICIPANTS);
    }

    public void logModifyingParticipants(Long challengeId) {
        logger.debug(MODIFYING_PARTICIPANTS, challengeId);
    }

    public void logAddingParticipant(Integer userId) {
        logger.debug(ADDING_PARTICIPANT, userId);
    }

    public void logParticipantRemoved(Integer userId, Long challengeId) {
        logger.debug(PARTICIPANT_REMOVED, userId, challengeId);
    }

    public void logChallengeRetained(Long challengeId) {
        logger.debug(CHALLENGE_RETAINED, challengeId);
    }

    public void logParticipantAdded(Integer userId, Long challengeId) {
        logger.trace(PARTICIPANT_ADDED, userId, challengeId);
    }

    public void logParticipantsNotFoundError() {
        logger.error(PARTICIPANTS_NOT_FOUND_ERROR);
    }

    public void logParticipantNotFoundError(Integer userId, Long challengeId) {
        logger.error(PARTICIPANT_NOT_FOUND_ERROR, userId, challengeId);
    }

    public void logChallengeNotFoundError(Long challengeId) {
        logger.error(CHALLENGE_NOT_FOUND_ERROR, challengeId);
    }

    public void logParticipantModificationError() {
        logger.error(PARTICIPANT_MODIFICATION_ERROR);
    }

    public void logDeleteChallengeNotFoundError(Long challengeId) {
        logger.error(DELETE_CHALLENGE_NOT_FOUND_ERROR, challengeId);
    }

    public void logDeleteUserNotParticipatingError(Integer userId, Long challengeId) {
        logger.error(DELETE_USER_NOT_PARTICIPATING_ERROR, userId, challengeId);
    }
} 