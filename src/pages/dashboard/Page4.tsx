import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type for each data point
type DrinkData = {
  hour: string;
  VodkaSunrise: number;
  VodkaSour: number;
  TequilaSunrise: number;
  RumCola: number;
  PeachyBeach: number;
  total?: number;
  [key: string]: string | number | undefined;
};

const recipeList = [
  "All Recipes",
  "VodkaSunrise",
  "Vodka Sour",
  "Tequila Sunrise",
  "Rum & Cola",
  "Peachy Beach",
];

const hours = Array.from(
  { length: 24 },
  (_, i) => i.toString().padStart(2, "0") + ":00"
);

// Generate mock data
const mockData: DrinkData[] = hours.map((hour) => ({
  hour,
  VodkaSunrise: Math.floor(Math.random() * 6),
  VodkaSour: Math.floor(Math.random() * 4),
  TequilaSunrise: Math.floor(Math.random() * 5),
  RumCola: Math.floor(Math.random() * 3),
  PeachyBeach: Math.floor(Math.random() * 4),
}));

mockData.forEach((entry) => {
  entry.total =
    entry.VodkaSunrise +
    entry.VodkaSour +
    entry.TequilaSunrise +
    entry.RumCola +
    entry.PeachyBeach;
});

export default function DashboardPage() {
  const [selectedRecipe, setSelectedRecipe] = useState("All Recipes");

  const getValue = (d: DrinkData): number => {
    if (selectedRecipe === "All Recipes") return d.total ?? 0;

    // Normalize key to match property names
    const key = selectedRecipe.replace(/ /g, "").replace("&", "");
    return typeof d[key] === "number" ? (d[key] as number) : 0;
  };

  const getLineChartOption = () => ({
    tooltip: { trigger: "axis" },
    legend: { data: ["Drinks"] },
    xAxis: { type: "category", data: mockData.map((d) => d.hour) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Drinks",
        type: "line",
        data: mockData.map(getValue),
        smooth: true,
        areaStyle: {},
      },
    ],
  });

  const getBarChartOption = () => ({
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: mockData.map((d) => d.hour) },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: mockData.map(getValue),
        itemStyle: { color: "#21C9AB" },
      },
    ],
  });

  const getPieChartOption = () => {
    const totals: { [key: string]: number } = {
      VodkaSunrise: 0,
      VodkaSour: 0,
      TequilaSunrise: 0,
      RumCola: 0,
      PeachyBeach: 0,
    };

    mockData.forEach((d) => {
      for (const key in totals) {
        totals[key] += d[key] as number;
      }
    });

    return {
      tooltip: { trigger: "item" },
      series: [
        {
          name: "Drink Share",
          type: "pie",
          radius: "60%",
          data: Object.entries(totals).map(([name, value]) => ({
            name,
            value,
          })),
        },
      ],
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Machine Activity Dashboard</h1>
        <Select onValueChange={setSelectedRecipe} defaultValue={selectedRecipe}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a recipe" />
          </SelectTrigger>
          <SelectContent>
            {recipeList.map((recipe) => (
              <SelectItem key={recipe} value={recipe}>
                {recipe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-4">Drinks Per Hour (Line)</h2>
          <ReactECharts option={getLineChartOption()} style={{ height: 300 }} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium mb-4">Drinks Per Hour (Bar)</h2>
          <ReactECharts option={getBarChartOption()} style={{ height: 300 }} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-2">
          <h2 className="text-lg font-medium mb-4">Recipe Distributions</h2>
          <ReactECharts option={getPieChartOption()} style={{ height: 400 }} />
        </div>
      </div>
    </div>
  );
}
