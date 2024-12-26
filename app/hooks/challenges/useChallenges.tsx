import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { Unauthorized } from "@/errors/Unauthorized";
import { extractIdFromToken } from "@/utils/jwt";

export const useChallenges = (userId: number) => {
    const queryKey = ["challenges", userId];

    const {isLoading, data, error} = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await apis().challenge.getChallenges(userId);
            return result.data;
        }
    });

    return {
        isLoading,
        challenges: error ? undefined : data,
    };
};