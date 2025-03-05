import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChallengeResponse } from "@/api/models/challenge-response";
import { useProfiles } from "@/hooks/user/useProfiles";
import { Leaderboard } from "./leaderboard";
import { Fireworks } from "./fireworks";
import { ChallengeModificationPopover } from "./challengeModificationPopover";
import { ProgressUpdatePopover } from "./progressUpdatePopover";
import { useUserAccess } from "@/hooks/user/useUserAccess";

interface ChallengeCardProps {
  challenge: ChallengeResponse;
  userId: number;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  userId,
}) => {
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [wasCompleted, setWasCompleted] = useState<boolean>(
    challenge.isCompleted,
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const { canModifyChallenges } = useUserAccess(userId);

  useEffect(() => {
    if (!wasCompleted && challenge.isCompleted) {
      setShowFireworks(true);
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    setWasCompleted(challenge.isCompleted);
  }, [challenge.isCompleted, wasCompleted]);

  const userIds = challenge.leaderboard?.map((entry) => entry.userId) || [];
  const { isLoading, profiles } = useProfiles(userIds);

  const cardClass = challenge.isCompleted
    ? "bg-lime-500/10 relative overflow-hidden transition-all duration-300"
    : "relative overflow-hidden";

  return (
    <Card className={cardClass} ref={cardRef}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{challenge.title || "No title available"}</CardTitle>
            <CardDescription>
              {challenge.description || "No description available"}
            </CardDescription>
          </div>
          {canModifyChallenges && (
            <ChallengeModificationPopover
              userId={userId}
              challenge={challenge}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-right">{`${challenge.totalProgress} / ${challenge.goal} ${challenge.unit}`}</p>
        <Progress
          value={Math.min(
            (challenge.totalProgress / (challenge.goal || 1)) * 100,
            100,
          )}
        />
      </CardContent>
      <CardContent>
        {canModifyChallenges && (
          <ProgressUpdatePopover userId={userId} challenge={challenge} />
        )}
      </CardContent>
      {challenge.leaderboard && challenge.leaderboard.length > 1 && (
        <CardFooter>
          <Leaderboard
            leaderboard={challenge.leaderboard}
            profiles={profiles}
            isLoading={isLoading}
            userId={userId}
          />
        </CardFooter>
      )}
      <Fireworks isActive={showFireworks} containerRef={cardRef} />
    </Card>
  );
};
