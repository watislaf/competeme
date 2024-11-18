import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Award, CalendarDays, Clock, TrendingUp } from "lucide-react";

type ActivityData = {
  name: string;
  hours: number;
  color: string;
};

type TimeData = {
  date: string;
  hours: number;
};

type LoaderData = {
  weeklyData: TimeData[];
  monthlyData: TimeData[];
  activityBreakdown: ActivityData[];
  currentStreak: number;
  longestStreak: number;
  totalTimeThisWeek: number;
  totalTimeLastWeek: number;
};

export const loader: LoaderFunction = async () => {
  // In a real app, fetch this data from your database
  const data: LoaderData = {
    weeklyData: [
      { date: "Mon", hours: 2 },
      { date: "Tue", hours: 3 },
      { date: "Wed", hours: 4 },
      { date: "Thu", hours: 3 },
      { date: "Fri", hours: 5 },
      { date: "Sat", hours: 4 },
      { date: "Sun", hours: 3 },
    ],
    monthlyData: [
      { date: "Week 1", hours: 15 },
      { date: "Week 2", hours: 20 },
      { date: "Week 3", hours: 18 },
      { date: "Week 4", hours: 25 },
    ],
    activityBreakdown: [
      { name: "Coding", hours: 10, color: "hsl(var(--chart-1))" },
      { name: "Reading", hours: 5, color: "hsl(var(--chart-2))" },
      { name: "Exercise", hours: 3, color: "hsl(var(--chart-3))" },
      { name: "Meditation", hours: 2, color: "hsl(var(--chart-4))" },
    ],
    currentStreak: 5,
    longestStreak: 14,
    totalTimeThisWeek: 24,
    totalTimeLastWeek: 20,
  };

  return json(data);
};

export default function StatisticsPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Statistics</h1>

      <Tabs defaultValue="weekly" className="w-full mb-8">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>
                Your activity over the past week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart
                data={data.weeklyData}
                index="date"
                categories={["hours"]}
                colors={["hsl(var(--chart-1))"]}
                valueFormatter={(value: number) => `${value}h`}
                yAxisWidth={48}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>
                Your activity over the past month
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart
                data={data.monthlyData}
                index="date"
                categories={["hours"]}
                colors={["black"]}
                valueFormatter={(value: number) => `${value}h`}
                yAxisWidth={48}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Time This Week
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTimeThisWeek}h</div>
            <p className="text-xs text-muted-foreground">
              {data.totalTimeThisWeek > data.totalTimeLastWeek ? "+" : "-"}
              {Math.abs(data.totalTimeThisWeek - data.totalTimeLastWeek)}h from
              last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Longest Streak
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.longestStreak} days</div>
            <p className="text-xs text-muted-foreground">Your personal best</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Active Day
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Friday</div>
            <p className="text-xs text-muted-foreground">
              Average of 5h per week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Breakdown</CardTitle>
          <CardDescription>Time spent on each activity</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-[300px] w-[300px]">
            <PieChart
              data={data.activityBreakdown}
              index="name"
              category="hours"
              valueFormatter={(value: number) => `${value}h`}
              colors={data.activityBreakdown.map((item) => item.color)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
