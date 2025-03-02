package app.challenge.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChallengeParticipantsRepository extends JpaRepository<ChallengeParticipants, Long> {

    List<ChallengeParticipants> findByUserId(Integer user_id);

    Optional<ChallengeParticipants> findByUserIdAndChallengeId(Integer userId, Long challengeId);

    List<ChallengeParticipants> findByChallengeId(Long id);

    boolean existsByUserIdAndChallengeId(Integer userId, Long challengeId);
}
