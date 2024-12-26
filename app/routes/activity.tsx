import { useState } from "react";
import { json, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
  Book,
  Clock,
  Code,
  Dumbbell,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Activity = {
  id: string;
  name: string;
  icon: string;
};

type LogEntry = {
  id: string;
  activity: string;
  duration: string;
  timestamp: string;
};

type LoaderData = {
  activities: Activity[];
  recentLogs: LogEntry[];
};

export const loader: LoaderFunction = async () => {
  // In a real app, fetch this data from your database
  const activities: Activity[] = [
    { id: "1", name: "Programming", icon: "Code" },
    { id: "2", name: "Reading", icon: "Book" },
    { id: "3", name: "Gym", icon: "Dumbbell" },
  ];

  const recentLogs: LogEntry[] = [
    {
      id: "1",
      activity: "Programming",
      duration: "1h 30m",
      timestamp: "2023-05-20T14:30:00Z",
    },
    {
      id: "2",
      activity: "Reading",
      duration: "45m",
      timestamp: "2023-05-20T10:15:00Z",
    },
    {
      id: "3",
      activity: "Gym",
      duration: "1h",
      timestamp: "2023-05-19T18:00:00Z",
    },
  ];

  return json({ activities, recentLogs });
};

export default function LogActivityPage() {
  const { activities, recentLogs } = useLoaderData<LoaderData>();
  const [customActivity] = useState("");

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code className="h-5 w-5" />;
      case "Book":
        return <Book className="h-5 w-5" />;
      case "Dumbbell":
        return <Dumbbell className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Log Activity</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Log New Activity</CardTitle>
          <CardDescription>
            Select an activity and enter the duration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>
              <Select name="activity" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an activity" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.name}>
                      <div className="flex items-center">
                        {getIconComponent(activity.icon)}
                        <span className="ml-2">{activity.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    <div className="flex items-center">
                      <Plus className="h-5 w-5" />
                      <span className="ml-2">Custom Activity</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {customActivity === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customActivityName">Custom Activity Name</Label>
                <Input
                  id="customActivityName"
                  name="customActivityName"
                  placeholder="Enter custom activity name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 1h 30m"
                required
              />
            </div>
            <Button
              type="submit"
              name="_action"
              value="logActivity"
              className="w-full"
            >
              Save Activity
            </Button>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your last 3 logged activities</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getIconComponent(
                    activities.find((a) => a.name === log.activity)?.icon || "",
                  )}
                  <span>{log.activity}</span>
                  <span className="text-muted-foreground">{log.duration}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Form method="post">
                    <input type="hidden" name="logId" value={log.id} />
                    <Button
                      type="submit"
                      name="_action"
                      value="deleteLog"
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </Form>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
