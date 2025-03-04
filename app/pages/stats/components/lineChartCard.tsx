import { LineChart } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { StatsResponse, UserProfileResponse } from "@/api/models";
import { useProfile } from "@/hooks/user/useProfile";
import { isSameUser } from "@/utils/authorization";

type LineChartCardProps = {
  stats?: StatsResponse;
  color: string;
  loggedUser?: UserProfileResponse;
  userId: number;
};

export const LineChartCard: React.FC<LineChartCardProps> = ({
  stats,
  color,
  loggedUser,
  userId,
}) => {
  const { profile } = useProfile(userId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>
          {isSameUser(userId, loggedUser)
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
