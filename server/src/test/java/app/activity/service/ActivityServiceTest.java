package app.activity.service;

import app.activity.entity.Activity;
import app.activity.entity.ActivityRepository;
import app.activity.entity.Type;
import app.stats.service.TimeFormatter;
import app.user.entity.Role;
import app.user.entity.User;
import app.user.entity.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.Clock;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private TimeFormatter timeFormatter;
    
    @Mock
    private Clock clock;
    
    @InjectMocks
    private ActivityService activityService;

    private User testUser;
    private Activity testActivity;
    private ActivityRequest activityRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1)
            .email("test@example.com")
            .name("testuser")
            .role(Role.USER)
            .build();

        testActivity = Activity.builder()
            .id(1L)
            .title("Running")
            .type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(30))
            .date(ZonedDateTime.now())
            .user(testUser)
            .build();

        activityRequest = new ActivityRequest("Running", Type.DUMBBELL, 30L);
        
        // Mock clock to return a fixed time (lenient for tests that don't use it)
        lenient().when(clock.getZone()).thenReturn(ZoneId.systemDefault());
        lenient().when(clock.instant()).thenReturn(Instant.parse("2023-01-01T00:00:00Z"));
    }

    @Test
    void addActivity_ValidRequest_SavesActivity() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        activityService.addActivity(1, activityRequest);

        verify(userRepository).findById(1);
        verify(activityRepository).save(argThat(activity ->
            activity.getTitle().equals("Running") &&
            activity.getType().equals(Type.DUMBBELL) &&
            activity.getDuration().equals(Duration.ofMinutes(30)) &&
            activity.getUser().equals(testUser) &&
            activity.getDate().equals(ZonedDateTime.now(clock))
        ));
    }

    @Test
    void addActivity_UserNotFound_ThrowsException() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> activityService.addActivity(1, activityRequest));

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findById(1);
        verify(activityRepository, never()).save(any(Activity.class));
    }

    @Test
    void addProgress_ValidRequest_UpdatesActivityDuration() {
        Activity existingActivity = Activity.builder()
            .id(1L)
            .title("Running")
            .type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(30))
            .date(ZonedDateTime.now().minusHours(1))
            .user(testUser)
            .build();

        when(activityRepository.findById(1L)).thenReturn(Optional.of(existingActivity));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("50 minutes");

        activityService.addProgress(1L, 20L, 1);

        verify(activityRepository).findById(1L);
        verify(activityRepository).save(argThat(activity ->
            activity.getDuration().equals(Duration.ofMinutes(50)) &&
            activity.getDate().equals(ZonedDateTime.now(clock))
        ));
        verify(timeFormatter).formatDuration(Duration.ofMinutes(50));
    }

    @Test
    void addProgress_ActivityNotFound_ThrowsException() {
        when(activityRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> activityService.addProgress(1L, 20L, 1));

        assertEquals("Activity not found", exception.getMessage());
        verify(activityRepository).findById(1L);
        verify(activityRepository, never()).save(any(Activity.class));
    }

    @Test
    void deleteActivity_ValidRequest_DeletesActivity() {
        when(activityRepository.findById(1L)).thenReturn(Optional.of(testActivity));

        activityService.deleteActivity(1L, 1);

        verify(activityRepository).findById(1L);
        verify(activityRepository).delete(testActivity);
    }

    @Test
    void deleteActivity_ActivityNotFound_ThrowsException() {
        when(activityRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> activityService.deleteActivity(1L, 1));

        assertEquals("Activity not found", exception.getMessage());
        verify(activityRepository).findById(1L);
        verify(activityRepository, never()).delete(any(Activity.class));
    }

    @Test
    void getActivities_ValidUserId_ReturnsUserActivityResponse() {
        Activity activity1 = Activity.builder()
            .id(1L)
            .title("Running")
            .type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(30))
            .date(ZonedDateTime.now())
            .user(testUser)
            .build();

        Activity activity2 = Activity.builder()
            .id(2L)
            .title("Reading")
            .type(Type.BOOK)
            .duration(Duration.ofMinutes(45))
            .date(ZonedDateTime.now().minusHours(1))
            .user(testUser)
            .build();

        Activity activity3 = Activity.builder()
            .id(3L)
            .title("Running")
            .type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(20))
            .date(ZonedDateTime.now().minusHours(2))
            .user(testUser)
            .build();

        List<Activity> activities = List.of(activity1, activity2, activity3);
        when(activityRepository.findByUserId(1)).thenReturn(activities);
        when(timeFormatter.formatDuration(Duration.ofMinutes(30))).thenReturn("30 minutes");
        when(timeFormatter.formatDuration(Duration.ofMinutes(45))).thenReturn("45 minutes");
        when(timeFormatter.formatDuration(Duration.ofMinutes(20))).thenReturn("20 minutes");

        UserActivityResponse response = activityService.getActivities(1);

        assertNotNull(response);
        assertEquals(2, response.available().size());
        assertEquals(3, response.recent().size());

        assertEquals("Reading", response.available().get(0).title());
        assertEquals("Running", response.available().get(1).title());

        assertEquals(1L, response.recent().get(0).id());
        assertEquals(2L, response.recent().get(1).id());
        assertEquals(3L, response.recent().get(2).id());

        verify(activityRepository).findByUserId(1);
    }

    @Test
    void getActivities_EmptyList_ReturnsEmptyResponse() {
        when(activityRepository.findByUserId(1)).thenReturn(List.of());

        UserActivityResponse response = activityService.getActivities(1);

        assertNotNull(response);
        assertTrue(response.available().isEmpty());
        assertTrue(response.recent().isEmpty());
        verify(activityRepository).findByUserId(1);
    }

    @Test
    void getRandomActivity_ValidRequest_ReturnsActivityName() {
        Integer userId = 1;
        
        String result = activityService.getRandomActivity(userId);

        assertNotNull(result);
    }

    @Test
    void addActivity_CreatesActivityWithCorrectTimestamp() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        activityService.addActivity(1, activityRequest);

        verify(activityRepository).save(argThat(activity ->
            activity.getDate().equals(ZonedDateTime.now(clock))
        ));
    }

    @Test
    void addProgress_UpdatesTimestamp() {
        Activity existingActivity = Activity.builder()
            .id(1L)
            .title("Running")
            .type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(30))
            .date(ZonedDateTime.now().minusHours(1))
            .user(testUser)
            .build();

        when(activityRepository.findById(1L)).thenReturn(Optional.of(existingActivity));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("50 minutes");

        activityService.addProgress(1L, 20L, 1);

        verify(activityRepository).save(argThat(activity ->
            activity.getDate().equals(ZonedDateTime.now(clock))
        ));
    }

    @Test
    void getActivities_SortsAvailableActivitiesByTitle() {
        Activity activity1 = Activity.builder()
            .id(1L).title("Zetetic").type(Type.BOOK).duration(Duration.ofMinutes(30))
            .date(ZonedDateTime.now()).user(testUser).build();

        Activity activity2 = Activity.builder()
            .id(2L).title("Alpha").type(Type.DUMBBELL).duration(Duration.ofMinutes(45))
            .date(ZonedDateTime.now()).user(testUser).build();

        Activity activity3 = Activity.builder()
            .id(3L).title("Beta").type(Type.MUSIC).duration(Duration.ofMinutes(20))
            .date(ZonedDateTime.now()).user(testUser).build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(activity1, activity2, activity3));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");

        UserActivityResponse response = activityService.getActivities(1);

        assertEquals("Alpha", response.available().get(0).title());
        assertEquals("Beta", response.available().get(1).title());
        assertEquals("Zetetic", response.available().get(2).title());
    }

    @Test
    void getActivities_SortsRecentActivitiesByDateDescending() {
        ZonedDateTime now = ZonedDateTime.now();
        
        Activity activity1 = Activity.builder()
            .id(1L).title("Old").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
            .date(now.minusHours(3)).user(testUser).build();

        Activity activity2 = Activity.builder()
            .id(2L).title("Newest").type(Type.BOOK).duration(Duration.ofMinutes(45))
            .date(now).user(testUser).build();

        Activity activity3 = Activity.builder()
            .id(3L).title("Middle").type(Type.MUSIC).duration(Duration.ofMinutes(20))
            .date(now.minusHours(1)).user(testUser).build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(activity1, activity2, activity3));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");

        UserActivityResponse response = activityService.getActivities(1);

        assertEquals("Newest", response.recent().get(0).title());
        assertEquals("Middle", response.recent().get(1).title());
        assertEquals("Old", response.recent().get(2).title());
    }

    @Test
    void getActivities_DeduplicatesAvailableActivities() {
        Activity activity1 = Activity.builder()
            .id(1L).title("Running").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
            .date(ZonedDateTime.now()).user(testUser).build();

        Activity activity2 = Activity.builder()
            .id(2L).title("Running").type(Type.DUMBBELL).duration(Duration.ofMinutes(45))
            .date(ZonedDateTime.now().minusHours(1)).user(testUser).build();

        Activity activity3 = Activity.builder()
            .id(3L).title("Swimming").type(Type.DUMBBELL).duration(Duration.ofMinutes(20))
            .date(ZonedDateTime.now().minusHours(2)).user(testUser).build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(activity1, activity2, activity3));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");

        UserActivityResponse response = activityService.getActivities(1);

        assertEquals(2, response.available().size());
        assertEquals(3, response.recent().size());
        
        assertTrue(response.available().stream().anyMatch(a -> a.title().equals("Running")));
        assertTrue(response.available().stream().anyMatch(a -> a.title().equals("Swimming")));
    }

    @Test
    void addProgress_ZeroProgress_UpdatesOnlyTimestamp() {
        Activity existingActivity = Activity.builder()
            .id(1L)
            .title("Running")
            .type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(30))
            .date(ZonedDateTime.now().minusHours(1))
            .user(testUser)
            .build();

        when(activityRepository.findById(1L)).thenReturn(Optional.of(existingActivity));
        when(timeFormatter.formatDuration(Duration.ofMinutes(30))).thenReturn("30 minutes");

        activityService.addProgress(1L, 0L, 1);

        verify(activityRepository).save(argThat(activity ->
            activity.getDuration().equals(Duration.ofMinutes(30)) &&
            activity.getDate().equals(ZonedDateTime.now(clock))
        ));
    }
} 