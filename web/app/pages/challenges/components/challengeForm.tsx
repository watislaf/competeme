import { Button } from "web/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "web/app/components/ui/card";
import { Input } from "web/app/components/ui/input";
import { Label } from "web/app/components/ui/label";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { FriendSearchDropdown } from "./FriendSearchDropdown";
import { challengeSchema } from "../utils/challengeSchema";
import { useAddChallengeMutation } from "../hooks/useAddChallengeMutation";
import { useFriendQueries } from "../hooks/useFriendQueries";
import lodash from "lodash";
import { useUser } from "web/app/hooks/user/useUser";
import { ChallengeRequest } from "web/app/api";

export interface FriendOption {
  id: number;
  name: string;
  imageUrl?: string;
}

interface ChallengeFormProps {
  userId: number;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    unit: "",
  });
  const [invitedFriends, setInvitedFriends] = useState<FriendOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { profile, isCurrentUser } = useUser(userId);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSetSearchTerm = useRef(
    lodash.debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
  ).current;

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);

    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [searchTerm, debouncedSetSearchTerm]);

  const { isLoading, loadError, friends } = useFriendQueries(userId);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
      !invitedFriends.some((invited) => invited.id === friend.id),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { mutate: addChallenge, error: addError } = useAddChallengeMutation();

  const handleAddChallenge = (data: ChallengeRequest) => {
    addChallenge({
      userId: Number(userId),
      challengeRequest: data,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFriend = (friend: FriendOption) => {
    setInvitedFriends((prev) => [...prev, friend]);
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleRemoveFriend = (id: number) => {
    setInvitedFriends((prev) => prev.filter((friend) => friend.id !== id));
  };

  const handleSubmit = () => {
    const parsedGoal = Number(formData.goal);
    const validationData = {
      ...formData,
      goal: parsedGoal,
      participants: invitedFriends.map((friend) => friend.id),
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
    handleAddChallenge(validationData);
    setFormData({ title: "", description: "", goal: "", unit: "" });
    setInvitedFriends([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Challenge</CardTitle>
        <CardDescription>
          {isCurrentUser
            ? "Set up a new challenge for yourself and others!"
            : `Set up a new challenge for ${profile?.name} and others!`}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {errors.title && <p className="text-red-500">{errors.title}</p>}
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
              <p className="text-red-500">{errors.description}</p>
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
              {errors.goal && <p className="text-red-500">{errors.goal}</p>}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              />
              {errors.unit && <p className="text-red-500">{errors.unit}</p>}
            </div>
          </div>
          <div className="space-y-2" ref={searchRef}>
            <Label>Invite Friends</Label>
            <div className="relative">
              <Input
                placeholder="Search for friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onClick={() => setIsSearchOpen(true)}
                disabled={isLoading}
              />

              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <FriendSearchDropdown
                isSearchOpen={isSearchOpen}
                isLoading={isLoading}
                loadError={loadError}
                filteredFriends={filteredFriends}
                handleAddFriend={handleAddFriend}
              />
            </div>
            {invitedFriends.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-2">Invited Friends:</h4>
                <ul className="space-y-1">
                  {invitedFriends.map((friend) => (
                    <li
                      key={friend.id}
                      className="flex justify-between items-center p-2 bg-secondary/30 rounded-md"
                    >
                      <span>{friend.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Create a challenge
          </Button>
          {addError && (
            <p className="text-red-500">Error: {addError.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
