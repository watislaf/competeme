package app.challenge.service;

import app.challenge.entity.Challenge;
import app.challenge.entity.ChallengeParticipants;
import app.challenge.entity.ChallengeParticipantsRepository;
import app.challenge.entity.ChallengeRepository;
import app.user.entity.User;
import app.user.entity.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChallengeServiceTest {

    @Mock
    private ChallengeRepository challengeRepository;

    @Mock
    private ChallengeParticipantsRepository challengeParticipantsRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ChallengeMapper challengeMapper;

    @InjectMocks
    private ChallengeService challengeService;

    private User testUser;
    private User testUser2;
    private Challenge testChallenge;
    private ChallengeRequest testChallengeRequest;
    private ChallengeModificationRequest testModificationRequest;
    private ChallengeParticipants testParticipant;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1)
                .name("Test User")
                .email("test@example.com")
                .build();

        testUser2 = User.builder()
                .id(2)
                .name("Test User 2")
                .email("test2@example.com")
                .build();

        testChallenge = Challenge.builder()
                .id(1L)
                .title("Test Challenge")
                .description("Test Description")
                .goal(100)
                .unit("steps")
                .createdAt(ZonedDateTime.now())
                .build();

        testChallengeRequest = new ChallengeRequest(
                "Test Challenge",
                "Test Description",
                100,
                "steps",
                new ArrayList<>(Arrays.asList(2))
        );

        testModificationRequest = new ChallengeModificationRequest(
                "Modified Title",
                "Modified Description",
                200,
                "km",
                Arrays.asList("User3")
        );

        testParticipant = ChallengeParticipants.builder()
                .id(1L)
                .user(testUser)
                .challenge(testChallenge)
                .progress(50)
                .build();
    }

    @Test
    void addChallenge_WhenValidRequest_ShouldCreateChallengeAndAddParticipants() {
        // Arrange
        when(userRepository.findAllById(Arrays.asList(2, 1))).thenReturn(Arrays.asList(testUser2, testUser));
        when(challengeRepository.save(any(Challenge.class))).thenReturn(testChallenge);

        // Act
        challengeService.addChallenge(1, testChallengeRequest);

        // Assert
        verify(challengeRepository).save(any(Challenge.class));
        verify(challengeParticipantsRepository, times(2)).save(any(ChallengeParticipants.class));
    }

    @Test
    void addChallenge_WhenParticipantNotFound_ShouldThrowException() {
        // Arrange
        when(userRepository.findAllById(Arrays.asList(2, 1))).thenReturn(Arrays.asList(testUser));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> challengeService.addChallenge(1, testChallengeRequest));
        assertEquals("One or more participants not found", exception.getMessage());
    }

    @Test
    void getChallenges_WhenUserHasChallenges_ShouldReturnChallengeResponses() {
        // Arrange
        List<ChallengeParticipants> participants = Arrays.asList(testParticipant);
        ChallengeResponse challengeResponse = new ChallengeResponse(1L, "Test", "Desc", 100, "steps", List.of(), 50, List.of(), false);
        
        when(challengeParticipantsRepository.findByUserId(1)).thenReturn(participants);
        when(challengeMapper.mapToChallengeResponse(testChallenge)).thenReturn(challengeResponse);

        // Act
        List<ChallengeResponse> result = challengeService.getChallenges(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(challengeMapper).mapToChallengeResponse(testChallenge);
    }

    @Test
    void getChallenges_WhenUserHasNoChallenges_ShouldReturnEmptyList() {
        // Arrange
        when(challengeParticipantsRepository.findByUserId(1)).thenReturn(List.of());

        // Act
        List<ChallengeResponse> result = challengeService.getChallenges(1);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void updateProgress_WhenValidUserAndChallenge_ShouldUpdateProgress() {
        // Arrange
        when(challengeParticipantsRepository.findByUserIdAndChallengeId(1, 1L))
                .thenReturn(Optional.of(testParticipant));

        // Act
        challengeService.updateProgress(1, 1L, 75);

        // Assert
        assertEquals(75, testParticipant.getProgress());
        verify(challengeParticipantsRepository).save(testParticipant);
    }

    @Test
    void updateProgress_WhenUserNotParticipating_ShouldThrowException() {
        // Arrange
        when(challengeParticipantsRepository.findByUserIdAndChallengeId(1, 1L))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> challengeService.updateProgress(1, 1L, 75));
        assertEquals("User 1 isn't participating in challenge 1", exception.getMessage());
    }

    @Test
    void modifyChallenge_WhenValidRequest_ShouldUpdateChallengeFields() {
        // Arrange
        when(challengeRepository.findById(1L)).thenReturn(Optional.of(testChallenge));
        when(userRepository.findAllByNameIn(Arrays.asList("User3"))).thenReturn(Arrays.asList(testUser2));
        when(challengeParticipantsRepository.existsByUserIdAndChallengeId(testUser2.getId(), testChallenge.getId()))
                .thenReturn(false);

        // Act
        challengeService.modifyChallenge(1L, testModificationRequest);

        // Assert
        assertEquals("Modified Title", testChallenge.getTitle());
        assertEquals("Modified Description", testChallenge.getDescription());
        assertEquals(200, testChallenge.getGoal());
        assertEquals("km", testChallenge.getUnit());
        verify(challengeRepository).save(testChallenge);
        verify(challengeParticipantsRepository).save(any(ChallengeParticipants.class));
    }

    @Test
    void modifyChallenge_WhenChallengeNotFound_ShouldThrowException() {
        // Arrange
        when(challengeRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> challengeService.modifyChallenge(1L, testModificationRequest));
        assertEquals("Challenge not found", exception.getMessage());
    }

    @Test
    void modifyChallenge_WhenParticipantNotFound_ShouldThrowException() {
        // Arrange
        when(challengeRepository.findById(1L)).thenReturn(Optional.of(testChallenge));
        when(userRepository.findAllByNameIn(Arrays.asList("User3"))).thenReturn(List.of());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> challengeService.modifyChallenge(1L, testModificationRequest));
        assertEquals("One or more participants not found", exception.getMessage());
    }

    @Test
    void deleteChallenge_WhenUserIsParticipating_ShouldRemoveParticipantAndDeleteChallengeIfNoParticipants() {
        // Arrange
        when(challengeRepository.findById(1L)).thenReturn(Optional.of(testChallenge));
        when(challengeParticipantsRepository.findByUserIdAndChallengeId(1, 1L))
                .thenReturn(Optional.of(testParticipant));
        when(challengeParticipantsRepository.existsByChallengeId(1L)).thenReturn(false);

        // Act
        challengeService.deleteChallenge(1, 1L);

        // Assert
        verify(challengeParticipantsRepository).delete(testParticipant);
        verify(challengeRepository).delete(testChallenge);
    }

    @Test
    void deleteChallenge_WhenChallengeHasOtherParticipants_ShouldNotDeleteChallenge() {
        // Arrange
        when(challengeRepository.findById(1L)).thenReturn(Optional.of(testChallenge));
        when(challengeParticipantsRepository.findByUserIdAndChallengeId(1, 1L))
                .thenReturn(Optional.of(testParticipant));
        when(challengeParticipantsRepository.existsByChallengeId(1L)).thenReturn(true);

        // Act
        challengeService.deleteChallenge(1, 1L);

        // Assert
        verify(challengeParticipantsRepository).delete(testParticipant);
        verify(challengeRepository, never()).delete(testChallenge);
    }

    @Test
    void deleteChallenge_WhenChallengeNotFound_ShouldThrowException() {
        // Arrange
        when(challengeRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> challengeService.deleteChallenge(1, 1L));
        assertEquals("Challenge not found", exception.getMessage());
    }

    @Test
    void deleteChallenge_WhenUserNotParticipating_ShouldThrowException() {
        // Arrange
        when(challengeRepository.findById(1L)).thenReturn(Optional.of(testChallenge));
        when(challengeParticipantsRepository.findByUserIdAndChallengeId(1, 1L))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> challengeService.deleteChallenge(1, 1L));
        assertEquals("User is not participating in this challenge", exception.getMessage());
    }
} 