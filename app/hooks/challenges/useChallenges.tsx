import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { Unauthorized } from "@/errors/Unauthorized";
import { extractIdFromToken } from "@/utils/jwt";

export const useChallenges = (userId?: number) => {
    const queryKey = userId ? ["challenges", {userId}] : ["challenges"];

    const {isLoading, data, error} = useQuery({
        queryKey,
        queryFn: async () => {
            if(!userId) {
                const token = localStorage.getItem("ACCESS_TOKEN_KEY");
                const id = token && extractIdFromToken(token);
                if(!id) throw new Unauthorized();

                const result = await apis().challenge.getChallenges(Number(id));
                return result.data;
            }

            const result = await apis().challenge.getChallenges(userId);
            return result.data;
        }
    });

    return {
        isLoading,
        challenges: error ? undefined : data,
    };
};