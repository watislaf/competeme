package app.config;

import app.user.User;
import app.user.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final List<String> PERMIT_ALL_ENDPOINTS = List.of(
        "/api/v1/auth/register",
        "/api/v1/auth/authenticate",
        "/api/v1/auth/refresh-token",
        "/api/spec"
    );
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        final String jwt;
        final String userId;
        if (PERMIT_ALL_ENDPOINTS.stream().anyMatch(endpoint ->
            new AntPathRequestMatcher(endpoint).matches(request))) {
            filterChain.doFilter(request, response);
            return;
        }
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            response.setStatus(401);
            return;
        }
        jwt = authorizationHeader.substring(7);
        try {
            userId = jwtService.extractUserId(jwt);
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                User user = this.userService.getUserById(Integer.valueOf(userId));
                if (jwtService.isTokenValid(jwt)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                    );
                    authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            response.setStatus(401);
            return;
        }
        filterChain.doFilter(request, response);
    }
}
