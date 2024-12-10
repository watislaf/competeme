import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId], // use user profile ud as additional key instead
    queryFn: async () => {
      if(!userId) throw new Error("User ID is required");
      const result = await apis().auth.getEmail();
      return result.data;
    },
    enabled: !!userId,
  });
};
