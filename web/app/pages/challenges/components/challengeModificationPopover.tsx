import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "web/app/components/ui/popover";
import { Button } from "web/app/components/ui/button";
import { Label } from "web/app/components/ui/label";
import { Pencil } from "lucide-react";
import { Input } from "web/app/components/ui/input";
import { challengeSchema } from "../utils/challengeSchema";
import { useModifyChallengeMutation } from "../hooks/useModifyChallengeMutation";
import { DeleteChallengeButton } from "./deleteChallengeButton";
import { ChallengeModificationRequest, ChallengeResponse } from "web/app/api";

interface ModificationPopoverProps {
  userId: number;
  challenge: ChallengeResponse;
}

export const ChallengeModificationPopover: React.FC<
  ModificationPopoverProps
> = ({ userId, challenge }) => {
  const [newParticipant, setNewParticipant] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);

  const { mutate: modifyChallenge, error: modificationError } =
    useModifyChallengeMutation();

  const [formData, setFormData] = useState({
    title: challenge.title,
    description: challenge.description,
    goal: challenge.goal,
    unit: challenge.unit,
  });

  const participants = challenge.participants.map(
    (participant) => participant.username,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddParticipant = () => {
    const trimmedParticipant = newParticipant.trim();
    const isAlreadyParticipating = participants.includes(trimmedParticipant);
    if (
      trimmedParticipant &&
      !isAlreadyParticipating &&
      !invitedFriends.includes(trimmedParticipant)
    ) {
      setInvitedFriends((prev) => [...prev, trimmedParticipant]);
      setNewParticipant("");
    } else if (
      isAlreadyParticipating ||
      invitedFriends.includes(trimmedParticipant)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        participants: "This participant is already on the list.",
      }));
    }
  };

  const handleModification = (data: ChallengeModificationRequest) => {
    modifyChallenge({
      userId: Number(userId),
      challengeId: challenge.id,
      challengeModificationRequest: data,
    });
  };

  const handleSubmit = () => {
    const parsedGoal = Number(formData.goal);
    const validationData = {
      ...formData,
      goal: parsedGoal,
      participants: invitedFriends,
    };
    const result = challengeSchema.safeParse(validationData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    handleModification(validationData);
    setInvitedFriends([]);
  };

  const handleRemoveFriend = (friend: string) => {
    setInvitedFriends((prev) => prev.filter((f) => f !== friend));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="p-2 rounded-full">
          <Pencil size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Challenge Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                value={formData.goal}
                onChange={handleChange}
                required
              />
              {errors.goal && (
                <p className="text-red-500 text-sm">{errors.goal}</p>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                name="unit"
                placeholder="e.g., hours, books"
                value={formData.unit}
                onChange={handleChange}
                required
              />
              {errors.unit && (
                <p className="text-red-500 text-sm">{errors.unit}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Participants</Label>
            <div className="flex space-x-2">
              <Input
                id="new-participant"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
              />
              <Button type="button" onClick={handleAddParticipant}>
                Add
              </Button>
            </div>
            {invitedFriends.length > 0 && (
              <ul className="mt-2 space-y-1">
                {invitedFriends.map((friend) => (
                  <li
                    key={friend}
                    className="flex justify-between items-center"
                  >
                    <span>{friend}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveFriend(friend)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.participants && (
            <p className="text-red-500 text-sm">{errors.participants}</p>
          )}
          <div className="flex justify-between">
            <Button onClick={handleSubmit}>Save</Button>
            {modificationError && (
              <p className="text-red-500">
                Error modifying challenge: {modificationError.message}
              </p>
            )}
            <DeleteChallengeButton userId={userId} challenge={challenge} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
