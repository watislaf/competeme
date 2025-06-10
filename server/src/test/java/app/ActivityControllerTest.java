package app;

import app.activity.service.ActivityController;
import app.activity.service.ActivityRequest;
import app.activity.entity.Type;
import app.activity.service.ActivityService;
import app.activity.service.UserActivityResponse;
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

@WebMvcTest(ActivityController.class)
@AutoConfigureMockMvc(addFilters = false)
class ActivityControllerTest extends BaseControllerTest {

    @MockBean
    private ActivityService activityService;

    @Test
    void shouldAddActivity() throws Exception {
        var request = new ActivityRequest("Push-ups", Type.DUMBBELL, 30L);
        doNothing().when(activityService).addActivity(anyInt(), any());

        performPost("/api/v1/users/1/activities/", request)
                .andExpect(status().isOk());

        verify(activityService).addActivity(1, request);
    }

    @Test
    void shouldHandleAddActivityInvalidType() throws Exception {
        var request = new ActivityRequest("Invalid Activity", Type.BOOK, 0L);
        doThrow(new IllegalArgumentException("Invalid activity type"))
                .when(activityService).addActivity(anyInt(), any());

        performPost("/api/v1/users/1/activities/", request)
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldAddActivityWithDifferentTypes() throws Exception {
        var requests = List.of(
                new ActivityRequest("Running", Type.BOOK, 45L),
                new ActivityRequest("Weight Lifting", Type.DUMBBELL, 60L),
                new ActivityRequest("Reading", Type.BOOK, 30L)
        );

        for (var request : requests) {
            doNothing().when(activityService).addActivity(anyInt(), any());
            performPost("/api/v1/users/1/activities/", request)
                    .andExpect(status().isOk());
        }
    }

    @Test
    void shouldGetActivities() throws Exception {
        var available = List.of(
                activity().title("Push-ups").buildResponse(),
                activity().id(2L).title("Running").buildResponse()
        );
        var recent = List.of(
                activity().title("Push-ups").buildRecentResponse()
        );
        var response = new UserActivityResponse(available, recent);
        when(activityService.getActivities(1)).thenReturn(response);

        performGet("/api/v1/users/1/activities/")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.availableActivities.size()").value(2))
                .andExpect(jsonPath("$.recentActivities.size()").value(1))
                .andExpect(jsonPath("$.availableActivities[0].title").value("Push-ups"));
    }

    @Test
    void shouldGetActivitiesEmptyResult() throws Exception {
        var response = new UserActivityResponse(List.of(), List.of());
        when(activityService.getActivities(1)).thenReturn(response);

        performGet("/api/v1/users/1/activities/")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.availableActivities.size()").value(0))
                .andExpect(jsonPath("$.recentActivities.size()").value(0));
    }

    @Test
    void shouldAddProgress() throws Exception {
        doNothing().when(activityService).addProgress(anyLong(), anyLong(), anyInt());

        performPostWithString("/api/v1/users/1/activities/1/progress", "30")
                .andExpect(status().isOk());

        verify(activityService).addProgress(1L, 30L, 1);
    }

    @Test
    void shouldAddProgressZeroMinutes() throws Exception {
        doNothing().when(activityService).addProgress(anyLong(), anyLong(), anyInt());

        performPostWithString("/api/v1/users/1/activities/1/progress", "0")
                .andExpect(status().isOk());

        verify(activityService).addProgress(1L, 0L, 1);
    }

    @Test
    void shouldHandleAddProgressActivityNotFound() throws Exception {
        doThrow(new RuntimeException("Activity not found"))
                .when(activityService).addProgress(anyLong(), anyLong(), anyInt());

        performPostWithString("/api/v1/users/1/activities/999/progress", "30")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldDeleteActivity() throws Exception {
        doNothing().when(activityService).deleteActivity(anyLong(), anyInt());

        performDelete("/api/v1/users/1/activities/1")
                .andExpect(status().isOk());

        verify(activityService).deleteActivity(1L, 1);
    }

    @Test
    void shouldHandleDeleteActivityNotFound() throws Exception {
        doThrow(new RuntimeException("Activity not found"))
                .when(activityService).deleteActivity(anyLong(), anyInt());

        performDelete("/api/v1/users/1/activities/999")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldGetRandomActivity() throws Exception {
        when(activityService.getRandomActivity(anyInt())).thenReturn("Random Activity Name");

        performGet("/api/v1/users/1/activities/random")
                .andExpect(status().isOk())
                .andExpect(content().string("Random Activity Name"));
    }

    @Test
    void shouldHandleRandomActivityError() throws Exception {
        when(activityService.getRandomActivity(anyInt())).thenThrow(new RuntimeException("External API error"));

        performGet("/api/v1/users/1/activities/random")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldHandleInvalidProgressValue() throws Exception {
        doThrow(new IllegalArgumentException("Progress cannot be negative"))
                .when(activityService).addProgress(anyLong(), anyLong(), anyInt());

        performPostWithString("/api/v1/users/1/activities/1/progress", "-10")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldHandleUserNotFound() throws Exception {
        doThrow(new IllegalArgumentException("User not found"))
                .when(activityService).addActivity(anyInt(), any());

        var request = new ActivityRequest("Test Activity", Type.DUMBBELL, 30L);
        performPost("/api/v1/users/999/activities/", request)
                .andExpect(status().isInternalServerError());
    }
} 