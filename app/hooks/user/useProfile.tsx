import { skipToken, useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { isAccessDenied } from "@/errors/AccessDenied";

export const useProfile = (userId?: number) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ["profile", { userId }],
    queryFn: userId
      ? async () => {
          try {
            const result = await apis().user.getUserProfile(userId);
            return result.data;
          } catch (err) {
            if (isAccessDenied(err)) {
              throw new Error("Access Denied");
            } else {
              throw err;
            }
          }
        }
      : skipToken,
  });
  return {
    isLoading,
    profile: error ? undefined : data,
    isForbidden: error?.message === "Access Denied",
    error,
  };
};
