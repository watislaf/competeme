import { LineChart } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { StatsResponse } from "@/api/models";
import { useUser } from "@/hooks/user/useUser";

type LineChartCardProps = {
  stats?: StatsResponse;
  color: string;
  userId: number;
};

export const LineChartCard: React.FC<LineChartCardProps> = ({
  stats,
  color,
  userId,
}) => {
  const { profile, isCurrentUser } = useUser(userId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>
          {isCurrentUser
            ? "Your activity over the past month"
            : `${profile?.name}'s activity over the past month`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <LineChart
          data={
            stats?.monthlyStats
              ? stats.monthlyStats.map((stat) => ({
                  week: stat.week,
                  time: stat.duration,
                }))
              : []
          }
          index="week"
          categories={["time"]}
          colors={[color]}
          valueFormatter={(value: number) => `${value.toFixed(1)}h`}
          yAxisWidth={48}
        />
      </CardContent>
    </Card>
  );
};
