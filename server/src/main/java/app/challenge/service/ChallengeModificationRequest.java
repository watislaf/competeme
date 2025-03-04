package app.challenge.service;

import java.util.List;

public record ChallengeModificationRequest(
    String title,
    String description,
    Integer goal,
    String unit,
    List<String> participants) {
}
