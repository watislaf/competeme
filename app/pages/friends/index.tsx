import { useParams } from "@remix-run/react";
import { SearchBar } from "./components/SearchBar";
import { FriendRequests } from "./components/FriendRequests";
import { FriendsList } from "./components/FriendsList";
import { SentFriendRequests } from "@/pages/friends/components/SentFriendRequests";

export default function FriendsPage() {
  const { userId } = useParams();

  if (!userId) {
    return <div>User ID is required</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Friends</h1>
        <SearchBar userId={Number(userId)} />
        <FriendRequests userId={Number(userId)} />
        <SentFriendRequests userId={Number(userId)} />
        <FriendsList userId={Number(userId)} />
      </div>
    </div>
  );
}
