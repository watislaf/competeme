import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import type { FriendOption } from "../components/challengeForm";

export const useFriendQueries = (userId: number) => {
  const friendIdsQuery = useQuery({
    queryKey: ["friendIds", userId],
    queryFn: async () => {
      const response = await apis().friends.getFriends(userId);
      if (response.status !== 200) {
        throw new Error(`Error fetching friends: ${response.statusText}`);
      }
      return response.data as number[];
    },
    enabled: !!userId,
  });

  const friendProfilesQuery = useQuery({
    queryKey: ["friendProfiles", friendIdsQuery.data],
    queryFn: async () => {
      if (!friendIdsQuery.data) return [];

      const friendProfiles = await Promise.all(
        friendIdsQuery.data.map(async (id) => {
          try {
            const profileResponse = await apis().user.getUserProfile(id);
            return {
              id: profileResponse.data.id,
              name: profileResponse.data.name,
              imageUrl: profileResponse.data.imageUrl,
            };
          } catch (error) {
            console.error(`Failed to fetch profile for user ${id}:`, error);
            return null;
          }
        }),
      );

      return friendProfiles.filter(Boolean) as FriendOption[];
    },
    enabled: !!friendIdsQuery.data && friendIdsQuery.data.length > 0,
  });

  return {
    friendIdsQuery,
    friendProfilesQuery,
    isLoading: friendIdsQuery.isLoading || friendProfilesQuery.isLoading,
    loadError: friendIdsQuery.error || friendProfilesQuery.error,
    friends: friendProfilesQuery.data || [],
  };
};
