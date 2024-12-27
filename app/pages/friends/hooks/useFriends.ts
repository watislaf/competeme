import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { useProfiles } from "@/pages/friends/hooks/useProfiles";

export function useFriends(userId: number) {
  const { data: friendIds, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends", userId],
    queryFn: async () => {
      const response = await apis().friends.getFriends(userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch friends");
      }
      return response.data;
    },
  });

  const { profiles, isLoading: isProfilesLoading } = useProfiles(
    friendIds || [],
  );

  return {
    friends: profiles || [],
    isLoading: isFriendsLoading || isProfilesLoading,
  };
}
