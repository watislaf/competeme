import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "web/app/api/initializeApi";

export const useDeleteActivityMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userId,
      activityId,
    }: {
      userId: number;
      activityId: number;
    }) => apis().activity.deleteActivity(userId, activityId),
    onSuccess: async (_, { userId }) => {
      await queryClient.refetchQueries({ queryKey: ["activities", userId] });
    },
  });

  return {
    ...mutation,
    error: mutation.error,
  };
};
