import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { ChallengeRequest } from "@/api";
import { apis } from "@/api/initializeApi";

const challengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  goal: z.number().positive("Goal must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  participants: z.array(z.number()).optional(),
});

interface FriendOption {
  id: number;
  name: string;
}

interface ChallengeFormProps {
  onSubmit: (data: ChallengeRequest) => void;
  addError?: Error | null;
  userId: number; // Added userId prop to fetch friends
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  onSubmit,
  addError,
  userId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    unit: "",
  });
  const [invitedFriends, setInvitedFriends] = useState<FriendOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // State for friends data and loading
  const [friends, setFriends] = useState<FriendOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch friends from the API
  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await apis().friends.getFriends(userId);
        if (response.status !== 200) {
          throw new Error(`Error fetching friends: ${response.statusText}`);
        }

        const friendIds: number[] = await response.data;
        const friendProfiles = await Promise.all(
          friendIds.map(async (id) => {
            try {
              const profileResponse = await apis().user.getUserProfile(id);
              return {
                id: profileResponse.data.id,
                name: profileResponse.data.name,
                imageUrl: profileResponse.data.imageUrl,
              };
            } catch (error) {
              console.error(`Failed to fetch profile for user ${id}:`, error);
              return null;
            }
          }),
        );

        setFriends(friendProfiles.filter(Boolean) as FriendOption[]);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load friends",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
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
    onSubmit(validationData);
    setFormData({ title: "", description: "", goal: "", unit: "" });
    setInvitedFriends([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Challenge</CardTitle>
        <CardDescription>
          Set up a new challenge for yourself and others!
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
                placeholder="e.g., hours, books"
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

              {isSearchOpen && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {loadError ? (
                    <div className="p-2 text-sm text-red-500">{loadError}</div>
                  ) : filteredFriends.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      {isLoading ? "Loading friends..." : "No friends found"}
                    </div>
                  ) : (
                    <ul>
                      {filteredFriends.map((friend) => (
                        <li
                          key={friend.id}
                          className="px-3 py-2 cursor-pointer hover:bg-secondary/50"
                          onClick={() => handleAddFriend(friend)}
                        >
                          {friend.name} (ID: {friend.id})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
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
                      <span>
                        {friend.name} (ID: {friend.id})
                      </span>
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
