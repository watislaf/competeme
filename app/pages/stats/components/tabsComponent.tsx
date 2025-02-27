import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartCard } from "./barChartCard";
import { LineChartCard } from "./lineChartCard";
import React from "react";
import { StatsResponse } from "@/api/models";

type TabsComponentProps = {
  stats?: StatsResponse;
};

const TabsComponent: React.FC<TabsComponentProps> = ({ stats }) => {
  return (
    <Tabs defaultValue="weekly" className="w-full mb-8">
      <TabsList>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <TabsContent value="weekly">
        <BarChartCard stats={stats} />
      </TabsContent>

      <TabsContent value="monthly">
        <LineChartCard stats={stats} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsComponent;
