package app.activity.entity;

import app.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    @Enumerated(EnumType.STRING)
    private Type type;
    private Duration duration;
    private ZonedDateTime date;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
