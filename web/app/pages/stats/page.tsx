import { useParams } from "@remix-run/react";
import { Award, CalendarDays, Clock, TrendingUp } from "lucide-react";
import TabsComponent from "./components/tabsComponent";
import StatCard from "./components/statCard";
import ActivityBreakdown from "./components/activityBreakdown";
import chroma from "chroma-js";
import { useStats } from "@/hooks/stats/useStats";
import { useUser } from "@/hooks/user/useUser";

const StatsPage: React.FC = () => {
  const { userId } = useParams();
  const { stats, isLoading, isForbidden } = useStats(Number(userId));
  const { profile, isCurrentUser } = useUser(Number(userId));

  if (isForbidden) return <p>Access Denied</p>;

  const parseTime = (timeString: string | undefined): number => {
    if (!timeString) return 0;

    const match = timeString.match(/(?:(\d+)h)?\s*(?:(\d+)min)?/);

    const hours = match?.[1] ? Number(match[1]) : 0;
    const minutes = match?.[2] ? Number(match[2]) : 0;

    return hours + minutes / 60;
  };

  const generateColors = (length: number) => {
    const scale = chroma.scale("Set3").mode("lab").colors(length);
    return scale;
  };

  const colors = generateColors((stats?.activityBreakdown?.length ?? 0) + 1);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Statistics</h1>

      <TabsComponent
        stats={stats}
        chartColor={colors[0]}
        userId={Number(userId)}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Time This Week"
          value={stats?.totalTimeThisWeek}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          compareValue={
            parseTime(stats?.totalTimeThisWeek) -
            parseTime(stats?.totalTimeLastWeek)
          }
        />
        <StatCard
          title="Current Streak"
          value={stats?.currentStreak}
          description="Keep it up!"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Longest Streak"
          value={stats?.longestStreak}
          description={
            isCurrentUser
              ? "Your personal best"
              : `${profile?.name}'s personal best`
          }
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Most Active Day"
          value={stats?.mostActiveDay?.dayOfWeek || "No data"}
          description={`Average of ${stats?.mostActiveDay?.averageDuration || "0 min"} per week`}
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <ActivityBreakdown stats={stats} colors={colors.slice(1)} />
    </div>
  );
};

export default StatsPage;
