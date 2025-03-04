import { useChallenges } from "@/hooks/challenges/useChallenges";
import React from "react";
import { ChallengeForm } from "./components/challengeForm";
import { ChallengeCard } from "./components/challengeCard";
import { useParams } from "@remix-run/react";
import { useUserId } from "@/hooks/user/useUserId";
import { useProfile } from "@/hooks/user/useProfile";
import { hasAccess, isSameUser } from "@/utils/authorization";

const ChallengesPage: React.FC = () => {
  const { userId } = useParams();
  const { profile } = useProfile(Number(userId));
  const numericUserId = userId ? Number(userId) : null;
  const { challenges, isLoading, isForbidden } = useChallenges(Number(userId));
  const loggedUserId = useUserId();
  const { profile: loggedUser } = useProfile(loggedUserId);

  if (numericUserId === null) {
    return <p>Error: Invalid user ID</p>;
  }

  if (isLoading) return <p>Loading...</p>;
  if (isForbidden) return <p>Access Denied</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>
      {hasAccess(Number(userId), loggedUser) && (
        <ChallengeForm userId={Number(userId)} loggedUser={loggedUser} />
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">
        {isSameUser(Number(userId), loggedUser)
          ? "Your Challenges"
          : `${profile?.name}'s Challenges`}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges?.map((challenge) => {
          if (!challenge.id) {
            return null;
          }

          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              userId={numericUserId}
              loggedUser={loggedUser}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesPage;
