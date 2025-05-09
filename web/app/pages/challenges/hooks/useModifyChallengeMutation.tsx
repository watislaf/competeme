import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChallengeModificationRequest } from "@/api";
import { apis } from "@/api/initializeApi";

export const useModifyChallengeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userId,
      challengeId,
      challengeModificationRequest,
    }: {
      userId: number;
      challengeId: number;
      challengeModificationRequest: ChallengeModificationRequest;
    }) =>
      apis().challenge.modifyChallenge(
        userId,
        challengeId,
        challengeModificationRequest,
      ),
    onSuccess: async (_, { userId }) => {
      await queryClient.refetchQueries({ queryKey: ["challenges", userId] });
    },
  });

  return {
    ...mutation,
    error: mutation.error,
  };
};
