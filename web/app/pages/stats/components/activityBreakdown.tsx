import React from "react";
import { StatsResponse } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart } from "@/components/ui/chart";

type ActivityBreakdownProps = {
  stats?: StatsResponse;
  colors: string[];
};

const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({
  stats,
  colors,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Breakdown</CardTitle>
        <CardDescription>Time spent on each activity</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="h-[300px] w-[300px]">
          <PieChart
            data={stats?.activityBreakdown || []}
            index="activityName"
            category="duration"
            valueFormatter={(value: number) => `${value.toFixed(1)}h`}
            colors={colors}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityBreakdown;
