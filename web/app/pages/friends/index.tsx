import { useParams } from "@remix-run/react";
import { SearchBar } from "./components/SearchBar";
import { FriendRequests } from "./components/FriendRequests";
import { FriendsList } from "./components/FriendsList";
import { useFriends } from "./hooks/useFriends";
import { useUserAccess } from "web/app/hooks/user/useUserAccess";
import { SentFriendRequests } from "./components/SentFriendRequests";

export default function FriendsPage() {
  const { userId } = useParams();
  const { canModifyFriends } = useUserAccess(Number(userId));
  const { isForbidden } = useFriends(Number(userId));

  if (!userId) {
    return <div>User ID is required</div>;
  }

  if (isForbidden) return <p>Access Denied</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Friends</h1>
        {canModifyFriends && (
          <>
            <SearchBar userId={Number(userId)} />
            <FriendRequests userId={Number(userId)} />
            <SentFriendRequests userId={Number(userId)} />
          </>
        )}
        <FriendsList userId={Number(userId)} />
      </div>
    </div>
  );
}
