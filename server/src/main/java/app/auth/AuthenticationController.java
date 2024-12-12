package app.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/refresh-token")
    public AuthenticationResponse refresh(
            @RequestBody String refreshToken
    ) {
        return service.refresh(refreshToken);
    }

    // TODO delete
    @GetMapping("/email")
    @Operation(security = {@SecurityRequirement(name = "JwtAuth")})
    public String getEmail(@AuthenticationPrincipal UserDetails userDetails) {
        return userDetails.getUsername();
    }
}
