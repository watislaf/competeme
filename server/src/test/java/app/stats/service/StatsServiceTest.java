package app.stats.service;

import app.activity.entity.Activity;
import app.activity.entity.ActivityRepository;
import app.activity.entity.Type;
import app.user.entity.Role;
import app.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private ActivityRepository activityRepository;
    
    @Mock
    private TimeFormatter timeFormatter;
    
    @InjectMocks
    private StatsService statsService;

    private User testUser;
    private List<Activity> testActivities;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1)
            .email("test@example.com")
            .name("Test User")
            .role(Role.USER)
            .build();

        LocalDate today = LocalDate.now();
        ZonedDateTime todayTime = today.atStartOfDay().atZone(java.time.ZoneId.systemDefault());
        ZonedDateTime yesterdayTime = today.minusDays(1).atStartOfDay().atZone(java.time.ZoneId.systemDefault());
        ZonedDateTime lastWeekTime = today.minusWeeks(1).atStartOfDay().atZone(java.time.ZoneId.systemDefault());

        testActivities = List.of(
            Activity.builder()
                .id(1L).title("Running").type(Type.DUMBBELL)
                .duration(Duration.ofMinutes(30)).date(todayTime).user(testUser)
                .build(),
            Activity.builder()
                .id(2L).title("Reading").type(Type.BOOK)
                .duration(Duration.ofMinutes(45)).date(yesterdayTime).user(testUser)
                .build(),
            Activity.builder()
                .id(3L).title("Running").type(Type.DUMBBELL)
                .duration(Duration.ofMinutes(20)).date(lastWeekTime).user(testUser)
                .build()
        );
    }

    @Test
    void getStats_ValidUserId_ReturnsCompleteStatsResponse() {
        when(activityRepository.findByUserId(1)).thenReturn(testActivities);
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("30 minutes");
        when(timeFormatter.formatPeriod(any())).thenReturn("1 day");
        when(timeFormatter.formatDayOfWeek(any(DayOfWeek.class))).thenReturn("Monday");
        when(timeFormatter.formatToHours(any(Duration.class))).thenReturn(0.5);

        StatsResponse result = statsService.getStats(1);

        assertNotNull(result);
        assertNotNull(result.totalTimeThisWeek());
        assertNotNull(result.currentStreak());
        assertNotNull(result.longestStreak());
        assertNotNull(result.timeLoggedToday());
        assertNotNull(result.totalTimeLogged());
        assertNotNull(result.activityBreakdown());
        assertNotNull(result.weeklyStats());
        assertNotNull(result.monthlyStats());
        assertNotNull(result.totalTimeLastWeek());
        
        verify(activityRepository).findByUserId(1);
    }

    @Test
    void getStats_EmptyActivities_ReturnsStatsWithNullValues() {
        when(activityRepository.findByUserId(1)).thenReturn(List.of());
        when(timeFormatter.formatDuration(Duration.ZERO)).thenReturn("0 minutes");
        when(timeFormatter.formatPeriod(any())).thenReturn("0 days");
        when(timeFormatter.formatToHours(Duration.ZERO)).thenReturn(0.0);

        StatsResponse result = statsService.getStats(1);

        assertNotNull(result);
        assertEquals("0 minutes", result.totalTimeThisWeek());
        assertEquals("0 minutes", result.timeLoggedToday());
        assertEquals("0 minutes", result.totalTimeLogged());
        assertEquals("0 minutes", result.totalTimeLastWeek());
        assertNull(result.mostActiveDay());
        assertNull(result.mostFrequentActivity());
        assertNull(result.topActivity());
        assertTrue(result.activityBreakdown().isEmpty());
        
        verify(activityRepository).findByUserId(1);
    }

    @Test
    void getStats_WithTodayActivities_CalculatesCorrectTodayTime() {
        LocalDate today = LocalDate.now();
        ZonedDateTime todayTime = today.atStartOfDay().atZone(java.time.ZoneId.systemDefault());
        
        Activity todayActivity = Activity.builder()
            .id(1L).title("Today Activity").type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(60)).date(todayTime).user(testUser)
            .build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(todayActivity));
        when(timeFormatter.formatDuration(Duration.ofMinutes(60))).thenReturn("1 hour");
        when(timeFormatter.formatDuration(Duration.ZERO)).thenReturn("0 minutes");
        when(timeFormatter.formatPeriod(any())).thenReturn("1 day");
        when(timeFormatter.formatToHours(any(Duration.class))).thenReturn(1.0);
        when(timeFormatter.formatDayOfWeek(any(DayOfWeek.class))).thenReturn("Today");

        StatsResponse result = statsService.getStats(1);

        assertEquals("1 hour", result.timeLoggedToday());
        assertEquals("1 hour", result.totalTimeLogged());
    }

    @Test
    void getStats_WithMultipleActivitiesSameTitle_GroupsCorrectly() {
        Activity running1 = Activity.builder()
            .id(1L).title("Running").type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(30)).date(ZonedDateTime.now()).user(testUser)
            .build();
        
        Activity running2 = Activity.builder()
            .id(2L).title("Running").type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(45)).date(ZonedDateTime.now().minusDays(1)).user(testUser)
            .build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(running1, running2));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("75 minutes");
        when(timeFormatter.formatPeriod(any())).thenReturn("2 days");
        when(timeFormatter.formatToHours(Duration.ofMinutes(75))).thenReturn(1.25);
        when(timeFormatter.formatDayOfWeek(any(DayOfWeek.class))).thenReturn("Today");

        StatsResponse result = statsService.getStats(1);

        assertNotNull(result.topActivity());
        assertNotNull(result.mostFrequentActivity());
        assertEquals(1, result.activityBreakdown().size());
        assertEquals("Running", result.activityBreakdown().get(0).activityName());
    }

    @Test
    void getStats_WithWeeklyActivities_CalculatesWeeklyStats() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDate tuesday = monday.plusDays(1);
        
        Activity mondayActivity = Activity.builder()
            .id(1L).title("Monday Activity").type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(60))
            .date(monday.atStartOfDay().atZone(java.time.ZoneId.systemDefault()))
            .user(testUser).build();
            
        Activity tuesdayActivity = Activity.builder()
            .id(2L).title("Tuesday Activity").type(Type.BOOK)
            .duration(Duration.ofMinutes(90))
            .date(tuesday.atStartOfDay().atZone(java.time.ZoneId.systemDefault()))
            .user(testUser).build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(mondayActivity, tuesdayActivity));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");
        when(timeFormatter.formatPeriod(any())).thenReturn("test period");
        when(timeFormatter.formatDayOfWeek(DayOfWeek.MONDAY)).thenReturn("Monday");
        when(timeFormatter.formatDayOfWeek(DayOfWeek.TUESDAY)).thenReturn("Tuesday");
        when(timeFormatter.formatDayOfWeek(DayOfWeek.WEDNESDAY)).thenReturn("Wednesday");
        when(timeFormatter.formatDayOfWeek(DayOfWeek.THURSDAY)).thenReturn("Thursday");
        when(timeFormatter.formatDayOfWeek(DayOfWeek.FRIDAY)).thenReturn("Friday");
        when(timeFormatter.formatDayOfWeek(DayOfWeek.SATURDAY)).thenReturn("Saturday");
        when(timeFormatter.formatDayOfWeek(DayOfWeek.SUNDAY)).thenReturn("Sunday");
        when(timeFormatter.formatToHours(Duration.ofMinutes(60))).thenReturn(1.0);
        when(timeFormatter.formatToHours(Duration.ofMinutes(90))).thenReturn(1.5);
        when(timeFormatter.formatToHours(Duration.ZERO)).thenReturn(0.0);

        StatsResponse result = statsService.getStats(1);

        assertNotNull(result.weeklyStats());
        assertEquals(7, result.weeklyStats().size());
        
        WeeklyStat mondayStat = result.weeklyStats().stream()
            .filter(stat -> "Monday".equals(stat.dayOfWeek()))
            .findFirst().orElse(null);
        assertNotNull(mondayStat);
        assertEquals(1.0, mondayStat.duration());
    }

    @Test
    void getStats_WithConsecutiveDays_CalculatesCurrentStreak() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate dayBefore = today.minusDays(2);
        
        List<Activity> consecutiveActivities = List.of(
            Activity.builder()
                .id(1L).title("Activity").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(today.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build(),
            Activity.builder()
                .id(2L).title("Activity").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(yesterday.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build(),
            Activity.builder()
                .id(3L).title("Activity").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(dayBefore.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build()
        );

        when(activityRepository.findByUserId(1)).thenReturn(consecutiveActivities);
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");
        when(timeFormatter.formatPeriod(any())).thenReturn("3 days");
        when(timeFormatter.formatToHours(any(Duration.class))).thenReturn(0.5);
        when(timeFormatter.formatDayOfWeek(any(DayOfWeek.class))).thenReturn("test day");

        StatsResponse result = statsService.getStats(1);

        assertEquals("3 days", result.currentStreak());
    }

    @Test
    void getStats_WithMostActiveDay_IdentifiesCorrectDay() {
        DayOfWeek testDay = DayOfWeek.MONDAY;
        LocalDate mondayDate = LocalDate.now().with(testDay);
        
        Activity heavyActivity = Activity.builder()
            .id(1L).title("Heavy Activity").type(Type.DUMBBELL)
            .duration(Duration.ofMinutes(120))
            .date(mondayDate.atStartOfDay().atZone(java.time.ZoneId.systemDefault()))
            .user(testUser).build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(heavyActivity));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");
        when(timeFormatter.formatPeriod(any())).thenReturn("test period");
        when(timeFormatter.formatDayOfWeek(testDay)).thenReturn("Monday");
        when(timeFormatter.formatToHours(any(Duration.class))).thenReturn(2.0);

        StatsResponse result = statsService.getStats(1);

        assertNotNull(result.mostActiveDay());
        assertEquals("Monday", result.mostActiveDay().dayOfWeek());
    }

    @Test
    void getStats_VerifiesTimeFormatterCalls() {
        when(activityRepository.findByUserId(1)).thenReturn(testActivities);
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("formatted duration");
        when(timeFormatter.formatPeriod(any())).thenReturn("formatted period");
        when(timeFormatter.formatToHours(any(Duration.class))).thenReturn(1.0);
        when(timeFormatter.formatDayOfWeek(any(DayOfWeek.class))).thenReturn("formatted day");

        statsService.getStats(1);

        verify(timeFormatter, atLeastOnce()).formatDuration(any(Duration.class));
        verify(timeFormatter, atLeastOnce()).formatPeriod(any());
        verify(timeFormatter, atLeastOnce()).formatToHours(any(Duration.class));
        verify(timeFormatter, atLeastOnce()).formatDayOfWeek(any(DayOfWeek.class));
    }

    @Test
    void getStats_WithBreakInStreak_CalculatesLongestStreak() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate weekAgo = today.minusDays(7);
        LocalDate weekAgoPlus1 = today.minusDays(6);
        LocalDate weekAgoPlus2 = today.minusDays(5);
        
        List<Activity> streakActivities = List.of(
            Activity.builder()
                .id(1L).title("Recent1").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(today.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build(),
            Activity.builder()
                .id(2L).title("Recent2").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(yesterday.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build(),
            Activity.builder()
                .id(3L).title("Old1").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(weekAgo.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build(),
            Activity.builder()
                .id(4L).title("Old2").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(weekAgoPlus1.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build(),
            Activity.builder()
                .id(5L).title("Old3").type(Type.DUMBBELL).duration(Duration.ofMinutes(30))
                .date(weekAgoPlus2.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build()
        );

        when(activityRepository.findByUserId(1)).thenReturn(streakActivities);
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");
        when(timeFormatter.formatPeriod(any())).thenReturn("3 days");
        when(timeFormatter.formatToHours(any(Duration.class))).thenReturn(0.5);
        when(timeFormatter.formatDayOfWeek(any(DayOfWeek.class))).thenReturn("test day");

        StatsResponse result = statsService.getStats(1);

        assertEquals("3 days", result.longestStreak());
    }

    @Test
    void getStats_WithActivitiesInDifferentWeeks_CalculatesLastWeekCorrectly() {
        LocalDate thisWeek = LocalDate.now();
        LocalDate lastWeek = thisWeek.minusWeeks(1).with(DayOfWeek.MONDAY);
        
        Activity thisWeekActivity = Activity.builder()
            .id(1L).title("This Week").type(Type.DUMBBELL).duration(Duration.ofMinutes(60))
            .date(thisWeek.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build();
            
        Activity lastWeekActivity = Activity.builder()
            .id(2L).title("Last Week").type(Type.DUMBBELL).duration(Duration.ofMinutes(90))
            .date(lastWeek.atStartOfDay().atZone(java.time.ZoneId.systemDefault())).user(testUser).build();

        when(activityRepository.findByUserId(1)).thenReturn(List.of(thisWeekActivity, lastWeekActivity));
        when(timeFormatter.formatDuration(any(Duration.class))).thenReturn("test duration");
        when(timeFormatter.formatDuration(Duration.ofMinutes(90))).thenReturn("90 minutes");
        when(timeFormatter.formatPeriod(any())).thenReturn("test period");
        when(timeFormatter.formatToHours(any(Duration.class))).thenReturn(1.0);
        when(timeFormatter.formatDayOfWeek(any(DayOfWeek.class))).thenReturn("test day");

        StatsResponse result = statsService.getStats(1);

        assertEquals("90 minutes", result.totalTimeLastWeek());
    }
} 