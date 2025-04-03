import { useQuery } from "@tanstack/react-query";
import { apis } from "web/app/api/initializeApi";
import { isAccessDenied } from "web/app/errors/AccessDenied";

export const useChallenges = (userId: number) => {
  const queryKey = ["challenges", userId];

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await apis().challenge.getChallenges(userId);
      return result.data;
    },
  });

  return {
    isLoading,
    challenges: error ? undefined : data,
    isForbidden: isAccessDenied(error),
    error,
  };
};
