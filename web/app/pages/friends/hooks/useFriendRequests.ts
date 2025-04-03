import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export function useFriendRequests(userId: number) {
  const queryClient = useQueryClient();

  const { data: requestIds, isLoading: isRequestsLoading } = useQuery({
    queryKey: ["friendRequests", userId],
    queryFn: async () => {
      const response = await apis().friends.getFriendRequests(userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch friend requests");
      }
      return response.data;
    },
  });

  const { data: sentRequestIds, isLoading: isSentRequestsLoading } = useQuery({
    queryKey: ["sentFriendRequests", userId],
    queryFn: async () => {
      const response = await apis().friends.getSentFriendRequests(userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch sent friend requests");
      }
      return response.data;
    },
  });

  const sendRequest = useMutation({
    mutationFn: async (receiverId: number) => {
      const response = await apis().friends.sendFriendRequest(userId, {
        receiverId,
      });
      if (response.status !== 200) {
        throw new Error("Failed to send friend request");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
    },
  });

  const cancelRequest = useMutation({
    mutationFn: async (receiverId: number) => {
      const response = await apis().friends.cancelFriendRequest(userId, {
        receiverId,
      });

      if (response.status !== 200) {
        throw new Error("Failed to cancel friend request");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
    },
  });

  const acceptRequest = useMutation({
    mutationFn: async (receiverId: number) => {
      const response = await apis().friends.acceptFriendRequest(userId, {
        receiverId,
      });
      if (response.status !== 200) {
        throw new Error("Failed to accept friend request");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (friendId: number) => {
      const response = await apis().friends.removeFriend(userId, {
        receiverId: friendId,
      });
      if (response.status !== 200) {
        throw new Error("Failed to remove friend");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
    },
  });

  return {
    requestIds: requestIds || [],
    isLoading: isRequestsLoading || isSentRequestsLoading,
    sendRequest,
    cancelRequest,
    acceptRequest,
    removeFriend,
    sentRequestIds: sentRequestIds || [],
  };
}
