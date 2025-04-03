import React, { useState, useEffect } from "react";
import { Button } from "web/app/components/ui/button";
import { Input } from "web/app/components/ui/input";
import { Slider } from "web/app/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "web/app/components/ui/card";
import { Save, Plus, Minus } from "lucide-react";
import { Switch } from "web/app/components/ui/switch";
import { Label } from "web/app/components/ui/label";
import { useUpdateProgressMutation } from "../hooks/useUpdateProgressMutation";

interface ProgressEditorProps {
  initialValue: number;
  maxValue: number;
  userId: number;
  challengeId: number;
}

export const ProgressEditor: React.FC<ProgressEditorProps> = ({
  initialValue,
  maxValue,
  userId,
  challengeId,
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [hasChanges, setHasChanges] = useState(false);
  const [useSlider, setUseSlider] = useState(true);

  const { mutate: updateProgress, error: updateError } =
    useUpdateProgressMutation();

  useEffect(() => {
    setHasChanges(currentValue !== initialValue);
  }, [currentValue, initialValue]);

  const handleValueChange = (newValue: number) => {
    const clampedValue = Math.min(Math.max(0, newValue), maxValue);
    if (clampedValue !== currentValue) {
      setCurrentValue(clampedValue);
    }
  };

  const handleUpdateProgress = (challengeId: number, value: number) => {
    updateProgress({
      userId: Number(userId),
      challengeId,
      progress: value,
    });
  };

  const handleSave = () => {
    handleUpdateProgress(challengeId, currentValue);
    setHasChanges(false);
  };

  const handleIncrement = () => handleValueChange(currentValue + 1);
  const handleDecrement = () => handleValueChange(currentValue - 1);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Progress Editor</CardTitle>
        <div className="flex items-center space-x-2">
          <Label htmlFor="use-slider" className="text-sm">
            Use Slider
          </Label>
          <Switch
            id="use-slider"
            checked={useSlider}
            onCheckedChange={setUseSlider}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {useSlider ? (
          <div className="space-y-4">
            <Slider
              value={[currentValue]}
              max={maxValue}
              step={1}
              onValueChange={(value) => handleValueChange(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0</span>
              <span>{currentValue}</span>
              <span>{maxValue}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={currentValue <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={currentValue}
              onChange={(e) =>
                handleValueChange(Number.parseInt(e.target.value, 10))
              }
              min={0}
              max={maxValue}
              className="w-24 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={currentValue >= maxValue}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">/ {maxValue}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={!hasChanges} className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        {updateError && (
          <p className="text-red-500 mt-2">Error: {updateError.message}</p>
        )}
      </CardFooter>
    </Card>
  );
};
