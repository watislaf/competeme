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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChallengeResponse } from "@/api/models/challenge-response";
import { useProfiles } from "@/hooks/user/useProfiles";
import { Leaderboard } from "./leaderboard";
import { Fireworks } from "./fireworks";
import { useModifyChallengeMutation } from "../hooks/useModifyChallengeMutation";
import { ModificationPopover } from "./modificationPopover";
import { Input } from "@/components/ui/input";
import { ChallengeModificationRequest } from "@/api/models";

interface ChallengeCardProps {
  challenge: ChallengeResponse;
  onProgressChange: (id: number, value: number) => void;
  onUpdateProgress: (id: number) => void;
  updateError?: { message: string };
  userId: number;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onProgressChange,
  onUpdateProgress,
  updateError,
  userId,
}) => {
  const userProgress = challenge.participants.find(
    (participant) => participant.userId === userId,
  )?.progres;
  const [newProgress, setNewProgress] = useState<number>(userProgress || 0);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [wasCompleted, setWasCompleted] = useState<boolean>(
    challenge.isCompleted,
  );

  const { mutate: modifyChallenge } = useModifyChallengeMutation();

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

  const handleAdd = () => {
    const updatedValue = newProgress + 1;
    setNewProgress(updatedValue);
    onProgressChange(challenge.id, updatedValue);
  };

  const handleSubstract = () => {
    const updatedValue = Math.max(newProgress - 1, 0);
    setNewProgress(updatedValue);
    onProgressChange(challenge.id, updatedValue);
  };

  const handleInputChange = (value: number) => {
    setNewProgress(value);
    onProgressChange(challenge.id, value);
  };

  const userIds = challenge.leaderboard?.map((entry) => entry.userId) || [];
  const { isLoading, profiles } = useProfiles(userIds);

  const cardClass = challenge.isCompleted
    ? "bg-green-100 dark:bg-green-900/30 relative overflow-hidden transition-all duration-300"
    : "relative overflow-hidden";

  const handleModification = (data: ChallengeModificationRequest) => {
    modifyChallenge({
      userId: Number(userId),
      challengeId: challenge.id,
      challengeModificationRequest: data,
    });
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
            <ModificationPopover
              challenge={challenge}
              onSubmit={handleModification}
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
              value={(challenge.totalProgress / (challenge.goal || 1)) * 100}
            />
          </div>
        </CardContent>
        <CardContent>
          <Popover>
            <PopoverTrigger>
              <Button>Update Progress</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col items-start space-y-2">
                <Input
                  type="number"
                  value={newProgress}
                  onChange={(e) => handleInputChange(Number(e.target.value))}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAdd}>Add</Button>
                  <Button onClick={handleSubstract}>Subtract</Button>
                  <Button onClick={() => onUpdateProgress(challenge.id!)}>
                    Update
                  </Button>
                </div>
                {updateError && (
                  <p className="text-red-500 mt-2">
                    Error: {updateError.message}
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
        {challenge.leaderboard && challenge.leaderboard.length > 1 && (
          <CardFooter>
            <Leaderboard
              leaderboard={challenge.leaderboard || []}
              profiles={profiles}
              userId={userId}
              isLoading={isLoading}
              unit={challenge.unit}
            />
          </CardFooter>
        )}
      </Card>

      <Fireworks isActive={showFireworks} />
    </>
  );
};
