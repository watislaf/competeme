import { apis } from "@/api/initializeApi";
import { useQuery } from "@tanstack/react-query";

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
  };
};
