"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { format } from "date-fns";

interface KeywordPositionChartProps {
  data: Array<{
    date: string;
    position: number;
  }>;
}

export function KeywordPositionChart({ data }: KeywordPositionChartProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), "MMM d")}
          />
          <YAxis
            reversed
            allowDecimals={false}
            label={{ value: "SERP Position", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number) => `Position ${value}`}
            labelFormatter={(value) =>
              format(new Date(value), "EEEE, MMM d yyyy")
            }
          />
          <Line
            type="monotone"
            dataKey="position"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
