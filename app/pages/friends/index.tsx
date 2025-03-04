import { useParams } from "@remix-run/react";
import { SearchBar } from "./components/SearchBar";
import { FriendRequests } from "./components/FriendRequests";
import { FriendsList } from "./components/FriendsList";
import { SentFriendRequests } from "@/pages/friends/components/SentFriendRequests";
import { useFriends } from "./hooks/useFriends";
import { useUserId } from "@/hooks/user/useUserId";
import { useProfile } from "@/hooks/user/useProfile";
import { hasAccess } from "@/utils/authorization";

export default function FriendsPage() {
  const { userId } = useParams();

  if (!userId) {
    return <div>User ID is required</div>;
  }

  const loggedUserId = useUserId();
  const { profile: loggedUser } = useProfile(loggedUserId);

  const { isForbidden } = useFriends(Number(userId));
  if (isForbidden) return <p>Access Denied</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Friends</h1>
        {hasAccess(Number(userId), loggedUser) && (
          <>
            <SearchBar userId={Number(userId)} />
            <FriendRequests userId={Number(userId)} />
            <SentFriendRequests userId={Number(userId)} />
          </>
        )}
        <FriendsList userId={Number(userId)} loggedUser={loggedUser} />
      </div>
    </div>
  );
}
