import { extractIdFromToken } from "@/utils/jwt";

export const useUserId = () => {
  const token = localStorage.getItem("ACCESS_TOKEN_KEY");
  return (token && Number(extractIdFromToken(token))) || undefined;
};
