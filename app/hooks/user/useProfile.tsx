import { skipToken, useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useProfile = (userId?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ["profile", { userId }],
    queryFn: userId
      ? async () => {
          const result = await apis().user.getUserProfile(userId);
          return result.data;
        }
      : skipToken,
  });
  return {
    isLoading,
    profile: error ? undefined : data,
  };
};
