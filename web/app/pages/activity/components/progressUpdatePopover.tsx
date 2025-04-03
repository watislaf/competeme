import React from "react";
import { Button } from "web/app/components/ui/button";
import { Input } from "web/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useUpdateProgressMutation } from "../hooks/useUpdateProgressMutation";
import { useState } from "react";

interface progressPopoverProps {
  userId: number;
  activityId: number;
}

const ProgressUpdatePopover: React.FC<progressPopoverProps> = ({
  userId,
  activityId,
}) => {
  const { mutate: updateProgress, error: updateError } =
    useUpdateProgressMutation();

  const [progress, setProgress] = useState<number>(0);

  const handleProgressChange = (value: number) => {
    setProgress(value);
  };

  const handleAdd = () => {
    setProgress((prevProgress) => prevProgress + 1);
  };

  const handleSubtract = () => {
    setProgress((prevProgress) => Math.max(prevProgress - 1, 0));
  };

  const handleLogProgress = (activityId: number) => {
    if (isNaN(progress)) {
      return;
    }
    updateProgress({ userId, activityId, progress });

    setProgress(0);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button>Log Progress</Button>
        </PopoverTrigger>
        <PopoverContent className="bg-card p-4 rounded-lg shadow-lg max-w-xs mt-4">
          <div className="flex flex-col items-start space-y-2">
            <Input
              type="number"
              value={progress}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
            />
            <div className="flex space-x-2">
              <Button onClick={handleAdd}>Add</Button>
              <Button onClick={handleSubtract}>Subtract</Button>
              <Button onClick={() => handleLogProgress(activityId)}>Log</Button>
            </div>
            {updateError && (
              <p className="text-red-500 mt-2">Error: {updateError.message}</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ProgressUpdatePopover;
