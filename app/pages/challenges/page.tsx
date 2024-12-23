import { useChallenges } from "@/hooks/challenges/useChallenges";
import React, { useState } from "react";
import { useAddChallengeMutation } from "./hooks/useAddChallengeMutation";
import { useUpdateProgressMutation } from "./hooks/useUpdateProgressMutation";
import { ChallengeForm } from "./components/challengeForm";
import { ChallengeCard } from "./components/challengeCard";
import { useParams } from "@remix-run/react";

const ChallengesPage: React.FC = () => {
  const { userId } = useParams();
  const { challenges, isLoading} = useChallenges(Number(userId));
  const { mutate: addChallenge, error: addError } = useAddChallengeMutation();
  const { mutate: updateProgress, error: updateError } = useUpdateProgressMutation();
  const [progressValues, setProgressValues] = useState<Record<string, number>>({});

  const handleProgressChange = (id: string, value: number) => {
    setProgressValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateProgress = (challengeId: string) => {
    if (progressValues[challengeId] !== undefined) {
      updateProgress({
        userId,
        challengeId,
        progress: progressValues[challengeId]
      });
      setProgressValues((prev) => ({ ...prev, [challengeId]: 0 }));
    }
  };

  const handleAddChallenge = (data: {
    title: string;
    description: string;
    goal: number;
    unit: string;
    participants?: string[];
  }) => {
    addChallenge({
      userId,
      challengeRequest: data,
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ChallengeForm onSubmit={handleAddChallenge} addError={addError}/>
        {challenges.map((challenge) => (
            <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onProgressChange={handleProgressChange}
                onUpdateProgress={handleUpdateProgress}
                progressValue={progressValues[challenge.id] || ""}
                updateError={updateError}
            />
        ))}
      </div>
  );
};

export default ChallengesPage;