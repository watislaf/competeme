import { Link, useParams } from "@remix-run/react";
import { Bell, Edit, Lock, Settings, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/user/useProfile";
import moment from "moment";

export default function ProfilePage() {
  const { userId } = useParams();
  const { profile, isLoading } = useProfile(Number(userId));

  const user = {
    name: "Jane Doe",
    username: "jane_tracker",
    avatar: "https://picsum.photos/100/100",
    totalTimeLogged: "120h 30m",
    topActivity: "Running",
    topActivityTime: "40h 15m",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>User not found</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
            <AvatarFallback>
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            {/*will change it if needed*/}
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{`Joined: ${moment(
              profile.dateJoined,
            ).format("DD MMM YYYY")}`}</p>
          </div>
        </div>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Time Logged: {user.totalTimeLogged}</p>
            <p>
              Most Frequent Activity: {user.topActivity} ({user.topActivityTime}
              )
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Top Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold">{user.topActivity}</h3>
            <p>{user.topActivityTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Profile Picture
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Change Username
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Activities
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Preferences
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="mr-2 h-4 w-4" />
                  Privacy Settings
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Account Details
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
