import { useChallenges } from "@/hooks/challenges/useChallenges";
import React from "react";
import { ChallengeForm } from "./components/challengeForm";
import { ChallengeCard } from "./components/challengeCard";
import { useParams } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ChallengesPage: React.FC = () => {
  const { userId } = useParams();
  const numericUserId = userId ? Number(userId) : null;
  const { challenges, isLoading } = useChallenges(Number(userId));

  if (numericUserId === null) {
    return <p>Error: Invalid user ID</p>;
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>
      <QueryClientProvider client={queryClient}>
        <ChallengeForm userId={Number(userId)} />
      </QueryClientProvider>

      <h2 className="text-xl font-bold mt-8 mb-4">Your Challenges</h2>
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesPage;
