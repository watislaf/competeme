import { useQuery } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
}

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const token = localStorage.getItem("ACCESS_TOKEN_KEY");
      const id = userId || (token ? jwtDecode<JwtPayload>(token).sub : undefined);
      if(!id) return null;
      const result = await apis().user.getUserProfile(id);
      return result.data;
    },
  });
};
