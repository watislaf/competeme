import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile", Math.random()], // use user profile ud as additional key instead
    queryFn: apis().auth.getEmail,
  });
};
