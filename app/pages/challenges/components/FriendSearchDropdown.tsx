import React from "react";
import { FriendOption } from "./challengeForm";

interface FriendSearchDropdownProps {
  isSearchOpen: boolean;
  isLoading: boolean;
  loadError: Error | null;
  filteredFriends: FriendOption[];
  handleAddFriend: (friend: FriendOption) => void;
}

export const FriendSearchDropdown: React.FC<FriendSearchDropdownProps> = ({
  isSearchOpen,
  isLoading,
  loadError,
  filteredFriends,
  handleAddFriend,
}) => {
  if (!isSearchOpen) return null;

  return (
    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
      {loadError ? (
        <div className="p-2 text-sm text-red-500">
          {loadError ? loadError.message : "Failed to load friends"}
        </div>
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
  );
};
