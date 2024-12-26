package app.auth.service;

import app.config.JwtService;
import app.excpetions.Unauthorized;
import app.user.entity.Role;
import app.user.entity.User;
import app.user.entity.UserRepository;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegistrationRequest request) {
        if (repository.findByName(request.username()).isPresent()) {
            throw new IllegalArgumentException("Username is already in use");
        }

        if (repository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        var user = User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .name(request.username())
            .dateJoined(ZonedDateTime.now())
            .role(Role.USER)
            .build();

        repository.save(user);

        log.info("Saving user: {}", user.getEmail());

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return new AuthenticationResponse(accessToken, refreshToken, user.getId());
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = repository.findByEmail(request.email())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
            )
        );

        log.info("Authenticating user: {}", user.getEmail());

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return new AuthenticationResponse(accessToken, refreshToken, user.getId());
    }

    public AuthenticationResponse refresh(String refreshToken) {
        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            throw new JwtException("Invalid refresh token");
        }

        String userId = jwtService.extractUserId(refreshToken);
        var user = repository.findById(Integer.valueOf(userId))
            .orElseThrow(Unauthorized::new);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        return new AuthenticationResponse(newAccessToken, newRefreshToken, user.getId());
    }
}
