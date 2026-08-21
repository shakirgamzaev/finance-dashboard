"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CSV_FIELD_OPTIONS, type CsvField, type CsvMapping } from "./csvImport";

//one column per CSV header; each header is a dropdown mapping it to a payload field
export function getCsvColumns(
  headers: string[],
  mapping: CsvMapping,
  onAssign: (header: string, field: CsvField | null) => void,
): ColumnDef<Record<string, string>>[] {
  return headers.map((header) => ({
    id: header,
    accessorFn: (row) => row[header] ?? "",
    header: () => {
      const mapped = mapping[header] ?? null;
      const mappedLabel = CSV_FIELD_OPTIONS.find(
        (option) => option.value === mapped,
      )?.label;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="px-2 font-medium">
                {header}
                <span
                  className={
                    mappedLabel
                      ? "text-xs font-semibold text-green-600"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {mappedLabel ? `→ ${mappedLabel}` : "Skip"}
                </span>
                <ChevronDown className="size-3.5 opacity-50" />
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onAssign(header, null)}>
              Skip
            </DropdownMenuItem>
            {CSV_FIELD_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onAssign(header, option.value)}
              >
                {option.label}
                {option.required && (
                  <span className="text-xs text-muted-foreground">
                    required
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }));
}
