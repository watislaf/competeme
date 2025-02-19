import { useChallenges } from "@/hooks/challenges/useChallenges";
import React, { useState } from "react";
import { useAddChallengeMutation } from "./hooks/useAddChallengeMutation";
import { useUpdateProgressMutation } from "./hooks/useUpdateProgressMutation";
import { ChallengeForm } from "./components/challengeForm";
import { ChallengeCard } from "./components/challengeCard";
import { useParams } from "@remix-run/react";
import { ChallengeRequest } from "@/api/models/challenge-request";

const ChallengesPage: React.FC = () => {
  const { userId } = useParams();
  const numericUserId = userId ? Number(userId) : null;
  const { challenges, isLoading } = useChallenges(Number(userId));
  const { mutate: addChallenge, error: addError } = useAddChallengeMutation();
  const { mutate: updateProgress, error: updateError } =
    useUpdateProgressMutation();
  const [progressValues, setProgressValues] = useState<Record<number, number>>(
    {},
  );

  const handleProgressChange = (id: number, value: number) => {
    setProgressValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateProgress = (challengeId: number) => {
    if (progressValues[challengeId] !== undefined) {
      updateProgress({
        userId: Number(userId),
        challengeId,
        progress: progressValues[challengeId],
      });
    }
  };

  const handleAddChallenge = (data: ChallengeRequest) => {
    addChallenge({
      userId: Number(userId),
      challengeRequest: data,
    });
  };

  if (numericUserId === null) {
    return <p>Error: Invalid user ID</p>;
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>
      <ChallengeForm onSubmit={handleAddChallenge} addError={addError} />

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
              onProgressChange={handleProgressChange}
              onUpdateProgress={handleUpdateProgress}
              updateError={
                updateError ? { message: updateError.message } : undefined
              }
              userId={numericUserId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesPage;
