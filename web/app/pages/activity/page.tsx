import { useParams } from "@remix-run/react";
import ActivityForm from "./components/activityForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "web/app/components/ui/card";
import RecentActivities from "./components/recentActivities";
import { useUser } from "web/app/hooks/user/useUser";
import { useActivity } from "web/app/hooks/activity/useActivity";
import { useUserAccess } from "web/app/hooks/user/useUserAccess";
import { UserActivityResponse } from "web/app/api";

const ActivityPage: React.FC = () => {
  const { userId } = useParams();
  const { profile, isCurrentUser } = useUser(Number(userId));
  const { activities, isLoading, isForbidden } = useActivity(Number(userId));
  const { canModifyActivities } = useUserAccess(Number(userId));

  if (isLoading) return <p>Loading...</p>;
  if (isForbidden) return <p>Access Denied</p>;

  const defaultActivities: UserActivityResponse = {
    available: [],
    recent: [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isCurrentUser ? "Your Activity" : `${profile?.name}'s Activity`}
      </h1>
      {canModifyActivities && (
        <>
          <h2 className="text-2xl font-bold mb-8">Log Activity</h2>
          <ActivityForm
            activities={activities || defaultActivities}
            userId={Number(userId)}
          />
        </>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>
            {isCurrentUser
              ? "Your last logged activities"
              : `${profile?.name}'s last logged activites`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivities
            activities={activities || defaultActivities}
            userId={Number(userId)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPage;
