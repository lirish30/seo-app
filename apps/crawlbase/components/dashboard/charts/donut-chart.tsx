"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip
} from "recharts";

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
}

const defaultColors = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--destructive))"
];

export function DonutChart({ data, colors = defaultColors }: DonutChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
