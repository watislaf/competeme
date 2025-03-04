import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartCard } from "./barChartCard";
import { LineChartCard } from "./lineChartCard";
import React from "react";
import { StatsResponse, UserProfileResponse } from "@/api/models";

type TabsComponentProps = {
  stats?: StatsResponse;
  chartColor: string;
  loggedUser?: UserProfileResponse;
  userId: number;
};

const TabsComponent: React.FC<TabsComponentProps> = ({
  stats,
  chartColor,
  loggedUser,
  userId,
}) => {
  return (
    <Tabs defaultValue="weekly" className="w-full mb-8">
      <TabsList>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <TabsContent value="weekly">
        <BarChartCard
          stats={stats}
          color={chartColor}
          loggedUser={loggedUser}
          userId={userId}
        />
      </TabsContent>

      <TabsContent value="monthly">
        <LineChartCard
          stats={stats}
          color={chartColor}
          loggedUser={loggedUser}
          userId={userId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabsComponent;
