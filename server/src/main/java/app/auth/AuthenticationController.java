package app.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

//    @GetMapping("/email")
//    @Parameter(
//        name = "userDetails",
//        required = true,
//        description = "Details of the authenticated user",
//        content = @Content(
//            mediaType = "application/json",
//            schema = @Schema(implementation = UserDetails.class)
//        )
//    )
//    public String getEmail(@AuthenticationPrincipal UserDetails userDetails) {
//        return userDetails.getUsername();
//    }
}
