import React from "react";
import { ChallengeForm } from "./components/challengeForm";
import { ChallengeCard } from "./components/challengeCard";
import { useParams } from "@remix-run/react";
import { useUser } from "@/hooks/user/useUser";
import { useChallenges } from "@/hooks/challenges/useChallenges";
import { useUserAccess } from "@/hooks/user/useUserAccess";

const ChallengesPage: React.FC = () => {
  const { userId } = useParams();
  const { profile, isCurrentUser } = useUser(Number(userId));
  const { challenges, isLoading, isForbidden } = useChallenges(Number(userId));
  const { canModifyChallenges } = useUserAccess(Number(userId));

  if (isLoading) return <p>Loading...</p>;
  if (isForbidden) return <p>Access Denied</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>
      {canModifyChallenges && <ChallengeForm userId={Number(userId)} />}
      <h2 className="text-xl font-bold mt-8 mb-4">
        {isCurrentUser ? "Your Challenges" : `${profile?.name}'s Challenges`}
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
              userId={Number(userId)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesPage;
