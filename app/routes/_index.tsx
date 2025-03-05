import { json, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Award, BarChart2, Clock, TrendingUp, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStats } from "@/hooks/stats/useStats";
import { useUser } from "@/hooks/user/useUser";

type LoaderData = {
  user: {
    name: string;
    avatar: string;
  };
  weeklyProgress: number;
  todayProgress: number;
  currentStreak: number;
  bestStreak: number;
  leaderboard: {
    name: string;
    avatar: string;
    score: number;
  }[];
  motivationalQuote: string;
};

export const loader: LoaderFunction = async () => {
  // In a real app, fetch this data from your database or API
  const data: LoaderData = {
    user: {
      name: "Alice",
      avatar: "https://picsum.photos/32/32",
    },
    weeklyProgress: 10,
    todayProgress: 2.5,
    currentStreak: 5,
    bestStreak: 14,
    leaderboard: [
      { name: "Bob", avatar: "https://picsum.photos/32/32", score: 15 },
      {
        name: "Charlie",
        avatar: "https://picsum.photos/32/32",
        score: 12,
      },
      {
        name: "David",
        avatar: "https://picsum.photos/32/32",
        score: 10,
      },
    ],
    motivationalQuote:
      "The only way to do great work is to love what you do. - Steve Jobs",
  };

  return json(data);
};

export default function HomePage() {
  const data = useLoaderData<LoaderData>();
  const { userId } = useUser();
  const { stats } = useStats(Number(userId));

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={data.user.avatar} alt={data.user.name} />
            <AvatarFallback>{data.user.name[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">Hi, {data.user.name}!</h1>
        </div>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <span className="sr-only">Settings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
        </Link>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>{data.motivationalQuote}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            You&apos;ve spent {stats?.totalTimeThisWeek} on productive
            activities this week!
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Logged Today
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.timeLoggedToday}</div>
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
            <div className="text-2xl font-bold">{stats?.currentStreak}</div>
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
            <div className="text-2xl font-bold">{stats?.longestStreak}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20h</div>
            <p className="text-xs text-muted-foreground">
              {data.weeklyProgress}/20 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Link to={`/users/${userId}/activity`} className="block">
          <Button className="w-full h-full py-8" size="lg">
            <Clock className="mr-2 h-5 w-5" /> Log Activity
          </Button>
        </Link>
        <Link to={`/users/${userId}/stats`} className="block">
          <Button className="w-full h-full py-8" size="lg">
            <BarChart2 className="mr-2 h-5 w-5" /> View Stats
          </Button>
        </Link>
        <Link to={`/users/${userId}/friends`} className="block">
          <Button className="w-full h-full py-8" size="lg">
            <Users className="mr-2 h-5 w-5" /> Friends
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top 3 friends this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {data.leaderboard.map((friend, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-bold">{index + 1}.</span>
                  <Avatar>
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{friend.name}</span>
                </div>
                <span>{friend.score}h</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
