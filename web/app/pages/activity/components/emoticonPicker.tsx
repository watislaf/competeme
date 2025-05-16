import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { icons } from "../utils/icons";
import { Smile } from "lucide-react";
import { ActivityRequestTypeEnum } from "@/api";

interface EmoticonPickerProps {
  onSelect: (activityType: ActivityRequestTypeEnum) => void;
}

const EmoticonPicker: React.FC<EmoticonPickerProps> = ({ onSelect }) => {
  const [selectedEmoticon, setSelectedEmoticon] = useState<string | undefined>(
    undefined,
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleEmoticonClick = (name: string) => {
    setSelectedEmoticon(name);
    setIsOpen(false);
  };

  const SelectedIcon = selectedEmoticon
    ? icons.find((emoticon) => emoticon.type === selectedEmoticon)?.icon
    : null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-10 h-10 p-0">
          {SelectedIcon ? (
            <SelectedIcon className="h-4 w-4" />
          ) : (
            <Smile className="h-4 w-4" />
          )}
          <span className="sr-only">Open emoticon picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Card>
          <CardContent className="p-2">
            <div className="grid grid-cols-5 gap-2">
              {icons.map(({ icon, type }) => (
                <button
                  key={type}
                  className="p-2"
                  onClick={() => {
                    handleEmoticonClick(type);
                    onSelect(type);
                  }}
                >
                  {icon && React.createElement(icon, { className: "h-6 w-6" })}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default EmoticonPicker;
