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
import { z } from "zod";

const activitySchema = z.object({
  selectedActivity: z.string().nonempty("Please select an activity."),
  customActivityName: z.string().min(1, "Activity name is required").optional(),
  duration: z.number().positive("Goal must be a positive number"),
});

interface ActivityFormProps {
  activities?: UserActivityResponse;
  userId: number;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activities, userId }) => {
  const [formData, setFormData] = useState({
    selectedActivity: "",
    customActivityName: "",
    duration: "",
  });
  const [customActivityType, setCustomActivityType] =
    useState<ActivityRequestTypeEnum>("CLOCK");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: addActivity, error: addActivityError } =
    useAddActivityMutation();

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedActivity: value,
      customActivityName: value === "custom" ? "" : prev.customActivityName,
    }));
    setErrors((prev) => ({ ...prev, selectedActivity: "" }));
  };

  const handleLogActivity = () => {
    const parsedDuration = Number(formData.duration);
    const validationData = {
      selectedActivity: formData.selectedActivity,
      customActivityName:
        formData.selectedActivity === "custom"
          ? formData.customActivityName
          : undefined,
      duration: parsedDuration,
    };

    const result = activitySchema.safeParse(validationData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    if (formData.selectedActivity === "custom") {
      addActivity({
        userId,
        activityRequest: {
          title: formData.customActivityName,
          type: customActivityType,
          duration: parsedDuration,
        },
      });
    } else {
      const selectedActivityData = activities?.available.find(
        (activity) => activity.title === formData.selectedActivity,
      );

      if (selectedActivityData) {
        addActivity({
          userId,
          activityRequest: {
            title: selectedActivityData.title,
            type: selectedActivityData.type,
            duration: parsedDuration,
          },
        });
      }
    }
    setFormData({ selectedActivity: "", customActivityName: "", duration: "" });
  };

  const handleIconSelect = (activityType: ActivityRequestTypeEnum) => {
    setCustomActivityType(activityType);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="activity">Activity</Label>
        <Select
          name="activity"
          required
          onValueChange={handleSelectChange}
          value={formData.selectedActivity}
        >
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
        {errors.selectedActivity && (
          <p className="text-red-500">{errors.selectedActivity}</p>
        )}
      </div>

      {formData.selectedActivity === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="customActivityName">Activity Name</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="customActivityName"
              name="customActivityName"
              placeholder="Enter activity name"
              value={formData.customActivityName}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  customActivityName: e.target.value,
                }));
                setErrors((prev) => ({ ...prev, customActivityName: "" }));
              }}
              required
              className="flex-1"
            />
            <EmoticonPicker onSelect={handleIconSelect} />
          </div>
          {errors.customActivityName && (
            <p className="text-red-500">{errors.customActivityName}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          placeholder="Enter duration in minutes"
          value={formData.duration}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              duration: e.target.value,
            }));
            setErrors((prev) => ({ ...prev, duration: "" }));
          }}
          required
        />
        {errors.duration && <p className="text-red-500">{errors.duration}</p>}
      </div>

      <Button onClick={handleLogActivity} className="w-full">
        Save Activity
      </Button>
      {addActivityError && (
        <p className="text-red-500">
          Error adding activity: {addActivityError.message}
        </p>
      )}
    </div>
  );
};

export default ActivityForm;
