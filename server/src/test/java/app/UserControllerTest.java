package app;

import app.user.UserController;
import app.user.service.UserService;
import app.util.BaseControllerTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static app.util.TestDataFactory.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest extends BaseControllerTest {

    @MockBean
    private UserService userService;

    @Test
    void shouldGetUserProfile() throws Exception {
        var profile = user().name("Test User").buildProfileResponse();
        when(userService.getUserProfile(1)).thenReturn(profile);

        performGet("/api/v1/users/1/profile")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void shouldGetUserProfileNotFound() throws Exception {
        when(userService.getUserProfile(999)).thenThrow(new RuntimeException("User not found"));

        performGet("/api/v1/users/999/profile")
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldSearchUsers() throws Exception {
        var users = List.of(
                user().id(1).name("john_doe").buildSearchResponse(),
                user().id(2).name("jane_smith").imageUrl("http://example.com/jane.png").buildSearchResponse()
        );
        when(userService.searchUsersSorted("john")).thenReturn(users);

        performGetWithParam("/api/v1/users/search", "query", "john")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].username").value("john_doe"));
    }

    @Test
    void shouldSearchUsersEmptyResult() throws Exception {
        when(userService.searchUsersSorted("nonexistent")).thenReturn(List.of());

        performGetWithParam("/api/v1/users/search", "query", "nonexistent")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
    }

    @Test
    void shouldUpdateProfileImage() throws Exception {
        performPutWithString("/api/v1/users/1/image", jsonString("http://new.image/url.jpg"))
                .andExpect(status().isOk());

        Mockito.verify(userService).updateProfileImage(1, "http://new.image/url.jpg");
    }

    @Test
    void shouldUpdateProfileImageWithNull() throws Exception {
        performPutWithString("/api/v1/users/1/image", "null")
                .andExpect(status().isOk());

        Mockito.verify(userService).updateProfileImage(1, null);
    }

    @Test
    void shouldUpdateProfileName() throws Exception {
        performPutWithString("/api/v1/users/1/updateName", jsonString("New Name"))
                .andExpect(status().isOk());

        Mockito.verify(userService).updateProfileName(1, "New Name");
    }

    @Test
    void shouldHandleUpdateProfileNameError() throws Exception {
        Mockito.doThrow(new IllegalArgumentException("Name too long"))
                .when(userService).updateProfileName(1, "Very Long Name");

        performPutWithString("/api/v1/users/1/updateName", jsonString("Very Long Name"))
                .andExpect(status().isInternalServerError());
    }
}
