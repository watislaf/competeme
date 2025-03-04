import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { isAccessDenied } from "@/errors/AccessDenied";

export const useChallenges = (userId: number) => {
  const queryKey = ["challenges", userId];

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await apis().challenge.getChallenges(userId);
        return result.data;
      } catch (err) {
        if (isAccessDenied(err)) {
          throw new Error("Access Denied");
        } else {
          throw err;
        }
      }
    },
  });

  return {
    isLoading,
    challenges: error ? undefined : data,
    isForbidden: error?.message === "Access Denied",
    error,
  };
};
