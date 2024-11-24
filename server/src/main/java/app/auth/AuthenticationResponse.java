package app.auth;

import lombok.Builder;

@Builder
public record AuthenticationResponse(String token) {
}
