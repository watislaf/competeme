package app.user.service;

import app.user.entity.Role;
import app.user.entity.User;
import app.user.entity.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1)
            .email("test@example.com")
            .name("Test User")
            .imageUrl("http://example.com/image.jpg")
            .dateJoined(ZonedDateTime.now())
            .role(Role.USER)
            .build();
    }

    @Test
    void getUserById_ValidId_ReturnsUser() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        User result = userService.getUserById(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test User", result.getName());
        verify(userRepository).findById(1);
    }

    @Test
    void getUserById_UserNotFound_ThrowsUsernameNotFoundException() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class,
            () -> userService.getUserById(1));

        assertEquals("User not found with ID: 1", exception.getMessage());
        verify(userRepository).findById(1);
    }

    @Test
    void getUserById_NullId_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.getUserById(null));

        assertEquals("Invalid user ID: null", exception.getMessage());
        verify(userRepository, never()).findById(any());
    }

    @Test
    void getUserById_NegativeId_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.getUserById(-1));

        assertEquals("Invalid user ID: -1", exception.getMessage());
        verify(userRepository, never()).findById(any());
    }

    @Test
    void getUserById_ZeroId_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.getUserById(0));

        assertEquals("Invalid user ID: 0", exception.getMessage());
        verify(userRepository, never()).findById(any());
    }

    @Test
    void getUserProfile_ValidId_ReturnsUserProfileResponse() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        UserProfileResponse result = userService.getUserProfile(1);

        assertNotNull(result);
        assertEquals(1, result.id());
        assertEquals("Test User", result.name());
        assertEquals("test@example.com", result.email());
        assertEquals("http://example.com/image.jpg", result.imageUrl());
        assertEquals(testUser.getDateJoined(), result.dateJoined());
        assertEquals("USER", result.role());
        verify(userRepository).findById(1);
    }

    @Test
    void searchUsersSorted_ValidKeyword_ReturnsMatchingUsers() {
        User user1 = User.builder()
            .id(1).name("John Doe").imageUrl("http://example.com/john.jpg").build();
        User user2 = User.builder()
            .id(2).name("Jane Doe").imageUrl("http://example.com/jane.jpg").build();

        List<User> users = List.of(user1, user2);
        when(userRepository.findByNameContainingIgnoreCase(eq("doe"), any(Sort.class)))
            .thenReturn(users);

        List<UserSearchResponse> result = userService.searchUsersSorted("doe");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).username());
        assertEquals("Jane Doe", result.get(1).username());
        verify(userRepository).findByNameContainingIgnoreCase(eq("doe"), any(Sort.class));
    }

    @Test
    void searchUsersSorted_NoMatches_ReturnsEmptyList() {
        when(userRepository.findByNameContainingIgnoreCase(eq("xyz"), any(Sort.class)))
            .thenReturn(List.of());

        List<UserSearchResponse> result = userService.searchUsersSorted("xyz");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userRepository).findByNameContainingIgnoreCase(eq("xyz"), any(Sort.class));
    }

    @Test
    void searchUsersSorted_NullKeyword_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.searchUsersSorted(null));

        assertEquals("Search keyword cannot be empty", exception.getMessage());
        verify(userRepository, never()).findByNameContainingIgnoreCase(anyString(), any(Sort.class));
    }

    @Test
    void searchUsersSorted_EmptyKeyword_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.searchUsersSorted(""));

        assertEquals("Search keyword cannot be empty", exception.getMessage());
        verify(userRepository, never()).findByNameContainingIgnoreCase(anyString(), any(Sort.class));
    }

    @Test
    void searchUsersSorted_WhitespaceOnlyKeyword_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.searchUsersSorted("   "));

        assertEquals("Search keyword cannot be empty", exception.getMessage());
        verify(userRepository, never()).findByNameContainingIgnoreCase(anyString(), any(Sort.class));
    }

    @Test
    void searchUsersSorted_SingleCharacterKeyword_DoesNotThrowException() {
        when(userRepository.findByNameContainingIgnoreCase(eq("a"), any(Sort.class)))
            .thenReturn(List.of());

        assertDoesNotThrow(() -> userService.searchUsersSorted("a"));
        verify(userRepository).findByNameContainingIgnoreCase(eq("a"), any(Sort.class));
    }

    @Test
    void updateProfileImage_ValidRequest_UpdatesImage() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.updateProfileImage(1, "http://example.com/new-image.jpg");

        verify(userRepository).findById(1);
        verify(userRepository).save(argThat(user ->
            user.getImageUrl().equals("http://example.com/new-image.jpg")
        ));
    }

    @Test
    void updateProfileImage_NullImageUrl_UpdatesToNull() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.updateProfileImage(1, null);

        verify(userRepository).save(argThat(user -> user.getImageUrl() == null));
    }

    @Test
    void updateProfileImage_TooLongUrl_ThrowsIllegalArgumentException() {
        String longUrl = "http://example.com/" + "a".repeat(1000);
        
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.updateProfileImage(1, longUrl));

        assertEquals("Image URL too long", exception.getMessage());
        verify(userRepository, never()).findById(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateProfileName_ValidRequest_UpdatesName() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.updateProfileName(1, "New Name");

        verify(userRepository).findById(1);
        verify(userRepository).save(argThat(user ->
            user.getName().equals("New Name")
        ));
    }

    @Test
    void updateProfileName_NullName_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.updateProfileName(1, null));

        assertEquals("Profile name cannot be empty", exception.getMessage());
        verify(userRepository, never()).findById(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateProfileName_EmptyName_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.updateProfileName(1, ""));

        assertEquals("Profile name cannot be empty", exception.getMessage());
        verify(userRepository, never()).findById(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateProfileName_WhitespaceOnlyName_ThrowsIllegalArgumentException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.updateProfileName(1, "   "));

        assertEquals("Profile name cannot be empty", exception.getMessage());
        verify(userRepository, never()).findById(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateProfileName_TooLongName_ThrowsIllegalArgumentException() {
        String longName = "a".repeat(101);
        
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> userService.updateProfileName(1, longName));

        assertEquals("Profile name too long", exception.getMessage());
        verify(userRepository, never()).findById(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateProfileImage_UserNotFound_ThrowsUsernameNotFoundException() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
            () -> userService.updateProfileImage(1, "http://example.com/image.jpg"));

        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateProfileName_UserNotFound_ThrowsUsernameNotFoundException() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
            () -> userService.updateProfileName(1, "New Name"));

        verify(userRepository).findById(1);
        verify(userRepository, never()).save(any());
    }

    @Test
    void searchUsersSorted_UsesSortByNameAscending() {
        when(userRepository.findByNameContainingIgnoreCase(eq("test"), any(Sort.class)))
            .thenReturn(List.of());

        userService.searchUsersSorted("test");

        verify(userRepository).findByNameContainingIgnoreCase(eq("test"), 
            argThat(sort -> sort.getOrderFor("name") != null && 
                           sort.getOrderFor("name").getDirection() == Sort.Direction.ASC));
    }

    @Test
    void getUserProfile_BuildsCorrectResponse() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        UserProfileResponse result = userService.getUserProfile(1);

        assertEquals(testUser.getId(), result.id());
        assertEquals(testUser.getName(), result.name());
        assertEquals(testUser.getEmail(), result.email());
        assertEquals(testUser.getImageUrl(), result.imageUrl());
        assertEquals(testUser.getDateJoined(), result.dateJoined());
        assertEquals(testUser.getRole().toString(), result.role());
    }

    @Test
    void searchUsersSorted_BuildsCorrectSearchResponse() {
        User user = User.builder()
            .id(42)
            .name("Test User")
            .imageUrl("http://example.com/test.jpg")
            .build();

        when(userRepository.findByNameContainingIgnoreCase(eq("test"), any(Sort.class)))
            .thenReturn(List.of(user));

        List<UserSearchResponse> result = userService.searchUsersSorted("test");

        assertEquals(1, result.size());
        UserSearchResponse response = result.get(0);
        assertEquals(42, response.id());
        assertEquals("Test User", response.username());
        assertEquals("http://example.com/test.jpg", response.imageUrl());
    }

    @Test
    void updateProfileImage_MaxLengthUrl_DoesNotThrowException() {
        String maxLengthUrl = "http://example.com/" + "a".repeat(979);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> userService.updateProfileImage(1, maxLengthUrl));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateProfileName_MaxLengthName_DoesNotThrowException() {
        String maxLengthName = "a".repeat(100);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> userService.updateProfileName(1, maxLengthName));
        verify(userRepository).save(any(User.class));
    }
} 