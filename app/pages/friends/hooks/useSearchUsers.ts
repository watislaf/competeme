import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { apis } from "@/api/initializeApi";
import { FriendshipStatusEnum } from "@/api";
import { useAuth } from "./useAuth";


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
      // const statuses = await apis().friends.getStatuses(
      //   userId,
      //   users.data.map((u) => u.id),
      // );

      // const statuses = await Promise.all(
      //   users.data.map((u) => apis().friends.getStatus(userId, u.id))
      // );

      const statuses = await Promise.all(
        users.data.map(async (u) => {
          try {
            const response = await fetch(`/api/v1/users/${userId}/friends/${u.id}`);

            if (!response.ok) {
              throw new Error(`Błąd pobierania statusu dla użytkownika ${u.id}: ${response.statusText}`);
            }

            return await response.json(); // Zakładamy, że odpowiedź jest w formacie JSON
          } catch (error) {
            console.error(error);
            return null; // Możesz zwrócić null lub inną wartość domyślną w przypadku błędu
          }
        })
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
