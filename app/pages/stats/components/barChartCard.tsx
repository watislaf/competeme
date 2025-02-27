import { BarChart } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { StatsResponse } from "@/api/models";

type BarChartCardProps = {
  stats?: StatsResponse;
};

export const BarChartCard: React.FC<BarChartCardProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>Your activity over the past week</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <BarChart
          data={
            stats?.weeklyStats
              ? Object.entries(stats.weeklyStats).map(([day, time]) => ({
                  day,
                  time,
                }))
              : []
          }
          index="day"
          categories={["time"]}
          colors={["hsl(var(--chart-1))"]}
          valueFormatter={(value: number) => `${value.toFixed(1)}h`}
          yAxisWidth={48}
        />
      </CardContent>
    </Card>
  );
};
