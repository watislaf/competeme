import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@remix-run/react";
import { UserProfileResponse } from "@/api/models";
import { isSameUser } from "@/utils/authorization";

interface LeaderboardProps {
  leaderboard: { userId: number; score: number }[];
  profiles: { id: number; name: string; imageUrl?: string }[] | undefined;
  loggedUser?: UserProfileResponse;
  isLoading: boolean;
  unit?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  profiles,
  loggedUser,
  isLoading,
}) => {
  return (
    <div className="w-full">
      <h4 className="font-semibold mb-2">Leaderboard</h4>
      {isLoading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <ul className="space-y-2">
          {leaderboard?.map((entry, index) => {
            const profile = profiles?.find((p) => p.id === entry.userId);

            return (
              <li
                key={index}
                className="flex items-center justify-between space-x-3"
              >
                {profile ? (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={profile.imageUrl} alt={profile.name} />
                      <AvatarFallback>
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        to={`/users/${profile.id}/profile`}
                        className="font-medium hover:underline"
                      >
                        {isSameUser(profile.id, loggedUser)
                          ? "YOU"
                          : profile.name}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <span>Unknown User</span>
                )}
                <span> {entry.score || 0} </span>
              </li>
            );
          }) || <p>No leaderboard data available</p>}
        </ul>
      )}
    </div>
  );
};
