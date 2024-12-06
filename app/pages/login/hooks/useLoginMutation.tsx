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

  const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem("REFRESH_TOKEN_KEY");
    if (!currentRefreshToken) {
     throw new Error("No refresh token found");
    }

    try {
      const response = await Api().auth.refresh(currentRefreshToken);
      if(response && response.data.accessToken) {
        localStorage.setItem("ACCESS_TOKEN_KEY", response.data.accessToken);
        return response.data;
      } else {
        throw new Error("Missing accessToken in response");
      }
    } catch (error) {
      throw new Error("Failed to refresh token");
    }
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
    onError: async (error: any) => {
      if (error.response.status === 401) {
        try {
          await refreshToken();
        } catch (e) {
          localStorage.removeItem("ACCESS_TOKEN_KEY");
          navigate("/login");
        }
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
