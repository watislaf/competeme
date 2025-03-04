import { BarChart } from "@/components/ui/chart";
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

type BarChartCardProps = {
  stats?: StatsResponse;
  color: string;
  loggedUser?: UserProfileResponse;
  userId: number;
};

export const BarChartCard: React.FC<BarChartCardProps> = ({
  stats,
  color,
  loggedUser,
  userId,
}) => {
  const { profile } = useProfile(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>
          {isSameUser(userId, loggedUser)
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
