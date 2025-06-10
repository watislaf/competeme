package app.auth.service;

import app.config.JwtService;
import app.excpetions.Unauthorized;
import app.excpetions.UserAlreadyExists;
import app.user.entity.Role;
import app.user.entity.User;
import app.user.entity.UserRepository;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.ZonedDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository repository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private JwtService jwtService;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @InjectMocks
    private AuthenticationService authenticationService;

    private User testUser;
    private RegistrationRequest registrationRequest;
    private AuthenticationRequest authenticationRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1)
            .email("test@example.com")
            .password("encoded_password")
            .name("testuser")
            .dateJoined(ZonedDateTime.now())
            .role(Role.USER)
            .build();

        registrationRequest = new RegistrationRequest("testuser", "test@example.com", "password123");
        authenticationRequest = new AuthenticationRequest("test@example.com", "password123");
    }

    @Test
    void register_ValidRequest_ReturnsAuthenticationResponse() {
        when(repository.findByName("testuser")).thenReturn(Optional.empty());
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(repository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1);
            return user;
        });
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("access_token");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refresh_token");

        AuthenticationResponse response = authenticationService.register(registrationRequest);

        assertNotNull(response);
        assertEquals("access_token", response.accessToken());
        assertEquals("refresh_token", response.refreshToken());
        assertEquals(1, response.userId());
        
        verify(repository).findByName("testuser");
        verify(repository).findByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(repository).save(any(User.class));
        verify(jwtService).generateAccessToken(any(User.class));
        verify(jwtService).generateRefreshToken(any(User.class));
    }

    @Test
    void register_UsernameAlreadyExists_ThrowsUserAlreadyExists() {
        when(repository.findByName("testuser")).thenReturn(Optional.of(testUser));

        UserAlreadyExists exception = assertThrows(UserAlreadyExists.class, 
            () -> authenticationService.register(registrationRequest));

        assertEquals("Username is already in use", exception.getMessage());
        verify(repository).findByName("testuser");
        verify(repository, never()).findByEmail(anyString());
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsUserAlreadyExists() {
        when(repository.findByName("testuser")).thenReturn(Optional.empty());
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        UserAlreadyExists exception = assertThrows(UserAlreadyExists.class, 
            () -> authenticationService.register(registrationRequest));

        assertEquals("User with this email already exists", exception.getMessage());
        verify(repository).findByName("testuser");
        verify(repository).findByEmail("test@example.com");
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void authenticate_ValidCredentials_ReturnsAuthenticationResponse() {
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(testUser)).thenReturn("access_token");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("refresh_token");

        AuthenticationResponse response = authenticationService.authenticate(authenticationRequest);

        assertNotNull(response);
        assertEquals("access_token", response.accessToken());
        assertEquals("refresh_token", response.refreshToken());
        assertEquals(1, response.userId());
        
        verify(repository).findByEmail("test@example.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).generateAccessToken(testUser);
        verify(jwtService).generateRefreshToken(testUser);
    }

    @Test
    void authenticate_UserNotFound_ThrowsUsernameNotFoundException() {
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, 
            () -> authenticationService.authenticate(authenticationRequest));

        assertEquals("User not found", exception.getMessage());
        verify(repository).findByEmail("test@example.com");
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    void authenticate_InvalidCredentials_ThrowsBadCredentialsException() {
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Bad credentials"));

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, 
            () -> authenticationService.authenticate(authenticationRequest));

        assertEquals("Invalid email or password", exception.getMessage());
        verify(repository).findByEmail("test@example.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void refresh_ValidToken_ReturnsAuthenticationResponse() {
        String refreshToken = "valid_refresh_token";
        when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractUserId(refreshToken)).thenReturn("1");
        when(repository.findById(1)).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(testUser)).thenReturn("new_access_token");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("new_refresh_token");

        AuthenticationResponse response = authenticationService.refresh(refreshToken);

        assertNotNull(response);
        assertEquals("new_access_token", response.accessToken());
        assertEquals("new_refresh_token", response.refreshToken());
        assertEquals(1, response.userId());
        
        verify(jwtService).isTokenValid(refreshToken);
        verify(jwtService).extractUserId(refreshToken);
        verify(repository).findById(1);
        verify(jwtService).generateAccessToken(testUser);
        verify(jwtService).generateRefreshToken(testUser);
    }

    @Test
    void refresh_NullToken_ThrowsJwtException() {
        JwtException exception = assertThrows(JwtException.class, 
            () -> authenticationService.refresh(null));

        assertEquals("Invalid refresh token", exception.getMessage());
        verify(jwtService, never()).extractUserId(anyString());
        verify(repository, never()).findById(anyInt());
    }

    @Test
    void refresh_InvalidToken_ThrowsJwtException() {
        String invalidToken = "invalid_token";
        when(jwtService.isTokenValid(invalidToken)).thenReturn(false);

        JwtException exception = assertThrows(JwtException.class, 
            () -> authenticationService.refresh(invalidToken));

        assertEquals("Invalid refresh token", exception.getMessage());
        verify(jwtService).isTokenValid(invalidToken);
        verify(jwtService, never()).extractUserId(anyString());
        verify(repository, never()).findById(anyInt());
    }

    @Test
    void refresh_UserNotFound_ThrowsUnauthorized() {
        String refreshToken = "valid_refresh_token";
        when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractUserId(refreshToken)).thenReturn("999");
        when(repository.findById(999)).thenReturn(Optional.empty());

        assertThrows(Unauthorized.class, 
            () -> authenticationService.refresh(refreshToken));

        verify(jwtService).isTokenValid(refreshToken);
        verify(jwtService).extractUserId(refreshToken);
        verify(repository).findById(999);
    }

    @Test
    void register_CreatesUserWithCorrectProperties() {
        when(repository.findByName("testuser")).thenReturn(Optional.empty());
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(repository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1);
            return savedUser;
        });
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("access_token");
        when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refresh_token");

        authenticationService.register(registrationRequest);

        verify(repository).save(argThat(user -> 
            user.getEmail().equals("test@example.com") &&
            user.getName().equals("testuser") &&
            user.getPassword().equals("encoded_password") &&
            user.getRole() == Role.USER &&
            user.getDateJoined() != null
        ));
    }

    @Test
    void authenticate_CreatesCorrectAuthenticationToken() {
        when(repository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(testUser)).thenReturn("access_token");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("refresh_token");

        authenticationService.authenticate(authenticationRequest);

        verify(authenticationManager).authenticate(argThat(token ->
            token instanceof UsernamePasswordAuthenticationToken &&
            token.getPrincipal().equals("test@example.com") &&
            token.getCredentials().equals("password123")
        ));
    }

    @Test
    void refresh_ExtractsCorrectUserIdFromToken() {
        String refreshToken = "valid_refresh_token";
        when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractUserId(refreshToken)).thenReturn("42");
        when(repository.findById(42)).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(testUser)).thenReturn("access_token");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("refresh_token");

        authenticationService.refresh(refreshToken);

        verify(jwtService).extractUserId(refreshToken);
        verify(repository).findById(42);
    }
} 