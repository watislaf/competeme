import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Challenge {
    id: string;
    title: string;
    description: string;
    totalProgress: number;
    goal: number;
    unit: string;
    leaderboard: { name: string; score: number }[];
}

interface ChallengeCardProps {
    challenge: Challenge;
    onProgressChange: (id: string, value: number) => void;
    onUpdateProgress: (id: string) => void;
    progressValue: number | string;
    updateError?: { message: string };
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({challenge, onProgressChange, onUpdateProgress, progressValue, updateError,}) => (
    <Card>
        <CardHeader>
            <CardTitle>{challenge.title}</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Progress</span>
                    <span>
            {challenge.totalProgress} / {challenge.goal} {challenge.unit}
          </span>
                </div>
                <Progress value={(challenge.totalProgress / challenge.goal) * 100} />
            </div>
        </CardContent>
        <CardContent>
            <div className="w-full">
                <h4 className="font-semibold mb-2">Leaderboard</h4>
                <ul className="space-y-1">
                    {challenge.leaderboard.map((entry, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span>{entry.name}</span>
                            <span>
                {entry.score} {challenge.unit}
              </span>
                        </li>
                    ))}
                </ul>
            </div>
        </CardContent>
        <CardFooter>
            <div className="w-full">
                <h4 className="font-semibold mb-2">Update Progress</h4>
                <div className="flex space-x-2 items-center">
                    <Input
                        type="number"
                        value={progressValue}
                        onChange={(e) => onProgressChange(challenge.id, Number(e.target.value))}
                        placeholder="Enter progress"
                    />
                    <Button onClick={() => onUpdateProgress(challenge.id)}>Update</Button>
                </div>
                {updateError && <p className="text-red-500 mt-2">Error: {updateError.message}</p>}
            </div>
        </CardFooter>
    </Card>
);
