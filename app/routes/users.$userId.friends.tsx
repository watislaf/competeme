import { useSearchParams } from "@remix-run/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChallengesPage from "../pages/challenges/page";
import FriendsManagement from "../pages/friends/index";

export default function FriendsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get("show") || "friends";

  const handleTabChange = (value: string) => {
    setSearchParams({ show: value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="ranking">Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendsManagement />
        </TabsContent>

        <TabsContent value="challenges">
          {/* Osadzenie komponentu ChallengesPage */}
          <ChallengesPage />
        </TabsContent>

        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle>Rankings</CardTitle>
              <CardDescription>See how you rank among friends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Rankings will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
