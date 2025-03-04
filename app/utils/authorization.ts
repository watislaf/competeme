import { UserProfileResponse } from "@/api/models";

export const hasAccess = (userId: number, loggedUser?: UserProfileResponse) => {
  return isSameUser(userId, loggedUser) || loggedUser?.role === "ADMIN";
};

export const isSameUser = (
  userId: number,
  loggedUser?: UserProfileResponse,
) => {
  return Number(loggedUser?.id) === userId;
};
