import { useEffect, useState } from "react";
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

export default function DashboardPage() {
  const [selectedRecipe, setSelectedRecipe] = useState("All Recipes");
  const [apiData, setApiData] = useState<DrinkData[]>([]);

  useEffect(() => {
    fetch("http://api.odensebartech.com/api/v1/action-logs/stats")
      .then((res) => res.json())
      .then((data) => {
        // Add a `total` field for each row
        const withTotal = data.map((entry: DrinkData) => {
          const total = Object.entries(entry).reduce((sum, [key, value]) => {
            if (key !== "hour" && typeof value === "number") {
              return sum + (value as number);
            }
            return sum;
          }, 0);
          return { ...entry, total };
        });
        setApiData(withTotal);
      })
      .catch((err) => console.error("Failed to fetch chart data:", err));
  }, []);

  const getValue = (d: DrinkData): number => {
    if (selectedRecipe === "All Recipes")
      return typeof d.total === "number" ? d.total : 0;
    const key = selectedRecipe.replace(/ /g, "").replace("&", "");
    return typeof d[key] === "number" ? (d[key]! as number) : 0;
  };

  const getLineChartOption = () => ({
    tooltip: { trigger: "axis" },
    legend: { data: ["Drinks"] },
    xAxis: { type: "category", data: apiData.map((d) => d.hour) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Drinks",
        type: "line",
        data: apiData.map(getValue),
        smooth: true,
        areaStyle: {},
      },
    ],
  });

  const getBarChartOption = () => ({
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: apiData.map((d) => d.hour) },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: apiData.map(getValue),
        itemStyle: { color: "#21C9AB" },
      },
    ],
  });

  const getPieChartOption = () => {
    const totals: { [key: string]: number } = {};

    apiData.forEach((d) => {
      for (const key in d) {
        if (key !== "hour" && key !== "total") {
          totals[key] = (totals[key] ?? 0) + (d[key] as number);
        }
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
