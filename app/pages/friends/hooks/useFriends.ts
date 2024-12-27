import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/pages/friends/hooks/useAuth";

interface Friend {
  id: number;
  name: string;
  username: string;
  imageUrl: string;
  status: "online" | "offline";
  lastActive: string;
}

export function useFriends(userId: number) {
  const queryClient = useQueryClient();
  const { getAuthHeader } = useAuth();

  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", userId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}/friends/`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const friendIds = (await response.json()) as number[];

      const detailedFriends = await Promise.all(
        friendIds.map(async (id) => {
          const userResponse = await fetch(
            `http://localhost:8080/api/v1/users/${id}/profile`,
            {
              headers: getAuthHeader(),
            }
          );
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data for friend ${id}`);
          }
          return userResponse.json();
        })
      );

      return detailedFriends;
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (friendId: number) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}/friends/remove`,
        {
          method: "POST",
          headers: getAuthHeader(),
          body: JSON.stringify({
            receiverId: friendId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove friend");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  return {
    friends: friends || [],
    isLoading,
    removeFriend,
  };
}
