import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";


interface ChallengeFormProps {
    onSubmit: (data: {
        title: string;
        description: string;
        goal: number;
        unit: string;
        participants?: number[];
    }) => void;
    addError?: Error | null;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({onSubmit, addError,}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        goal: "",
        unit: "",
    });
    const [friendIds, setFriendIds] = useState<string>("");
    const [invitedFriends, setInvitedFriends] = useState<string[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddFriend = () => {
        if (friendIds.trim()) {
            setInvitedFriends((prev) => [...prev, friendIds.trim()]);
            setFriendIds("");
        }
    };

    const handleRemoveFriend = (id: string) => {
        setInvitedFriends((prev) => prev.filter((friend) => friend !== id));
    };

    const handleSubmit = () => {
        onSubmit({
            ...formData,
            goal: Number(formData.goal),
            participants: invitedFriends.map(Number),
        });
        setFormData({ title: "", description: "", goal: "", unit: "" });
        setInvitedFriends([]);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Challenge</CardTitle>
                <CardDescription>Set up a new challenge for yourself and others!</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Challenge Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="goal">Goal</Label>
                            <Input
                                id="goal"
                                name="goal"
                                type="number"
                                value={formData.goal}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="unit">Unit</Label>
                            <Input
                                id="unit"
                                name="unit"
                                placeholder="e.g., hours, books"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="friendIds">Invite Friends (Enter Friend ID)</Label> {/*will change it to username later*/}
                        <div className="flex space-x-2">
                            <Input
                                id="friendIds"
                                name="friendIds"
                                value={friendIds}
                                onChange={(e) => setFriendIds(e.target.value)}
                            />
                            <Button type="button" onClick={handleAddFriend}>
                                Add
                            </Button>
                        </div>
                        {invitedFriends.length > 0 && (
                            <ul className="mt-2 space-y-1">
                                {invitedFriends.map((friend) => (
                                    <li key={friend} className="flex justify-between items-center">
                                        <span>{friend}</span>
                                        <Button type="button" variant="ghost" onClick={() => handleRemoveFriend(friend)}>
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                    >
                        Create a challenge
                    </Button>
                    {addError && <p className="text-red-500">Error: {addError.message}</p>}
                </div>
            </CardContent>
        </Card>
    );
};
