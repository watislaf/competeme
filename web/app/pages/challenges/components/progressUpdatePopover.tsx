import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ProgressEditor } from "./progressEditor";
import { ChallengeResponse } from "@/api";

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Update Progress</Button>
      </PopoverTrigger>
      <PopoverContent>
        <ProgressEditor
          initialValue={Number(userProgress)}
          maxValue={challenge.goal}
          userId={userId}
          challengeId={challenge.id}
        />
      </PopoverContent>
    </Popover>
  );
};
