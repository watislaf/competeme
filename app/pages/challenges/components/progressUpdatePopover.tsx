import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChallengeResponse } from "@/api/models";
import { useUpdateProgressMutation } from "../hooks/useUpdateProgressMutation";

interface ProgressUpdatePopoverProps {
  userId: number;
  challenge: ChallengeResponse;
}

export const ProgressUpdatePopover: React.FC<ProgressUpdatePopoverProps> = ({
  userId,
  challenge,
}) => {
  const userProgress = challenge.participants.find(
    (participant) => participant.userId === userId,
  )?.progres;

  const [newProgress, setNewProgress] = useState<number>(userProgress || 0);

  const { mutate: updateProgress, error: updateError } =
    useUpdateProgressMutation();

  const [progressValues, setProgressValues] = useState<Record<number, number>>(
    {},
  );

  const handleProgressChange = (id: number, value: number) => {
    setProgressValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateProgress = (challengeId: number) => {
    if (progressValues[challengeId] !== undefined) {
      updateProgress({
        userId: Number(userId),
        challengeId,
        progress: progressValues[challengeId],
      });
    }
  };

  const handleAdd = () => {
    const updatedValue = newProgress + 1;
    setNewProgress(updatedValue);
    handleProgressChange(challenge.id, updatedValue);
  };

  const handleSubstract = () => {
    const updatedValue = Math.max(newProgress - 1, 0);
    setNewProgress(updatedValue);
    handleProgressChange(challenge.id, updatedValue);
  };

  const handleInputChange = (value: number) => {
    setNewProgress(value);
    handleProgressChange(challenge.id, value);
  };

  const handleClick = () => {
    handleUpdateProgress(challenge.id);
  };

  return (
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
            <Button onClick={handleClick}>Update</Button>
          </div>
          {updateError && (
            <p className="text-red-500 mt-2">Error: {updateError.message}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
