import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/pages/friends/hooks/useAuth";

export const useUpdateProfileImage = (userId?: number) => {
  const queryClient = useQueryClient();
  const { getAuthHeader } = useAuth();

  const { mutateAsync: updateProfileImage, isPending } = useMutation({
    mutationFn: async (imageBase64: string) => {
      if (!userId) throw new Error("User ID is required");
      console.log(imageBase64);

      const response = await axios.put(
        `http://localhost:8080/api/v1/users/${userId}/image`,
        imageBase64,
        {
          headers: getAuthHeader(),
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return { updateProfileImage, isUploading: isPending };
};
