import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActivityRequest } from "@/api";
import { apis } from "@/api/initializeApi";

export const useAddActivityMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userId,
      activityRequest,
    }: {
      userId: number;
      activityRequest: ActivityRequest;
    }) => apis().activity.addActivity(userId, activityRequest),
    onSuccess: async (_, { userId }) => {
      await queryClient.refetchQueries({ queryKey: ["activities", userId] });
    },
  });

  return {
    ...mutation,
    error: mutation.error,
  };
};
