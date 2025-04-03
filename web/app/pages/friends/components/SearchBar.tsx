import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserPlus } from "lucide-react";
import { Link } from "@remix-run/react";
import { useSearchUsers } from "../hooks/useSearchUsers";
import { useFriendRequests } from "../hooks/useFriendRequests";

interface SearchBarProps {
  userId: number;
}

export function SearchBar({ userId }: SearchBarProps) {
  const { users, isLoading, debouncedSearch } = useSearchUsers(userId);
  const { sendRequest } = useFriendRequests(userId);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users..."
        onChange={(e) => debouncedSearch(e.target.value)}
        className="max-w-md"
      />
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching...
        </div>
      )}
      {users.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.imageUrl} alt={user.username} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        to={`/users/${user.id}/profile`}
                        className="font-medium hover:underline"
                      >
                        {user.username}
                      </Link>
                    </div>
                  </div>
                  {user.isFriend ? (
                    <Button variant="outline" size="sm" disabled>
                      Friend
                    </Button>
                  ) : user.hasPendingRequest ? (
                    <Button variant="outline" size="sm" disabled>
                      Pending
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendRequest.mutate(user.id)}
                      disabled={sendRequest.isPending}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Friend
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
