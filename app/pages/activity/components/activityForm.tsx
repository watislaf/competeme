import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ActivityRequestTypeEnum } from "@/api/models/activity-request";
import { UserActivityResponse } from "@/api/models/user-activity-response";
import { useAddActivityMutation } from "../hooks/useAddActivityMutation";
import EmoticonPicker from "./emoticonPicker";
import { getIconComponent } from "../utils/iconsHelper";
import React from "react";

interface ActivityFormProps {
  activities?: UserActivityResponse;
  userId: number;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activities, userId }) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [customActivityName, setCustomActivityName] = useState("");
  const [customActivityType, setCustomActivityType] =
    useState<ActivityRequestTypeEnum>("CLOCK");
  const [duration, setDuration] = useState<number | null>(null);

  const { mutate: addActivity, error: addError } = useAddActivityMutation();

  const handleSelectChange = (value: string) => {
    setSelectedActivity(value);
    if (value !== "custom") {
      setCustomActivityName("");
    }
  };

  const handleLogActivity = () => {
    if (selectedActivity === "custom" && customActivityName && duration) {
      addActivity({
        userId,
        activityRequest: {
          title: customActivityName,
          type: customActivityType,
          duration,
        },
      });

      setSelectedActivity("custom");
      setCustomActivityName("");
      setDuration(null);
    } else if (selectedActivity && duration) {
      const selectedActivityData = activities?.available.find(
        (activity) => activity.title === selectedActivity,
      );

      if (selectedActivityData) {
        addActivity({
          userId,
          activityRequest: {
            title: selectedActivityData.title,
            type: selectedActivityData.type,
            duration,
          },
        });
      }

      setSelectedActivity("custom");
      setDuration(null);
    }
  };

  const handleIconSelect = (activityType: ActivityRequestTypeEnum) => {
    setCustomActivityType(activityType);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="activity">Activity</Label>
        <Select name="activity" required onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an activity" />
          </SelectTrigger>
          <SelectContent>
            {activities?.available?.map((activity) => (
              <SelectItem key={activity.id} value={activity.title}>
                <div className="flex items-center">
                  {getIconComponent(activity.type)}
                  <span className="ml-2">{activity.title}</span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value="custom">
              <div className="flex items-center">
                <Plus className="h-5 w-5" />
                <span className="ml-2">Add Activity</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedActivity === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="customActivityName">Activity Name</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="customActivityName"
              name="customActivityName"
              placeholder="Enter activity name"
              value={customActivityName}
              onChange={(e) => setCustomActivityName(e.target.value)}
              required
              className="flex-1"
            />
            <EmoticonPicker onSelect={handleIconSelect} />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          placeholder="Enter duration in minutes"
          value={duration || ""}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        />
      </div>

      <Button onClick={handleLogActivity} className="w-full">
        Save Activity
      </Button>
      {addError && (
        <p className="text-red-500">
          Error adding activity: {addError.message}
        </p>
      )}
    </div>
  );
};

export default ActivityForm;
