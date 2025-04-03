import { Link, useParams } from "@remix-run/react";
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
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { useProfiles } from "../hooks/user/useProfiles";
import { useStats } from "../hooks/stats/useStats";
import { apis } from "../api/initializeApi";

export default function HomePage() {
  const { userId } = useParams();
  const { profiles, isLoading: isLoadingProfile } = useProfiles([
    Number(userId),
  ]);
  const profile = profiles?.[0];
  const { stats, isLoading: isLoadingStats } = useStats(Number(userId));

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (profile?.name) {
      setTempName(profile.name);
      setUserName(profile.name);
    }
  }, [profile?.name]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await apis().user.updateProfileName(
        Number(profile?.id),
        tempName,
      );

      if (response.status != 200) {
        throw new Error("Failed to update profile");
      }

      setUserName(tempName);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setTempName(userName);
    setIsEditing(false);
  };

  if (isLoadingProfile || isLoadingStats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={profile?.imageUrl} alt={userName} />
            <AvatarFallback>{userName ? userName[0] : "U"}</AvatarFallback>
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
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            You&apos;ve spent {stats?.totalTimeThisWeek || "0"} on productive
            activities this week!
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Logged Today
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.timeLoggedToday || "0"}
            </div>
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
            <div className="text-2xl font-bold">
              {stats?.currentStreak || "0 days"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.longestStreak || "0 days"}
            </div>
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
      </Card>

      {stats?.topActivity && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Top Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {stats.topActivity.activityName}
            </p>
            <p className="text-sm text-muted-foreground">
              Keep up the good work!
            </p>
          </CardContent>
        </Card>
      )}

      {stats?.mostActiveDay && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Most Active Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{stats.mostActiveDay.dayOfWeek}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
