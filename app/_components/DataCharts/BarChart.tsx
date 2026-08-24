"use client";

import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartDataPoint } from "./chart";
import CustomTooltip from "./CustomTooltip";

type Props = {
  data: ChartDataPoint[];
};

//parses an ISO date at local midnight (avoids the UTC off-by-one shift)
function formatTick(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function BarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart
        data={data}
        margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatTick}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tick={{ fontSize: 9 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
        />
        <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
