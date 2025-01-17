import { Clock } from "lucide-react";
import { icons } from "./icons";

export const getIconComponent = (iconName: string) => {
  const iconItem = icons.find((icon) => icon.type === iconName);
  const IconComponent = iconItem?.icon || Clock;
  return <IconComponent />;
};
