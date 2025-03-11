import { json, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Award,
  BarChart2,
  Clock,
  TrendingUp,
  Users,
  Pencil,
  Check,
  X,
} from "lucide-react";
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
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(data.user.name);
  const [userName, setUserName] = useState(data.user.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(userName);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={data.user.avatar} alt={data.user.name} />
            <AvatarFallback>{data.user.name[0]}</AvatarFallback>
          </Avatar>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="border rounded-md px-2 py-1"
              />
              <Button size="icon" variant="ghost" onClick={handleSave}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Hi, {userName}!</h1>
              <Button size="icon" variant="ghost" onClick={handleEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
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
