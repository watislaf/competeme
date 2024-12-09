import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"], // use user profile ud as additional key instead
    queryFn: async () => {
      const result = await apis().auth.getEmail();
      return result.data;
    },
  });
};
