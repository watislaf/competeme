import {useMutation, useQueryClient} from "@tanstack/react-query";
import {apis} from "@/api/initializeApi";

export const useUpdateProgressMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({userId, challengeId, progress}: { userId: number; challengeId: number; progress: number }) =>
            apis().challenge.updateProgress(userId, challengeId, progress),
        onSuccess: async (_, {userId}) => {
            await queryClient.refetchQueries({queryKey: ["challenges", userId]});
        }
    });

    return {
        ...mutation,
        error: mutation.error,
    };
};