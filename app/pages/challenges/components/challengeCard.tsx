import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChallengeResponse } from "@/api/models/challenge-response";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{challenge.title || "No title available"}</CardTitle>
        <CardDescription>
          {challenge.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Progress</span>
            <span>
              {challenge.totalProgress} / {challenge.goal || 0}
              {challenge.unit || ""}
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
      <CardFooter>
        <div className="w-full">
          <h4 className="font-semibold mb-2">Leaderboard</h4>
          <ul className="space-y-1">
            {challenge.leaderboard?.map((entry, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{entry.name || "Unknown"}</span>
                <span>
                  {entry.score || 0} {challenge.unit || ""}
                </span>
              </li>
            )) || <p>No leaderboard data available</p>}
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
};
