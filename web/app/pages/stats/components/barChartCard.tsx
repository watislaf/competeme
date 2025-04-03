import { BarChart } from "web/app/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "web/app/components/ui/card";
import React from "react";
import { StatsResponse } from "web/app/api";
import { useUser } from "web/app/hooks/user/useUser";

type BarChartCardProps = {
  stats?: StatsResponse;
  color: string;
  userId: number;
};

export const BarChartCard: React.FC<BarChartCardProps> = ({
  stats,
  color,
  userId,
}) => {
  const { profile, isCurrentUser } = useUser(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>
          {isCurrentUser
            ? "Your activity over the past week"
            : `${profile?.name}'s activity over the past week`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <BarChart
          data={
            stats?.weeklyStats
              ? stats.weeklyStats.map((stat) => ({
                  dayOfWeek: stat.dayOfWeek,
                  time: stat.duration,
                }))
              : []
          }
          index="dayOfWeek"
          categories={["time"]}
          colors={[color]}
          valueFormatter={(value: number) => `${value.toFixed(1)}h`}
          yAxisWidth={48}
        />
      </CardContent>
    </Card>
  );
};
