export function useAuth() {
  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN_KEY")}`,
    "Content-Type": "application/json",
  });

  return { getAuthHeader };
}
