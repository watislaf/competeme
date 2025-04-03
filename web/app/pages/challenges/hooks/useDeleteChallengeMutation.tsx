import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useDeleteChallengeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userId,
      challengeId,
    }: {
      userId: number;
      challengeId: number;
    }) => apis().challenge.deleteChallenge(userId, challengeId),
    onSuccess: async (_, { userId }) => {
      await queryClient.refetchQueries({ queryKey: ["challenges", userId] });
    },
  });

  return {
    ...mutation,
    error: mutation.error,
  };
};
