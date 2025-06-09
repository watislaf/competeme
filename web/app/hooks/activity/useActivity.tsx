import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { isAccessDenied } from "@/errors/AccessDenied";

export const useActivity = (userId: number) => {
  const queryKey = ["activities", userId];

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await apis().activity.getActivities(userId);
      return result.data;
    },
  });

  const getRandomActivity = async () => {
    try {
      const response = await apis().activity.getRandomActivity(userId);
      return response.data;
    } catch (err) {
      console.error("Error fetching random activity:", err);
      throw err;
    }
  };

  return {
    isLoading,
    activities: error ? undefined : data,
    isForbidden: isAccessDenied(error),
    error,
    getRandomActivity,
  };
};
