import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Loader2, X } from "lucide-react";
import { Link } from "@remix-run/react";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { useProfiles } from "../hooks/useProfiles";

interface FriendRequestsProps {
  userId: number;
}

export function FriendRequests({ userId }: FriendRequestsProps) {
  const { requestIds, isLoading, acceptRequest, removeFriend } =
    useFriendRequests(userId);
  const { profiles, isLoading: isLoadingUsers } = useProfiles(requestIds);
  if (isLoading || isLoadingUsers) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading requests...
      </div>
    );
  }

  if (requestIds.length === 0 || !profiles) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profiles.map((profile) => {
          const initials = profile.name
            ? profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "U";

          return (
            <div key={profile.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  {profile.imageUrl ? (
                    <AvatarImage
                      src={profile.imageUrl}
                      alt={profile.name || "User avatar"}
                    />
                  ) : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/users/${profile.id}/profile`}
                    className="font-medium hover:underline"
                  >
                    {profile.name || "Unknown User"}
                  </Link>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => acceptRequest.mutate(profile.id)}
                  disabled={acceptRequest.isPending}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFriend.mutate(profile.id)}
                  disabled={removeFriend.isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
