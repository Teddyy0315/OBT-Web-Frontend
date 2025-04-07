import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockData = [
  { hour: "00:00", total: 3, VodkaSunrise: 1 },
  { hour: "01:00", total: 5, VodkaSunrise: 2 },
  { hour: "02:00", total: 2, VodkaSunrise: 0 },
  { hour: "03:00", total: 0, VodkaSunrise: 0 },
  { hour: "04:00", total: 1, VodkaSunrise: 0 },
  { hour: "05:00", total: 0, VodkaSunrise: 0 },
  { hour: "06:00", total: 2, VodkaSunrise: 1 },
  { hour: "07:00", total: 4, VodkaSunrise: 1 },
  { hour: "08:00", total: 8, VodkaSunrise: 3 },
  { hour: "09:00", total: 9, VodkaSunrise: 4 },
  { hour: "10:00", total: 10, VodkaSunrise: 5 },
];

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
        {/* Drinks Made Per Hour */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Drinks Made Per Hour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={
                  selectedRecipe === "All Recipes" ? "total" : selectedRecipe
                }
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Drinks Made */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Total Drinks Made</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey={
                  selectedRecipe === "All Recipes" ? "total" : selectedRecipe
                }
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
