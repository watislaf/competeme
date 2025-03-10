import { getIconComponent } from "../utils/iconsHelper";
import { UserActivityResponse } from "@/api/models/user-activity-response";
import React from "react";
import { useUserAccess } from "@/hooks/user/useUserAccess";
import ProgressUpdatePopover from "./progressUpdatePopover";
import DeleteActivityButton from "./deleteActivityButton";

interface RecentActivitiesProps {
  activities: UserActivityResponse;
  userId: number;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  userId,
}) => {
  const { canModifyActivities } = useUserAccess(userId);

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
            {canModifyActivities && (
              <div className="flex items-center space-x-2">
                <ProgressUpdatePopover userId={userId} activityId={log.id} />
                <DeleteActivityButton userId={userId} activityId={log.id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
