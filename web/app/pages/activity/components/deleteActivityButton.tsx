import React from "react";
import { Button } from "web/app/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteActivityMutation } from "../hooks/useDeleteActivityMutation";

interface deleteActivityButtonProps {
  activityId: number;
  userId: number;
}

const DeleteActivityButton: React.FC<deleteActivityButtonProps> = ({
  activityId,
  userId,
}) => {
  const { mutate: deleteActivity, error: deleteError } =
    useDeleteActivityMutation();

  const handleDeleteActivity = (activityId: number) => {
    deleteActivity({ userId, activityId });
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => handleDeleteActivity(activityId)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
      {deleteError && (
        <p className="text-red-500">
          Error deleting activity: {deleteError.message}
        </p>
      )}
    </>
  );
};

export default DeleteActivityButton;
