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

const ActivityPage: React.FC = () => {
  const { userId } = useParams();
  const { activities, isLoading } = useActivity(Number(userId));

  if (isLoading) return <p>Loading...</p>;

  const defaultActivities: UserActivityResponse = {
    available: [],
    recent: [],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Log Activity</h1>
      <ActivityForm
        activities={activities || defaultActivities}
        userId={Number(userId)}
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your last logged activities</CardDescription>
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
