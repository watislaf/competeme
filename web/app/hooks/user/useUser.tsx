import { skipToken, useQuery } from "@tanstack/react-query";
import { apis } from "web/app/api/initializeApi";
import { isAccessDenied } from "web/app/errors/AccessDenied";
import { extractIdFromToken } from "web/app/utils/jwt";

export const useUser = (userId?: number) => {
  const loggedInUserId = (() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const token = localStorage.getItem("ACCESS_TOKEN_KEY");
    return (token && Number(extractIdFromToken(token))) || undefined;
  })();

  const resolvedUserId = userId ?? loggedInUserId;

  const isCurrentUser =
    loggedInUserId !== undefined &&
    resolvedUserId !== undefined &&
    loggedInUserId === resolvedUserId;

  const { isLoading, data, error } = useQuery({
    queryKey: ["profile", { userId: resolvedUserId }],
    queryFn: resolvedUserId
      ? async () => {
          const result = await apis().user.getUserProfile(resolvedUserId);
          return result.data;
        }
      : skipToken,
  });

  return {
    isLoading,
    userId: resolvedUserId,
    profile: error ? undefined : data,
    isForbidden: isAccessDenied(error),
    isCurrentUser,
    error,
  };
};
