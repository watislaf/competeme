import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { UserSearchResponse } from "../types";
import { useAuth } from "./useAuth";

export function useSearchUsers(userId: number) {
  const [searchTerm, setSearchTerm] = useState("");
  const { getAuthHeader } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", "search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const response = await fetch(
        `http://localhost:8080/api/v1/users/search?query=${searchTerm}`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) throw new Error("Failed to search users");
      const results = (await response.json()) as UserSearchResponse[];

      const usersWithStatus = await Promise.all(
        results.map(async (user) => {
          const [isFriendResponse, hasPendingResponse] = await Promise.all([
            fetch(
              `http://localhost:8080/api/v1/users/${userId}/friends/status/${user.id}`,
              { headers: getAuthHeader() }
            ),
            fetch(
              `http://localhost:8080/api/v1/users/${userId}/friends/pending/${user.id}`,
              { headers: getAuthHeader() }
            ),
          ]);

          const isFriend = await isFriendResponse.json();
          const hasPendingRequest = await hasPendingResponse.json();

          return {
            ...user,
            isFriend,
            hasPendingRequest,
          };
        })
      );

      return usersWithStatus;
    },
    enabled: searchTerm.length > 0,
    refetchInterval: 1000,
  });

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 1000),
    []
  );

  return {
    users: users || [],
    isLoading,
    debouncedSearch,
  };
}
