import { PieChart } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { StatsResponse } from "@/api/models";

type ActivityBreakdownProps = {
  stats: StatsResponse;
};

const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({ stats }) => {
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
            colors={["black"]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityBreakdown;
