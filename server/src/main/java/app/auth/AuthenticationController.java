package app.auth;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/register")
    public AuthenticationResponse register(
        @RequestBody RegistrationRequest request
    ) {
        return service.register(request);
    }

    @PostMapping("/authenticate")
    public AuthenticationResponse authenticate(
        @RequestBody AuthenticationRequest request
    ) {
        return service.authenticate(request);
    }

    @GetMapping("/email")
    @Parameter(
        name = "userDetails",
        required = true,
        description = "Details of the authenticated user",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = UserDetails.class)
        )
    )
    public String getEmail(@AuthenticationPrincipal UserDetails userDetails) {
        return userDetails.getUsername();
    }
}
