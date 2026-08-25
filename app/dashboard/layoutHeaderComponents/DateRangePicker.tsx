"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

//formats a Date as YYYY-MM-DD from local parts (avoids the UTC day shift)
function toLocalISODate(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function formatDisplay(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DateRangePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(() =>
    from && to
      ? {
          from: new Date(`${from}T00:00:00`),
          to: new Date(`${to}T00:00:00`),
        }
      : undefined,
  );

  //only range-aware pages show the picker
  const RANGE_AWARE_ROUTES = ["/dashboard/overview", "/dashboard/transactions"];
  if (!RANGE_AWARE_ROUTES.includes(pathname)) return null;

  //a real range has two distinct picked ends
  const hasFullRange =
    !!range?.from && !!range?.to && range.from.getTime() !== range.to.getTime();

  function applyRange() {
    if (!range?.from || !range?.to) return;
    const params = new URLSearchParams(searchParams);
    params.set("from", toLocalISODate(range.from));
    params.set("to", toLocalISODate(range.to));
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  const label =
    range?.from && range?.to
      ? `${formatDisplay(range.from)} - ${formatDisplay(range.to)}`
      : "Last 30 days";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-2 rounded-md bg-white/90 border border-white px-3 py-1.5 text-[13px] text-gray-900 hover:bg-white">
        <CalendarIcon className="size-4" />
        {label}
        <ChevronDown className="size-4 opacity-70" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          defaultMonth={range?.from ?? new Date()}
        />
        <div className="flex justify-end gap-2 border-t border-gray-100 p-2">
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100"
            onClick={() => setRange(undefined)}
          >
            Clear
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-700 px-3 py-1.5 text-[13px] text-white hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none"
            disabled={!hasFullRange}
            onClick={applyRange}
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
