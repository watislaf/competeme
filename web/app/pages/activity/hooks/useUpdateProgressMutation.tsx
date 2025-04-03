import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useUpdateProgressMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userId,
      activityId,
      progress,
    }: {
      userId: number;
      activityId: number;
      progress: number;
    }) => apis().activity.addProgress(userId, activityId, progress),
    onSuccess: async (_, { userId }) => {
      await queryClient.refetchQueries({ queryKey: ["activities", userId] });
    },
  });

  return {
    ...mutation,
    error: mutation.error,
  };
};
