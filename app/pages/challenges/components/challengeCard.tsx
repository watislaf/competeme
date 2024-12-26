import React from "react";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChallengeResponse} from "@/api/models/challenge-response";

interface ChallengeCardProps {
    challenge: ChallengeResponse;
    onProgressChange: (id: number, value: number) => void;
    onUpdateProgress: (id: number) => void;
    progressValue: number | string;
    updateError?: { message: string };
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({challenge, onProgressChange, onUpdateProgress, progressValue, updateError}) => (
    <Card>
        <CardHeader>
            <CardTitle>{challenge.title || "No title available"}</CardTitle>
            <CardDescription>{challenge.description || "No description available"}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Progress</span>
                    <span>
                        {challenge.totalProgress || 0} / {challenge.goal || 0} {challenge.unit || ""}
                    </span>
                </div>
                <Progress value={(challenge.totalProgress || 0) / (challenge.goal || 1) * 100}/>
            </div>
        </CardContent>
        <CardContent>
            <div className="w-full">
                <h4 className="font-semibold mb-2">Leaderboard</h4>
                <ul className="space-y-1">
                    {challenge.leaderboard?.map((entry, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span>{entry.name || "Unknown"}</span>
                            <span>
                                {entry.score || 0} {challenge.unit || ""}
                            </span>
                        </li>
                    )) || <p>No leaderboard data available</p>}
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
                        onChange={(e) => onProgressChange(challenge.id!, Number(e.target.value))}
                        placeholder="Enter progress"
                    />
                    <Button onClick={() => onUpdateProgress(challenge.id!)}>Update</Button>
                </div>
                {updateError && <p className="text-red-500 mt-2">Error: {updateError.message}</p>}
            </div>
        </CardFooter>
    </Card>
);
