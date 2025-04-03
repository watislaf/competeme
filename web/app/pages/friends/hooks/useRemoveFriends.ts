import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "web/app/api/initializeApi";

export const useRemoveFriends = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: number) => {
      const response = await apis().friends.removeFriend(userId, {
        receiverId: friendId,
      });
      if (response.status !== 200) {
        throw new Error("Failed to remove friend");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};
