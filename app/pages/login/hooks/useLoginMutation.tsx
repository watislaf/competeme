import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";
import { useNavigate } from "react-router-dom";

const transformationError = (error: any) => {
  if (error === null) {
    return undefined;
  }
  if (error?.response?.status === 404) {
    return "Invalid credentials";
  }
  return "An error occurred";
};

export const useLoginMutation = () => {
  const navigation = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apis().auth.authenticate,
    onSuccess: async (response) => {
      localStorage.setItem("ACCESS_TOKEN_KEY", response.data.accessToken);
      localStorage.setItem("REFRESH_TOKEN_KEY", response.data.refreshToken);
      await queryClient.refetchQueries({ queryKey: ["profile"] });
      navigation(`/users/${response.data.userId}/profile`);
    },

    throwOnError: false,
  });

  return {
    ...mutation,
    error: transformationError(mutation.error),
  };
};
