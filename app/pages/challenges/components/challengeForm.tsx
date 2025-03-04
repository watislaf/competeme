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
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import type { ChallengeRequest } from "@/api";
import { apis } from "@/api/initializeApi";
import { useQuery } from "@tanstack/react-query";
import { FriendSearchDropdown } from "./FriendSearchDropdown";

const challengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  goal: z.number().positive("Goal must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  participants: z.array(z.number()).optional(),
});

export interface FriendOption {
  id: number;
  name: string;
  imageUrl?: string;
}

interface ChallengeFormProps {
  onSubmit: (data: ChallengeRequest) => void;
  addError?: Error | null;
  userId: number;
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const friendIdsQuery = useQuery({
    queryKey: ["friendIds", userId],
    queryFn: async () => {
      const response = await apis().friends.getFriends(userId);
      if (response.status !== 200) {
        throw new Error(`Error fetching friends: ${response.statusText}`);
      }
      return response.data as number[];
    },
    enabled: !!userId,
  });

  const friendProfilesQuery = useQuery({
    queryKey: ["friendProfiles", friendIdsQuery.data],
    queryFn: async () => {
      if (!friendIdsQuery.data) return [];

      const friendProfiles = await Promise.all(
        friendIdsQuery.data.map(async (id) => {
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

      return friendProfiles.filter(Boolean) as FriendOption[];
    },
    enabled: !!friendIdsQuery.data && friendIdsQuery.data.length > 0,
  });

  const isLoading = friendIdsQuery.isLoading || friendProfilesQuery.isLoading;
  const loadError = friendIdsQuery.error || friendProfilesQuery.error;
  const friends = friendProfilesQuery.data || [];

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
