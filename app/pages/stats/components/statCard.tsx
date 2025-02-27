import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type StatCardProps = {
  title: string;
  value: string | undefined;
  description?: string;
  icon: React.ReactNode;
  compareValue?: number;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  compareValue,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {compareValue !== undefined && (
          <p className="text-xs text-muted-foreground">
            {compareValue > 0 ? "+" : "-"} {Math.abs(compareValue).toFixed(1)}h
            from last week
          </p>
        )}
        {description !== undefined && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
