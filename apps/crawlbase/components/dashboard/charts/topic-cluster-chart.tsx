"use client";

import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid
} from "recharts";

interface TopicClusterChartProps {
  data: Array<{
    cluster: string;
    x: number;
    y: number;
    size: number;
  }>;
}

export function TopicClusterChart({ data }: TopicClusterChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="x" name="Relevance" domain={[0, 100]} />
          <YAxis dataKey="y" name="Traffic Potential" domain={[0, 100]} />
          <ZAxis dataKey="size" range={[80, 400]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name="Topic Clusters"
            data={data}
            fill="hsl(var(--primary))"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
