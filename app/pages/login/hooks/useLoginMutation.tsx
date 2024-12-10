import { useMutation } from "@tanstack/react-query";
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

  const mutation = useMutation({
    mutationFn: apis().auth.authenticate,
    onSuccess: (response) => {
      const { accessToken, refreshToken, userId } = response.data;
      localStorage.setItem("ACCESS_TOKEN_KEY", response.data.accessToken);
      localStorage.setItem("REFRESH_TOKEN_KEY", response.data.refreshToken);
      localStorage.setItem("USER_ID", response.data.userId);
      navigation(`/users/${response.data.userId}/profile`);
    },

    throwOnError: false,
  });

  return {
    ...mutation,
    error: transformationError(mutation.error),
  };
};
