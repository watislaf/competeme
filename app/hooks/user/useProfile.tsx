import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useProfile = (userId?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ["profile", { userId }],
    queryFn: async () => {
      if (!userId) {
        return;
      }
      const result = await apis().user.getUserProfile(userId);
      return result.data;
    },
  });
  return {
    isLoading,
    profile: error ? undefined : data,
  };
};
