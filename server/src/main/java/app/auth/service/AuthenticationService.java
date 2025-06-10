package app.auth.service;

import app.config.JwtService;
import app.excpetions.Unauthorized;
import app.excpetions.UserAlreadyExists;
import app.user.entity.Role;
import app.user.entity.User;
import app.user.entity.UserRepository;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthLogger authLogger = new AuthLogger(log);

    public AuthenticationResponse register(RegistrationRequest request) {
        long startTime = System.currentTimeMillis();
        authLogger.logRegistrationAttempt(request.email());

        validateRegistrationRequest(request);

        User user = createUser(request);
        repository.save(user);
        authLogger.logRegistrationSuccess(user.getId(), user.getEmail());

        AuthenticationResponse response = generateTokensForUser(user);
        authLogger.logTokensGenerated(user.getId());
        authLogger.logRegistrationPerformance(request.email(), startTime);
        
        return response;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        long startTime = System.currentTimeMillis();
        authLogger.logAuthAttempt(request.email());

        User user = findUserByEmail(request.email());
        authenticateUser(request, user);

        AuthenticationResponse response = generateTokensForUser(user);
        authLogger.logAuthSuccess(user.getId(), user.getEmail());
        authLogger.logAuthenticationPerformance(request.email(), startTime);
        
        return response;
    }

    public AuthenticationResponse refresh(String refreshToken) {
        long startTime = System.currentTimeMillis();
        authLogger.logRefreshRequest();

        validateRefreshToken(refreshToken);
        
        String userId = jwtService.extractUserId(refreshToken);
        authLogger.logRefreshProcessing(userId);

        User user = findUserById(Integer.valueOf(userId));
        AuthenticationResponse response = generateTokensForUser(user);
        
        authLogger.logRefreshSuccess(userId);
        authLogger.logTokenRefreshPerformance(userId, startTime);
        
        return response;
    }

    private void validateRegistrationRequest(RegistrationRequest request) {
        repository.findByName(request.username()).ifPresent(user -> {
            authLogger.logUsernameTaken(request.username());
            throw new UserAlreadyExists("Username is already in use");
        });

        repository.findByEmail(request.email()).ifPresent(user -> {
            authLogger.logEmailAlreadyExists(request.email());
            throw new UserAlreadyExists("User with this email already exists");
        });
    }

    private User createUser(RegistrationRequest request) {
        return User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .name(request.username())
            .dateJoined(ZonedDateTime.now())
            .role(Role.USER)
            .build();
    }

    private User findUserByEmail(String email) {
        return repository.findByEmail(email)
            .orElseThrow(() -> {
                authLogger.logAuthUserNotFound(email);
                return new UsernameNotFoundException("User not found");
            });
    }

    private void authenticateUser(AuthenticationRequest request, User user) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
                )
            );
            authLogger.logAuthCredentialsSuccess(user.getId());
        } catch (BadCredentialsException e) {
            authLogger.logAuthInvalidCredentials(request.email());
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    private void validateRefreshToken(String refreshToken) {
        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            authLogger.logRefreshInvalidToken();
            throw new JwtException("Invalid refresh token");
        }
    }

    private User findUserById(Integer userId) {
        return repository.findById(userId)
            .orElseThrow(() -> {
                authLogger.logRefreshUserNotFound(userId.toString());
                return new Unauthorized();
            });
    }

    private AuthenticationResponse generateTokensForUser(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new AuthenticationResponse(accessToken, refreshToken, user.getId());
    }
}