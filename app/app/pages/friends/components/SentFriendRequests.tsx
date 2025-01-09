import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Loader2, X } from "lucide-react";
import { useFriendRequests } from "../hooks/useFriendRequests"; // Importujemy odpowiedni hook
import { useProfiles } from "../hooks/useProfiles"; // Hook do pobrania użytkowników
import type { User } from "../types/user";
import { Link } from "@remix-run/react";

interface SentFriendRequestsProps {
  userId: number;
}

export function SentFriendRequests({ userId }: SentFriendRequestsProps) {
  const { sentRequestIds, isLoading, removeFriend } = useFriendRequests(userId);

  const { users, isLoading: isLoadingUsers } = useProfiles(sentRequestIds);

  if (isLoading || isLoadingUsers) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading sent requests...
      </div>
    );
  }

  if (sentRequestIds.length === 0) {
    return <p>No sent friend requests found.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sent Friend Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user: User) => {
          const initials = user.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "U";

          return (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  {user.imageUrl ? (
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.name || "User avatar"}
                    />
                  ) : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/users/${user.id}/profile`}
                    className="font-medium hover:underline"
                  >
                    {user.name || "Unknown User"}
                  </Link>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFriend.mutate(user.id)}
                  disabled={removeFriend.isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Request
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
