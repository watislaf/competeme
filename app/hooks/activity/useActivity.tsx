import { apis } from "@/api/initializeApi";
import { isAccessDenied } from "@/errors/AccessDenied";
import { useQuery } from "@tanstack/react-query";

export const useActivity = (userId: number) => {
  const queryKey = ["activities", userId];

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await apis().activity.getActivities(userId);
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
    activities: error ? undefined : data,
    isForbidden: error?.message === "Access Denied",
    error,
  };
};
