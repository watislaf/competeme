import {
  json,
  redirect,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { Plus, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Challenge = {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  unit: string;
  leaderboard: { name: string; score: number }[];
};

type LoaderData = {
  challenges: Challenge[];
};

export const loader: LoaderFunction = async () => {
  // In a real app, fetch this data from your database
  const challenges: Challenge[] = [
    {
      id: "1",
      title: "Code for 10 hours this week",
      description: "Push your coding skills to the next level!",
      goal: 10,
      progress: 6,
      unit: "hours",
      leaderboard: [
        { name: "Alice", score: 8 },
        { name: "Bob", score: 7 },
        { name: "You", score: 6 },
      ],
    },
    {
      id: "2",
      title: "Read 5 books this month",
      description: "Expand your knowledge through reading!",
      goal: 5,
      progress: 2,
      unit: "books",
      leaderboard: [
        { name: "Charlie", score: 4 },
        { name: "You", score: 2 },
        { name: "David", score: 1 },
      ],
    },
  ];

  return json({ challenges });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const goal = formData.get("goal");
  const unit = formData.get("unit");

  // In a real app, you would save this to your database
  console.log("New challenge:", { title, description, goal, unit });

  return redirect("/challenges");
};

export default function ChallengesPage() {
  const { challenges } = useLoaderData<LoaderData>();
  const actionData = useActionData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Progress</span>
                  <span>
                    {challenge.progress} / {challenge.goal} {challenge.unit}
                  </span>
                </div>
                <Progress value={(challenge.progress / challenge.goal) * 100} />
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <h4 className="font-semibold mb-2">Leaderboard</h4>
                <ul className="space-y-1">
                  {challenge.leaderboard.map((entry, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{entry.name}</span>
                      <span>
                        {entry.score} {challenge.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardFooter>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Create New Challenge</CardTitle>
            <CardDescription>
              Set up a new challenge for yourself and others!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required />
              </div>
              <div className="flex space-x-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="goal">Goal</Label>
                  <Input id="goal" name="goal" type="number" required />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    name="unit"
                    placeholder="e.g., hours, books"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Challenge
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
