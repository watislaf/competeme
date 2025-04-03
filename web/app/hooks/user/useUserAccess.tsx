import { useUser } from "./useUser";

export const useUserAccess = (userId: number) => {
  const { profile: loggedUser } = useUser();
  const { isCurrentUser } = useUser(userId);
  const isAdmin = loggedUser?.role === "ADMIN";
  const hasAccess = isAdmin || isCurrentUser;

  return {
    canModifyActivities: hasAccess,
    canModifyChallenges: hasAccess,
    canModifyFriends: hasAccess,
    canModifyProfile: hasAccess,
  };
};
