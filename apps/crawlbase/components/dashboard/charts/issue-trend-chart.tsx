"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { format } from "date-fns";

interface IssueTrendChartProps {
  data: Array<{
    date: string;
    open: number;
    resolved: number;
  }>;
}

export function IssueTrendChart({ data }: IssueTrendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), "MMM d")}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) =>
              format(new Date(value), "EEEE, MMM d yyyy")
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="open"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
