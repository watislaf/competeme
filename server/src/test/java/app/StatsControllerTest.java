package app;

import app.stats.StatsController;
import app.stats.service.StatsResponse;
import app.stats.service.StatsService;
import app.util.BaseControllerTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StatsController.class)
@AutoConfigureMockMvc(addFilters = false)
class StatsControllerTest extends BaseControllerTest {

    @MockBean
    private StatsService statsService;

    @Test
    void shouldGetUserStats() throws Exception {
        var mockResponse = new StatsResponse("150", "300", "7", null, "21", "45%", null, null, List.of(), List.of(), List.of(), "Great progress!");
        when(statsService.getStats(1)).thenReturn(mockResponse);

        performGet("/api/v1/users/1/stats/")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTimeThisWeek").value("150"))
                .andExpect(jsonPath("$.totalTimeThisMonth").value("300"));
    }

    @Test
    void shouldHandleUserNotFound() throws Exception {
        when(statsService.getStats(999)).thenThrow(new RuntimeException("User not found"));

        performGet("/api/v1/users/999/stats/")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldHandleStatsCalculationError() throws Exception {
        when(statsService.getStats(1)).thenThrow(new RuntimeException("Calculation error"));

        performGet("/api/v1/users/1/stats/")
                .andExpect(status().isInternalServerError());
    }
} 