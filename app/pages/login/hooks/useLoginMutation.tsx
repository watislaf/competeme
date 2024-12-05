import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Api } from "@/api/initializeApi";
import type { AuthenticationRequest } from "@/api";
import { ResponsiveContainer } from "recharts";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const mutationFn = async (params: AuthenticationRequest) => {
    return await Api().auth.authenticate(params);
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: (response) => {
      console.log(response);
      if(response && response.data.accessToken){
        localStorage.setItem("ACCESS_TOKEN_KEY", response.data.accessToken);
        navigate("/dashboard");
      }
    },
    // axios err
    onError: (error: any) => {
      if (error.response.status === 401) {
        return "Invalid credentials";
      }
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
