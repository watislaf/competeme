package app.challenge;

import java.util.List;

public record ChallengeRequest(
    String title,
    String description,
    Integer goal,
    String unit,
    List<Integer> participants) {
}