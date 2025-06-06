import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { isAccessDenied } from "@/errors/AccessDenied";
import { useProfiles } from "@/hooks/user/useProfiles";

export function useFriends(userId: number) {
  const {
    data: friendIds,
    isLoading: isFriendsLoading,
    error,
  } = useQuery({
    queryKey: ["friends", userId],
    queryFn: async () => {
      const response = await apis().friends.getFriends(userId);
      return response.data;
    },
  });

  const { profiles, isLoading: isProfilesLoading } = useProfiles(
    friendIds || [],
  );

  return {
    friends: profiles || [],
    isLoading: isFriendsLoading || isProfilesLoading,
    isForbidden: isAccessDenied(error),
    error,
  };
}
