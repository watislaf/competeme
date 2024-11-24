import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Api } from "@/api/initializeApi";

export const useSignUpMutation = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: Api().auth.authenticate,
    onSuccess: (response) => {
      console.log(response);
    },
    throwOnError: false,
  });

  const transformationError = (error: any) => {
    if (error === null) {
      return null;
    }
    if (error.response.status === 404) {
      return "Invalid credentials";
    }
    return "An error occurred";
  };

  return {
    ...mutation,
    error: transformationError(mutation.error),
  };
};
