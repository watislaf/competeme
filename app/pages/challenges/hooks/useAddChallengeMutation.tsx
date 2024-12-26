import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { ChallengeRequest } from "@/api";

export const useAddChallengeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userId,
      challengeRequest,
    }: {
      userId: number;
      challengeRequest: ChallengeRequest;
    }) => apis().challenge.addChallenge(userId, challengeRequest),
    onSuccess: async (_, { userId }) => {
      await queryClient.refetchQueries({ queryKey: ["challenges", userId] });
    },
  });

  return {
    ...mutation,
    error: mutation.error,
  };
};
