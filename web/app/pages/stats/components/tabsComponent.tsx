import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "web/app/components/ui/tabs";
import { BarChartCard } from "./barChartCard";
import { LineChartCard } from "./lineChartCard";
import React from "react";
import { StatsResponse } from "web/app/api";

type TabsComponentProps = {
  stats?: StatsResponse;
  chartColor: string;
  userId: number;
};

const TabsComponent: React.FC<TabsComponentProps> = ({
  stats,
  chartColor,
  userId,
}) => {
  return (
    <Tabs defaultValue="weekly" className="w-full mb-8">
      <TabsList>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <TabsContent value="weekly">
        <BarChartCard stats={stats} color={chartColor} userId={userId} />
      </TabsContent>

      <TabsContent value="monthly">
        <LineChartCard stats={stats} color={chartColor} userId={userId} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsComponent;
