import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/pages/friends/hooks/useAuth";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  dateJoined: string;
}

export function useUsers(userIds: number[]) {
  const { getAuthHeader } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", userIds],
    queryFn: async () => {
      if (userIds.length === 0) return [];

      const userResults: User[] = [];

      for (const id of userIds) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/users/${id}/profile`,
            {
              headers: getAuthHeader(),
            }
          );

          const user = await response.json();

          userResults.push({
            id: user.id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            dateJoined: user.dateJoined
              ? new Date(user.dateJoined).toISOString()
              : "",
          });
        } catch (error) {
          console.error(
            `Błąd przy pobieraniu danych użytkownika o ID: ${id}`,
            error
          );
        }
      }

      return userResults;
    },
    enabled: userIds.length > 0,
  });

  return {
    users: users || [],
    isLoading,
  };
}
