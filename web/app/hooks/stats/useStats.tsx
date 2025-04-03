import { useQuery } from "@tanstack/react-query";
import { apis } from "web/app/api/initializeApi";
import { isAccessDenied } from "web/app/errors/AccessDenied";

export const useStats = (userId: number) => {
  const queryKey = ["stats", userId];

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await apis().stats.getStats(userId);
      return result.data;
    },
  });

  return {
    isLoading,
    stats: error ? undefined : data,
    isForbidden: isAccessDenied(error),
    error,
  };
};
