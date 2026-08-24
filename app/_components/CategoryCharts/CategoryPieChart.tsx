"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type CategorySlice = {
  //category name, e.g. "Groceries"
  name: string;
  //total spent in that category (positive magnitude)
  value: number;
};

type Props = {
  data: CategorySlice[];
};

const COLORS = [
  "#3b82f6",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#64748b",
];

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CategoryPieChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={4}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend
          verticalAlign="bottom"
          content={({ payload }) => (
            <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 lg:flex-col lg:items-start text-[11px]">
              {payload?.map((entry) => (
                <li key={entry.value} className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.value}
                </li>
              ))}
            </ul>
          )}
        />
      </RePieChart>
    </ResponsiveContainer>
  );
}
