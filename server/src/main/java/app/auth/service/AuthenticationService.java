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

    public AuthenticationResponse register(RegistrationRequest request) {
        log.info("Attempting to register new user with email: {}", request.email());

        repository.findByName(request.username()).ifPresent(user -> {
            log.warn("Registration failed - username already taken: {}", request.username());
            throw new UserAlreadyExists("Username is already in use");
        });

        repository.findByEmail(request.email()).ifPresent(user -> {
            log.warn("Registration failed - email already registered: {}", request.email());
            throw new UserAlreadyExists("User with this email already exists");
        });

        var user = User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .name(request.username())
            .dateJoined(ZonedDateTime.now())
            .role(Role.USER)
            .build();

        repository.save(user);
        log.info("User registered successfully - ID: {}, Email: {}", user.getId(), user.getEmail());

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        log.debug("Tokens generated for user ID: {}", user.getId());
        return new AuthenticationResponse(accessToken, refreshToken, user.getId());
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Authentication attempt for email: {}", request.email());

        var user = repository.findByEmail(request.email())
            .orElseThrow(() -> {
                log.warn("Authentication failed - user not found for email: {}", request.email());
                return new UsernameNotFoundException("User not found");
            });

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
                )
            );
            log.debug("Authentication successful for user ID: {}", user.getId());
        } catch (BadCredentialsException e) {
            log.warn("Authentication failed - invalid credentials for email: {}", request.email());
            throw new BadCredentialsException("Invalid email or password");
        }

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        log.info("User authenticated successfully - ID: {}, Email: {}", user.getId(), user.getEmail());
        return new AuthenticationResponse(accessToken, refreshToken, user.getId());
    }

    public AuthenticationResponse refresh(String refreshToken) {
        log.debug("Refresh token request received");

        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            log.warn("Invalid refresh token attempt");
            throw new JwtException("Invalid refresh token");
        }

        String userId = jwtService.extractUserId(refreshToken);
        log.debug("Processing refresh token for user ID: {}", userId);

        var user = repository.findById(Integer.valueOf(userId))
            .orElseThrow(() -> {
                log.error("User not found during refresh for ID: {}", userId);
                return new Unauthorized();
            });

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        log.info("Tokens refreshed successfully for user ID: {}", userId);
        return new AuthenticationResponse(newAccessToken, newRefreshToken, user.getId());
    }
}