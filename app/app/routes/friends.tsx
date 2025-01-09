import { useState } from "react";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

type Friend = {
  id: string;
  name: string;
  avatar: string;
  totalHours: number;
};

type GlobalRanking = {
  rank: number;
  name: string;
  avatar: string;
  totalHours: number;
};

type LoaderData = {
  friends: Friend[];
  globalRankings: GlobalRanking[];
};

export const loader: LoaderFunction = async () => {
  // In a real app, fetch this data from your database
  const friends: Friend[] = [
    {
      id: "1",
      name: "Alice",
      avatar: "https://picsum.photos/40/40",
      totalHours: 25,
    },
    {
      id: "2",
      name: "Bob",
      avatar: "https://picsum.photos/40/40",
      totalHours: 20,
    },
    {
      id: "3",
      name: "Charlie",
      avatar: "https://picsum.photos/40/40",
      totalHours: 18,
    },
  ];

  const globalRankings: GlobalRanking[] = [
    {
      rank: 1,
      name: "David",
      avatar: "https://picsum.photos/40/40",
      totalHours: 50,
    },
    {
      rank: 2,
      name: "Emma",
      avatar: "https://picsum.photos/40/40",
      totalHours: 45,
    },
    {
      rank: 3,
      name: "You",
      avatar: "https://picsum.photos/40/40",
      totalHours: 40,
    },
  ];

  return json({ friends, globalRankings });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "addFriend") {
    const friendUsername = formData.get("friendUsername");
    // In a real app, you would search for the user and add them as a friend
    console.log("Adding friend:", friendUsername);
  } else if (action === "challengeFriend") {
    const friendId = formData.get("friendId");
    const challengeDetails = formData.get("challengeDetails");
    // In a real app, you would create a new challenge and notify the friend
    console.log("Challenging friend:", friendId, challengeDetails);
  }

  return redirect("/friends");
};

export default function FriendsPage() {
  const { friends, globalRankings } = useLoaderData<LoaderData>();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="rankings">Global Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Add Friend</CardTitle>
              <CardDescription>
                Find and add friends by username or email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="flex space-x-2">
                <Input
                  name="friendUsername"
                  placeholder="Enter username or email"
                  className="flex-grow"
                />
                <Button type="submit" name="_action" value="addFriend">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Friend
                </Button>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.totalHours} hours logged this week
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedFriend(friend.id)}
                    variant="outline"
                  >
                    Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Challenge a Friend</CardTitle>
              <CardDescription>Set a challenge for your friend</CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="friendSelect" className="text-sm font-medium">
                    Select a friend
                  </label>
                  <select
                    id="friendSelect"
                    name="friendId"
                    className="w-full border rounded-md p-2"
                    value={selectedFriend || ""}
                    onChange={(e) => setSelectedFriend(e.target.value)}
                  >
                    <option value="">Choose a friend</option>
                    {friends.map((friend) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="challengeDetails"
                    className="text-sm font-medium"
                  >
                    Challenge details
                  </label>
                  <Input
                    id="challengeDetails"
                    name="challengeDetails"
                    placeholder="e.g., Log 5 hours of exercise this week"
                  />
                </div>
                <Button type="submit" name="_action" value="challengeFriend">
                  Send Challenge
                </Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Global Rankings</CardTitle>
              <CardDescription>
                See how you rank against the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {globalRankings.map((ranking) => (
                  <div
                    key={ranking.rank}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-lg">{ranking.rank}</span>
                      <Avatar>
                        <AvatarImage src={ranking.avatar} alt={ranking.name} />
                        <AvatarFallback>{ranking.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{ranking.name}</span>
                    </div>
                    <span>{ranking.totalHours} hours</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
