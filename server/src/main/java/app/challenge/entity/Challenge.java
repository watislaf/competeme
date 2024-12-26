package app.challenge.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "challenges")
public class Challenge {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private String description;
    private Integer goal;
    private String unit;
    private ZonedDateTime createdAt;
}
