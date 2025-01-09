import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { apis } from "../../../api/initializeApi";
import { FriendshipStatusEnum } from "../../../api";

export function useSearchUsers(userId: number) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users-search-as-friends", searchTerm],
    queryFn: async () => {
      if (searchTerm === "") return [];
      if (!searchTerm) return [];
      const users = await apis().user.searchUsers(searchTerm);
      if (users.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      const statuses = await apis().friends.getStatuses(
        userId,
        users.data.map((u) => u.id),
      );
      if (statuses.status !== 200) {
        throw new Error("Failed to fetch statuses");
      }
      return users.data.map((user) => {
        const status = statuses.data.find(
          (s) => s.id.receiverId === user.id || s.id.senderId === user.id,
        );
        return {
          ...user,
          isFriend: status?.status === FriendshipStatusEnum.Accepted,
          hasPendingRequest: status?.status === FriendshipStatusEnum.Pending,
        };
      });
    },
  });

  const debouncedSearch = useCallback(debounce(setSearchTerm, 1000), []);

  return {
    users: users || [],
    isLoading,
    debouncedSearch,
  };
}
