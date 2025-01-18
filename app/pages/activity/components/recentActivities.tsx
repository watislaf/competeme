import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useUpdateProgressMutation } from "../hooks/useUpdateProgressMutation";
import { useDeleteActivityMutation } from "../hooks/useDeleteActivityMutation";
import { getIconComponent } from "../utils/iconsHelper";
import { UserActivityResponse } from "@/api/models/user-activity-response";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

interface RecentActivitiesProps {
  activities: UserActivityResponse;
  userId: number;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  userId,
}) => {
  const [progressInputs, setProgressInputs] = useState<Record<number, number>>(
    {},
  );
  const { mutate: updateProgress, error: updateError } =
    useUpdateProgressMutation();
  const { mutate: deleteActivity, error: deleteError } =
    useDeleteActivityMutation();

  const handleProgressChange = (id: number, value: number) => {
    setProgressInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAdd = (activityId: number) => {
    setProgressInputs((prev) => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1,
    }));
  };

  const handleSubtract = (activityId: number) => {
    setProgressInputs((prev) => ({
      ...prev,
      [activityId]: Math.max((prev[activityId] || 0) - 1, 0),
    }));
  };

  const handleLogProgress = (activityId: number) => {
    const progress = progressInputs[activityId];
    if (isNaN(progress)) {
      return;
    }
    updateProgress({ userId, activityId, progress });

    setProgressInputs((prev) => ({
      ...prev,
      [activityId]: 0,
    }));
  };

  const handleDeleteActivity = (activityId: number) => {
    deleteActivity({ userId, activityId });
  };

  return (
    <div>
      <ul className="space-y-4">
        {activities.recent?.map((log) => (
          <li key={log.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getIconComponent(log.type)}
              <span>{log.title}</span>
              <span className="text-muted-foreground">{log.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger>
                  <Button>Log Progress</Button>
                </PopoverTrigger>
                <PopoverContent className="bg-card p-4 rounded-lg shadow-lg max-w-xs mt-4">
                  <div className="flex flex-col items-start space-y-2">
                    <Input
                      type="number"
                      value={progressInputs[log.id] || 0}
                      onChange={(e) =>
                        handleProgressChange(log.id, Number(e.target.value))
                      }
                    />
                    <div className="flex space-x-2">
                      <Button onClick={() => handleAdd(log.id)}>Add</Button>
                      <Button onClick={() => handleSubtract(log.id)}>
                        Subtract
                      </Button>
                      <Button onClick={() => handleLogProgress(log.id)}>
                        Log
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
              <Button
                variant="outline"
                onClick={() => handleDeleteActivity(log.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
              {deleteError && (
                <p className="text-red-500">
                  Error deleting activity: {deleteError.message}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
