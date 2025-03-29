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
              className="px-3 py-2 cursor-pointer hover:bg-secondary/50 flex items-center"
              onClick={() => handleAddFriend(friend)}
            >
              {friend.imageUrl ? (
                <img
                  src={friend.imageUrl}
                  alt={friend.name.charAt(0)}
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary mr-3 flex items-center justify-center text-sm">
                  {friend.name.charAt(0)}
                </div>
              )}
              <span>{friend.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
