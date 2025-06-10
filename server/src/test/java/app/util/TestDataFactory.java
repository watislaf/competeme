package app.util;

import app.user.entity.User;
import app.user.entity.Role;
import app.user.service.UserProfileResponse;
import app.user.service.UserSearchResponse;
import app.challenge.entity.Challenge;
import app.challenge.entity.ChallengeParticipants;
import app.challenge.service.ChallengeResponse;
import app.activity.entity.Activity;
import app.activity.entity.Type;
import app.activity.service.ActivityResponse;
import app.activity.service.RecentActivityResponse;
import app.auth.service.AuthenticationResponse;
import app.auth.service.RegistrationRequest;
import app.auth.service.AuthenticationRequest;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;

public class TestDataFactory {

    public static class UserBuilder {
        private Integer id = 1;
        private String name = "testuser";
        private String email = "test@example.com";
        private String password = "password";
        private String imageUrl = "https://example.com/image.jpg";
        private ZonedDateTime dateJoined = ZonedDateTime.now();
        private Role role = Role.USER;

        public UserBuilder id(Integer id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public UserBuilder dateJoined(ZonedDateTime dateJoined) { this.dateJoined = dateJoined; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }

        public User buildEntity() {
            return User.builder()
                    .id(id)
                    .name(name)
                    .email(email)
                    .password(password)
                    .imageUrl(imageUrl)
                    .dateJoined(dateJoined)
                    .role(role)
                    .build();
        }

        public UserProfileResponse buildProfileResponse() {
            return UserProfileResponse.builder()
                    .id(id)
                    .name(name)
                    .email(email)
                    .imageUrl(imageUrl)
                    .dateJoined(dateJoined)
                    .role(role.name())
                    .build();
        }

        public UserSearchResponse buildSearchResponse() {
            return new UserSearchResponse(id, name, imageUrl);
        }
    }

    public static class ChallengeBuilder {
        private Long id = 1L;
        private String title = "Test Challenge";
        private String description = "Test Description";
        private Integer goal = 30;
        private String unit = "workouts";
        private ZonedDateTime createdAt = ZonedDateTime.now();

        public ChallengeBuilder id(Long id) { this.id = id; return this; }
        public ChallengeBuilder title(String title) { this.title = title; return this; }
        public ChallengeBuilder description(String description) { this.description = description; return this; }
        public ChallengeBuilder goal(Integer goal) { this.goal = goal; return this; }
        public ChallengeBuilder unit(String unit) { this.unit = unit; return this; }
        public ChallengeBuilder createdAt(ZonedDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Challenge buildEntity() {
            return Challenge.builder()
                    .id(id)
                    .title(title)
                    .description(description)
                    .goal(goal)
                    .unit(unit)
                    .createdAt(createdAt)
                    .build();
        }

        public ChallengeResponse buildResponse() {
            return new ChallengeResponse(id, title, description, goal, unit, List.of(), 0, List.of(), false);
        }
    }

    public static class ActivityBuilder {
        private Long id = 1L;
        private String title = "Push-ups";
        private Type type = Type.DUMBBELL;
        private Duration duration = Duration.ofMinutes(30);
        private ZonedDateTime date = ZonedDateTime.now();
        private User user;

        public ActivityBuilder id(Long id) { this.id = id; return this; }
        public ActivityBuilder title(String title) { this.title = title; return this; }
        public ActivityBuilder type(Type type) { this.type = type; return this; }
        public ActivityBuilder duration(Duration duration) { this.duration = duration; return this; }
        public ActivityBuilder date(ZonedDateTime date) { this.date = date; return this; }
        public ActivityBuilder user(User user) { this.user = user; return this; }

        public Activity buildEntity() {
            if (user == null) {
                user = new UserBuilder().buildEntity();
            }
            return Activity.builder()
                    .id(id)
                    .title(title)
                    .type(type)
                    .duration(duration)
                    .date(date)
                    .user(user)
                    .build();
        }

        public ActivityResponse buildResponse() {
            return new ActivityResponse(id, title, type);
        }

        public RecentActivityResponse buildRecentResponse() {
            return new RecentActivityResponse(id, title, type, duration.toMinutes() + " min");
        }
    }

    public static class AuthBuilder {
        private String username = "testuser";
        private String email = "test@example.com";
        private String password = "password";
        private String accessToken = "access.token.jwt";
        private String refreshToken = "refresh.token.jwt";
        private Integer userId = 1;

        public AuthBuilder username(String username) { this.username = username; return this; }
        public AuthBuilder email(String email) { this.email = email; return this; }
        public AuthBuilder password(String password) { this.password = password; return this; }
        public AuthBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public AuthBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public AuthBuilder userId(Integer userId) { this.userId = userId; return this; }

        public RegistrationRequest buildRegistrationRequest() {
            return new RegistrationRequest(username, email, password);
        }

        public AuthenticationRequest buildAuthenticationRequest() {
            return new AuthenticationRequest(email, password);
        }

        public AuthenticationResponse buildAuthenticationResponse() {
            return new AuthenticationResponse(accessToken, refreshToken, userId);
        }
    }

    public static UserBuilder user() { return new UserBuilder(); }
    public static ChallengeBuilder challenge() { return new ChallengeBuilder(); }
    public static ActivityBuilder activity() { return new ActivityBuilder(); }
    public static AuthBuilder auth() { return new AuthBuilder(); }
} 