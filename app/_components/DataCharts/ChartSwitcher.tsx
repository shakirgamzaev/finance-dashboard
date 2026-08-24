"use client";

import { useState } from "react";
import { ChartArea, ChartColumn, ChartLine, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Chart, { type ChartDataPoint } from "./chart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

type ChartType = "area" | "line" | "bar";

const OPTIONS: {
  type: ChartType;
  label: string;
  Icon: typeof ChartArea;
}[] = [
  { type: "area", label: "Area chart", Icon: ChartArea },
  { type: "line", label: "Line chart", Icon: ChartLine },
  { type: "bar", label: "Bar chart", Icon: ChartColumn },
];

type Props = {
  data: ChartDataPoint[];
};

export default function ChartSwitcher({ data }: Props) {
  const [type, setType] = useState<ChartType>("area");
  const current = OPTIONS.find((o) => o.type === type) ?? OPTIONS[0];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Transactions</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm">
            <current.Icon className="size-4" />
            {current.label}
            <ChevronDown className="size-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.type}
                onClick={() => setType(option.type)}
              >
                <option.Icon className="size-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {type === "area" && <Chart data={data} />}
      {type === "line" && <LineChart data={data} />}
      {type === "bar" && <BarChart data={data} />}
    </>
  );
}
