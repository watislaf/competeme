import { useQueries } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useProfiles = (userIds: number[]) => {
  const queries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["profile", userId],
      queryFn: async () => {
        const result = await apis().user.getUserProfile(userId);
        return result.data;
      },
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const profiles = queries.map((query) => query.data);
  const errors = queries.map((query) => query.error).filter(Boolean);

  return {
    isLoading,
    profiles: errors.length ? undefined : profiles,
    errors,
  };
};
