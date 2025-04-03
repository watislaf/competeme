import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserMinus } from "lucide-react";
import { Link } from "@remix-run/react";
import { useFriends } from "../hooks/useFriends";
import { useRemoveFriends } from "@/pages/friends/hooks/useRemoveFriends";
import { UserProfileResponse } from "@/api";
import { useUserAccess } from "@/hooks/user/useUserAccess";
import { useUser } from "@/hooks/user/useUser";

interface FriendsListProps {
  userId: number;
}

const FriendCard = ({
  friend,
  removeFriend,
  userId,
}: {
  friend: UserProfileResponse;
  removeFriend: { mutate: (friendId: number) => void; isPending: boolean };
  userId: number;
}) => {
  const { canModifyFriends } = useUserAccess(userId);
  return (
    <div
      key={friend.id}
      className="flex items-center justify-between p-4 rounded-lg border"
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={friend.imageUrl} alt={friend.name} />
          <AvatarFallback>{friend.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <Link
            to={`/users/${friend.id}/profile`}
            className="font-medium hover:underline"
          >
            {friend.name}
          </Link>
        </div>
      </div>
      {canModifyFriends && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeFriend.mutate(friend.id)}
          disabled={removeFriend.isPending}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Remove
        </Button>
      )}
    </div>
  );
};

export function FriendsList({ userId }: FriendsListProps) {
  const { friends, isLoading } = useFriends(userId);
  const removeFriend = useRemoveFriends(userId);
  const { profile, isCurrentUser } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading friends...
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No friends yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCurrentUser ? "Your Friends" : `${profile?.name}'s Friends`}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {friends.map((friend, index) =>
          friend ? (
            <FriendCard
              key={friend.id}
              friend={friend}
              removeFriend={removeFriend}
              userId={userId}
            />
          ) : (
            <div key={index}> friend is missing</div>
          ),
        )}
      </CardContent>
    </Card>
  );
}
