import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/pages/friends/hooks/useAuth";

export function useFriendRequests(userId: number) {
  const queryClient = useQueryClient();
  const { getAuthHeader } = useAuth();

  const { data: requestIds, isLoading } = useQuery({
    queryKey: ["friendRequests", userId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}/friends/request`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch friend requests");
      return response.json() as Promise<number[]>;
    },
  });

  const sendRequest = useMutation({
    mutationFn: async (receiverId: number) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}/friends/sendRequest`,
        {
          method: "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId }),
        }
      );
      if (!response.ok) throw new Error("Failed to send friend request");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
    },
  });

  const acceptRequest = useMutation({
    mutationFn: async (receiverId: number) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}/friends/accept`,
        {
          method: "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId }),
        }
      );
      if (!response.ok) throw new Error("Failed to accept friend request");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (receiverId: number) => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}/friends/cancel`,
        {
          method: "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId }),
        }
      );
      if (!response.ok) throw new Error("Failed to remove friend");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
    },
  });

  const { data: sentRequestIds, isLoading: isLoadingSent } = useQuery({
    queryKey: ["sentFriendRequests", userId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}/friends/sent`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch sent friend requests");
      return response.json() as Promise<number[]>;
    },
  });

  return {
    requestIds: requestIds || [],
    isLoading,
    sendRequest,
    acceptRequest,
    removeFriend,
    sentRequestIds: sentRequestIds || [],
  };
}
