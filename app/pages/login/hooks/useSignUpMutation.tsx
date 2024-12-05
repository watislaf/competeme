import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Api } from "@/api/initializeApi";
import { on } from "events";

export const useSignUpMutation = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: Api().auth.register,
    onSuccess: (response) => {
      console.log(response);
     if(response && response.data.accessToken){
       localStorage.setItem("ACCESS_TOKEN_KEY", response.data.accessToken);
        navigate("/dashboard");
     }
    },
    onError: (error: any) => {
      return "An error occurred";
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
