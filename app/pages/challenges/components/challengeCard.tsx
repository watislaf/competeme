import React, { useState, useEffect } from "react";
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
import { useDeleteChallengeMutation } from "../hooks/useDeleteChallengeMutation";

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

  const { mutate: deleteChallenge, error: deleteError } =
    useDeleteChallengeMutation();

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

  const handleDelete = () => {
    deleteChallenge({ userId, challengeId: challenge.id });
  };

  return (
    <>
      <Card className={cardClass}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{challenge.title || "No title available"}</CardTitle>
              <CardDescription>
                {challenge.description || "No description available"}
              </CardDescription>
            </div>
            <ChallengeModificationPopover
              userId={userId}
              challenge={challenge}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Progress</span>
              <span>
                {challenge.totalProgress} / {challenge.goal || 0}
                {challenge.unit ? ` ${challenge.unit}` : ""}
              </span>
            </div>
            <Progress
              value={Math.min(
                (challenge.totalProgress / (challenge.goal || 1)) * 100,
                100,
              )}
            />
          </div>
        </CardContent>
        <CardContent>
          <ProgressUpdatePopover userId={userId} challenge={challenge} />
          <button
            onClick={handleDelete}
            className="border-2 border-red-500 text-red-500 ml-4 px-4 py-1 rounded-lg transition-all duration-200 hover:bg-red-500 hover:text-white"
          >
            Delete Challenge
          </button>
          {deleteError && (
            <p className="text-red-500">
              Error deleting challenge: {deleteError.message}
            </p>
          )}
        </CardContent>
        {challenge.leaderboard && challenge.leaderboard.length > 1 && (
          <CardFooter>
            <Leaderboard
              leaderboard={challenge.leaderboard || []}
              profiles={profiles}
              userId={userId}
              isLoading={isLoading}
            />
          </CardFooter>
        )}
      </Card>

      <Fireworks isActive={showFireworks} />
    </>
  );
};
