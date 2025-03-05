import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "@/api/initializeApi";

export const useUpdateProfileImage = (userId?: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfileImage, isPending } = useMutation({
    mutationFn: async (imageBase64: string) => {
      if (!userId) throw new Error("User ID is required");

      const response = await apis().user.updateProfileImage(
        userId,
        imageBase64,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return { updateProfileImage, isUploading: isPending };
};
