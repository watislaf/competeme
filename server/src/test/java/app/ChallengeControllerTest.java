package app;

import app.challenge.ChallengeController;
import app.challenge.service.ChallengeModificationRequest;
import app.challenge.service.ChallengeRequest;
import app.challenge.service.ChallengeService;
import app.util.BaseControllerTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static app.util.TestDataFactory.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChallengeController.class)
@AutoConfigureMockMvc(addFilters = false)
class ChallengeControllerTest extends BaseControllerTest {

    @MockBean
    private ChallengeService challengeService;

    @Test
    void shouldCreateChallenge() throws Exception {
        var request = new ChallengeRequest("Fitness Challenge", "30 day workout", 30, "workouts", List.of(2, 3));
        doNothing().when(challengeService).addChallenge(anyInt(), any());

        performPost("/api/v1/users/1/challenges/", request)
                .andExpect(status().isOk());

        verify(challengeService).addChallenge(1, request);
    }

    @Test
    void shouldHandleCreateChallengeError() throws Exception {
        var request = new ChallengeRequest("Invalid Challenge", "", -1, "", List.of());
        doThrow(new IllegalArgumentException("Invalid challenge data"))
                .when(challengeService).addChallenge(anyInt(), any());

        performPost("/api/v1/users/1/challenges/", request)
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldGetUserChallenges() throws Exception {
        var challenges = List.of(
                challenge().title("Challenge 1").buildResponse(),
                challenge().id(2L).title("Challenge 2").goal(50).buildResponse()
        );
        when(challengeService.getChallenges(1)).thenReturn(challenges);

        performGet("/api/v1/users/1/challenges/")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].title").value("Challenge 1"))
                .andExpect(jsonPath("$[1].goal").value(50));
    }

    @Test
    void shouldGetUserChallengesForDifferentUser() throws Exception {
        var challenges = List.of(
                challenge().buildResponse(),
                challenge().id(2L).title("User 2 Challenge").buildResponse()
        );
        when(challengeService.getChallenges(2)).thenReturn(challenges);

        performGet("/api/v1/users/2/challenges/")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[1].title").value("User 2 Challenge"));
    }

    @Test
    void shouldUpdateProgress() throws Exception {
        doNothing().when(challengeService).updateProgress(anyInt(), anyLong(), anyInt());

        performPostWithString("/api/v1/users/1/challenges/1/progress?progress=50", "")
                .andExpect(status().isOk());

        verify(challengeService).updateProgress(1, 1L, 50);
    }

    @Test
    void shouldHandleUpdateProgressNotParticipating() throws Exception {
        doThrow(new RuntimeException("Not participating"))
                .when(challengeService).updateProgress(anyInt(), anyLong(), anyInt());

        performPostWithString("/api/v1/users/1/challenges/1/progress?progress=50", "")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldDeleteChallenge() throws Exception {
        doNothing().when(challengeService).deleteChallenge(anyInt(), anyLong());

        performDelete("/api/v1/users/1/challenges/1")
                .andExpect(status().isOk());

        verify(challengeService).deleteChallenge(1, 1L);
    }

    @Test
    void shouldHandleDeleteChallengeNotParticipating() throws Exception {
        doThrow(new RuntimeException("Not participating"))
                .when(challengeService).deleteChallenge(anyInt(), anyLong());

        performDelete("/api/v1/users/1/challenges/1")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldModifyChallenge() throws Exception {
        var request = new ChallengeModificationRequest("Updated Title", "Updated Description", 40, "reps", List.of("user2"));
        doNothing().when(challengeService).modifyChallenge(anyLong(), any());

        performPost("/api/v1/users/1/challenges/1/modify", request)
                .andExpect(status().isOk());

        verify(challengeService).modifyChallenge(1L, request);
    }

    @Test
    void shouldModifyChallengePartialUpdate() throws Exception {
        var request = new ChallengeModificationRequest("Updated Title", null, null, null, null);
        doNothing().when(challengeService).modifyChallenge(anyLong(), any());

        performPost("/api/v1/users/1/challenges/1/modify", request)
                .andExpect(status().isOk());

        verify(challengeService).modifyChallenge(1L, request);
    }

    @Test
    void shouldHandleModifyChallengeNotFound() throws Exception {
        var request = new ChallengeModificationRequest("Title", "Description", 30, "workouts", List.of());
        doThrow(new RuntimeException("Challenge not found"))
                .when(challengeService).modifyChallenge(anyLong(), any());

        performPost("/api/v1/users/1/challenges/999/modify", request)
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldHandleInvalidUserId() throws Exception {
        var request = new ChallengeRequest("Challenge", "Description", 30, "workouts", List.of());
        doThrow(new IllegalArgumentException("Invalid user ID"))
                .when(challengeService).addChallenge(anyInt(), any());

        performPost("/api/v1/users/0/challenges/", request)
                .andExpect(status().isInternalServerError());
    }
} 