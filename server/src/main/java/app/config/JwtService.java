package app.config;

import app.friendship.service.FriendshipService;
import app.user.entity.Role;
import app.user.entity.User;
import app.user.entity.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final long ACCESS_TOKEN_VALIDITY = 60 * 60 * 1000;
    private final long REFRESH_TOKEN_VALIDITY = 10L * 24 * 60 * 60 * 1000;
    private final UserRepository userRepository;
    private final FriendshipService friendshipService;
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String generateAccessToken(User user) {
        return generateToken(new HashMap<>(), user, ACCESS_TOKEN_VALIDITY);
    }

    public String generateRefreshToken(User user) {
        return generateToken(new HashMap<>(), user, REFRESH_TOKEN_VALIDITY);
    }

    public String generateToken(
        Map<String, Object> extraClaims,
        User user,
        long validity
    ) {
        return Jwts
            .builder()
            .setClaims(extraClaims)
            .setSubject(String.valueOf(user.getId()))
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + validity))
            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
            .parserBuilder()
            .setSigningKey(getSignInKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean hasAccess(Authentication authentication, Integer userId, String permission) {
        User user = extractUser(authentication);
        return switch (permission) {
            case "ADMIN_ACCESS" -> isAdmin(user);
            case "USER_READ_ACCESS" -> areFriends(user, userId) || isCurrentUser(user, userId) || isAdmin(user);
            case "USER_MODIFICATION_ACCESS" -> isCurrentUser(user, userId) || isAdmin(user);
            default -> false;
        };
    }

    private boolean isCurrentUser(User user, Integer userId) {
        return Objects.equals(user.getId(), userId);
    }

    private boolean areFriends(User user, Integer userId) {
        return friendshipService.isFriend(user.getId(), userId);
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }

    private User extractUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
