"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

export type ChartDataPoint = {
  //ISO date string (YYYY-MM-DD)
  date: string;
  income: number;
  expenses: number;
};

type Props = {
  data: ChartDataPoint[];
};

//parses an ISO date at local midnight (avoids the UTC off-by-one shift)
function formatTick(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Chart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatTick}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tick={{ fontSize: 11 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#incomeGradient)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          fill="url(#expensesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
