import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { Unauthorized } from "@/errors/Unauthorized";
import { extractIdFromToken } from "@/utils/jwt";

export const useProfile = (userId?: number) => {
  const queryKey = userId ? ["profile", { userId }] : ["profile"];

  const { isLoading, data, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) {
        const token = localStorage.getItem("ACCESS_TOKEN_KEY");
        const id = token && extractIdFromToken(token);
        if (!id) throw new Unauthorized();
        const result = await apis().user.getUserProfile(Number(id));
        return result.data;
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
