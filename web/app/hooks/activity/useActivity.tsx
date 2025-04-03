import { apis } from "@/api/initializeApi";
import { isAccessDenied } from "@/errors/AccessDenied";
import { useQuery } from "@tanstack/react-query";

export const useActivity = (userId: number) => {
  const queryKey = ["activities", userId];

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await apis().activity.getActivities(userId);
      return result.data;
    },
  });

  return {
    isLoading,
    activities: error ? undefined : data,
    isForbidden: isAccessDenied(error),
    error,
  };
};
