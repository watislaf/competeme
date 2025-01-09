import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { useUpdateProgressMutation } from "../hooks/useUpdateProgressMutation";
import { useDeleteActivityMutation } from "../hooks/useDeleteActivityMutation";
import { getIconComponent } from "../utils/iconsHelper";
import { UserActivityResponse } from "@/api/models/user-activity-response";
import React from "react";

interface RecentActivitiesProps {
  activities: UserActivityResponse;
  userId: number;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  userId,
}) => {
  const [progressInputs, setProgressInputs] = useState<Record<string, string>>(
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

  const handleLogProgress = (activityId: number) => {
    const progress = Number(progressInputs[activityId]);
    if (!progress || isNaN(progress)) {
      alert("Please enter a valid number for progress.");
      return;
    }
    updateProgress({
      userId,
      activityId,
      progress,
    });

    setProgressInputs((prev) => ({
      ...prev,
      [activityId]: "",
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
              <Input
                id="duration"
                name="duration"
                value={progressInputs[log.id] || ""}
                onChange={(e) =>
                  handleProgressChange(log.id, Number(e.target.value))
                }
                placeholder="Enter progress"
                required
              />
              <Button
                onClick={() => handleLogProgress(log.id)}
                className="w-auto"
              >
                Log
              </Button>
              {updateError && (
                <p className="text-red-500">
                  Error updating progress: {updateError.message}
                </p>
              )}
              <Form>
                <input type="hidden" name="logId" value={log.id} />
                <Button
                  type="submit"
                  name="_action"
                  value="deleteLog"
                  onClick={() => handleDeleteActivity(log.id)}
                  variant="ghost"
                  size="sm"
                  className="sm:ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                {deleteError && (
                  <p className="text-red-500">
                    Error deleting activity: {deleteError.message}
                  </p>
                )}
              </Form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
