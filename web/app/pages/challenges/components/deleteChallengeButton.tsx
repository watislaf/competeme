import React from "react";
import { useDeleteChallengeMutation } from "../hooks/useDeleteChallengeMutation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChallengeResponse } from "@/api";

interface DeleteChallengeButtonProps {
  userId: number;
  challenge: ChallengeResponse;
}

export const DeleteChallengeButton: React.FC<DeleteChallengeButtonProps> = ({
  userId,
  challenge,
}) => {
  const { mutate: deleteChallenge, error: deleteError } =
    useDeleteChallengeMutation();

  const handleDelete = () => {
    deleteChallenge({ userId, challengeId: challenge.id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="border-2 border-red-500 text-red-500 ml-4 px-4 py-1 rounded-lg transition-all duration-200 hover:bg-red-500 hover:text-white">
          Delete Challenge
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex-col items-center justify-center text-center">
        <p className="mb-4">
          Are you sure you want to delete <strong>{challenge.title}</strong>?
        </p>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Yes
        </button>
        {deleteError && (
          <p className="text-red-500 mt-2">
            Error deleting challenge: {deleteError.message}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
};
