package app;

import app.config.JwtAuthenticationFilter;
import app.config.JwtService;
import app.user.UserController;
import app.user.service.UserProfileResponse;
import app.user.service.UserSearchResponse;
import app.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.ZonedDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void shouldGetUserProfile() throws Exception {
        UserProfileResponse profile = UserProfileResponse.builder()
                .id(1)
                .name("Test User")
                .email("test@example.com")
                .imageUrl("https://example.com/image.jpg")
                .dateJoined(ZonedDateTime.now())
                .role("USER")
                .build();

        when(userService.getUserProfile(1)).thenReturn(profile);

        mockMvc.perform(get("/api/v1/users/1/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void shouldSearchUsers() throws Exception {
        List<UserSearchResponse> users = List.of(
                new UserSearchResponse(1, "john_doe", "http://example.com/john.png"),
                new UserSearchResponse(2, "jane_smith", "http://example.com/jane.png")
        );

        when(userService.searchUsersSorted("john")).thenReturn(users);

        mockMvc.perform(get("/api/v1/users/search").param("query", "john"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].username").value("john_doe"))
                .andExpect(jsonPath("$[0].imageUrl").value("http://example.com/john.png"));
    }

    @Test
    void shouldUpdateProfileImage() throws Exception {
        mockMvc.perform(put("/api/v1/users/1/image")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"http://new.image/url.jpg\""))
                .andExpect(status().isOk());

        Mockito.verify(userService).updateProfileImage(1, "http://new.image/url.jpg");
    }

    @Test
    void shouldUpdateProfileName() throws Exception {
        mockMvc.perform(put("/api/v1/users/1/updateName")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"New Name\""))
                .andExpect(status().isOk());

        Mockito.verify(userService).updateProfileName(1, "New Name");
    }
}
