import { useParams } from "@remix-run/react";
import { useActivity } from "@/hooks/activity/useActivity";
import ActivityForm from "./components/activityForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RecentActivities from "./components/recentActivities";
import { UserActivityResponse } from "@/api/models/user-activity-response";
import { useProfile } from "@/hooks/user/useProfile";
import { useUserId } from "@/hooks/user/useUserId";
import { hasAccess, isSameUser } from "@/utils/authorization";

const ActivityPage: React.FC = () => {
  const { userId } = useParams();
  const { profile } = useProfile(Number(userId));
  const { activities, isLoading, isForbidden } = useActivity(Number(userId));
  const loggedUserId = useUserId();
  const { profile: loggedUser } = useProfile(loggedUserId);

  if (isLoading) return <p>Loading...</p>;
  if (isForbidden) return <p>Access Denied</p>;

  const defaultActivities: UserActivityResponse = {
    available: [],
    recent: [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isSameUser(Number(userId), loggedUser)
          ? "Your Activity"
          : `${profile?.name}'s Activity`}
      </h1>
      {hasAccess(Number(userId), loggedUser) && (
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
            {Number(loggedUserId) === Number(userId)
              ? "Your last logged activities"
              : `${profile?.name}'s last logged activites`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivities
            activities={activities || defaultActivities}
            userId={Number(userId)}
            loggedUser={loggedUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPage;
