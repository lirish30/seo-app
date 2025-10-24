"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { format } from "date-fns";

interface BacklinkTrendChartProps {
  data: Array<{
    date: string;
    total: number;
    newLinks: number;
    lostLinks: number;
  }>;
}

export function BacklinkTrendChart({ data }: BacklinkTrendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            fill="url(#colorTotal)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="newLinks"
            stroke="hsl(var(--secondary))"
            fill="hsl(var(--secondary))"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="lostLinks"
            stroke="hsl(var(--destructive))"
            fill="hsl(var(--destructive))"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
