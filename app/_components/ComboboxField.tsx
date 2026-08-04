"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  id: number;
  name: string;
};

type ComboboxFieldProps = {
  gap: number;
  label: string;
  //currently selected option, or null when nothing is picked yet
  value: ComboboxOption | null;
  options: ComboboxOption[];
  onSelect: (option: ComboboxOption) => void;
  //called when the user chooses to create a brand new option from their typed text
  onCreate: (name: string) => Promise<ComboboxOption>;
  placeholderText?: string;
  extraCSS?: string;
};

export default function ComboboxField({
  gap,
  label,
  value,
  options,
  onSelect,
  onCreate,
  placeholderText,
  extraCSS,
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  //text typed into the command search box; drives filtering and the create option
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const trimmed = search.trim();
  const filtered = options.filter((option) =>
    option.name.toLowerCase().includes(trimmed.toLowerCase()),
  );
  const hasExactMatch = options.some(
    (option) => option.name.toLowerCase() === trimmed.toLowerCase(),
  );
  const canCreate = trimmed.length > 0 && !hasExactMatch;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSearch("");
  }

  function selectOption(option: ComboboxOption) {
    onSelect(option);
    handleOpenChange(false);
  }

  async function createOption() {
    if (!canCreate || isCreating) return;
    setIsCreating(true);
    try {
      const created = await onCreate(trimmed);
      selectOption(created);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div
      style={{ gap: `${gap}px` }}
      className={`flex flex-col w-full ${extraCSS ?? ""}`}
    >
      <p className="text-[0.78rem] md:text-[0.9rem]">{label}</p>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between border-[1.4px] border-[rgba(0,0,0,0.1)] font-normal shadow-xs text-[14px]"
            >
              <span className={cn(!value && "text-muted-foreground")}>
                {value ? value.name : (placeholderText ?? "Select an option")}
              </span>
              <ChevronDown className="size-4 shrink-0 opacity-50" />
            </Button>
          }
        />
        <PopoverContent align="start" className="w-(--anchor-width) p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={placeholderText ?? "Search..."}
            />
            <CommandList>
              {filtered.length === 0 && !canCreate && (
                <CommandEmpty>No results.</CommandEmpty>
              )}
              <CommandGroup>
                {filtered.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => selectOption(option)}
                  >
                    {option.name}
                  </CommandItem>
                ))}
                {canCreate && (
                  <CommandItem
                    value={`__create__${trimmed}`}
                    disabled={isCreating}
                    onSelect={createOption}
                    className="text-muted-foreground"
                  >
                    Create "{trimmed}"
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
