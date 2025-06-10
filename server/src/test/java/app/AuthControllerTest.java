package app;

import app.auth.service.AuthenticationController;
import app.auth.service.AuthenticationService;
import app.util.BaseControllerTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static app.util.TestDataFactory.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthenticationController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest extends BaseControllerTest {

    @MockBean
    private AuthenticationService authenticationService;

    @Test
    void shouldRegisterUser() throws Exception {
        var request = auth().buildRegistrationRequest();
        var response = auth().buildAuthenticationResponse();
        when(authenticationService.register(any())).thenReturn(response);

        performPost("/api/v1/auth/register", request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access.token.jwt"))
                .andExpect(jsonPath("$.refreshToken").value("refresh.token.jwt"))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    void shouldRegisterUserWithDifferentCredentials() throws Exception {
        var request = auth().username("newuser").email("new@test.com").buildRegistrationRequest();
        var response = auth().userId(2).buildAuthenticationResponse();
        when(authenticationService.register(any())).thenReturn(response);

        performPost("/api/v1/auth/register", request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(2));
    }

    @Test
    void shouldHandleRegistrationError() throws Exception {
        var request = auth().buildRegistrationRequest();
        when(authenticationService.register(any())).thenThrow(new IllegalArgumentException("Email already exists"));

        performPost("/api/v1/auth/register", request)
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldAuthenticateUser() throws Exception {
        var request = auth().buildAuthenticationRequest();
        var response = auth().buildAuthenticationResponse();
        when(authenticationService.authenticate(any())).thenReturn(response);

        performPost("/api/v1/auth/authenticate", request)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    void shouldHandleAuthenticationFailure() throws Exception {
        var request = auth().buildAuthenticationRequest();
        when(authenticationService.authenticate(any())).thenThrow(new RuntimeException("Invalid credentials"));

        performPost("/api/v1/auth/authenticate", request)
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldRefreshToken() throws Exception {
        var response = auth().accessToken("new.access.token").buildAuthenticationResponse();
        when(authenticationService.refresh("refresh.token.jwt")).thenReturn(response);

        performPostWithString("/api/v1/auth/refresh-token", jsonString("refresh.token.jwt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new.access.token"))
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    void shouldHandleInvalidRefreshToken() throws Exception {
        when(authenticationService.refresh("invalid.token")).thenThrow(new RuntimeException("Invalid refresh token"));

        performPostWithString("/api/v1/auth/refresh-token", jsonString("invalid.token"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void shouldHandleNullRefreshToken() throws Exception {
        when(authenticationService.refresh(null)).thenThrow(new IllegalArgumentException("Token cannot be null"));

        performPostWithString("/api/v1/auth/refresh-token", "null")
                .andExpect(status().isInternalServerError());
    }
} 