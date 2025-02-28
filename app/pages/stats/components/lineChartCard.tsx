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

type LineChartCardProps = {
  stats?: StatsResponse;
  color: string;
};

export const LineChartCard: React.FC<LineChartCardProps> = ({
  stats,
  color,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Your activity over the past month</CardDescription>
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
