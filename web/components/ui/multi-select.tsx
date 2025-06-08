"use client";

import { cn } from "#lib/utils";
import { IconCheck, IconX } from "@tabler/icons-react";
import * as React from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

export interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxSelected?: number;
  className?: string;
  badgeClassName?: string;
  /**
   * Whether to show selected items as badges
   * @default true
   */
  showBadges?: boolean;
  /**
   * Whether to show the clear button when items are selected
   * @default true
   */
  showClear?: boolean;
  /**
   * Custom render function for the trigger button content
   */
  renderTrigger?: (value: string[]) => React.ReactNode;
  /**
   * Custom render function for the option items
   */
  renderOption?: (option: Option, isSelected: boolean) => React.ReactNode;
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select items...",
  disabled = false,
  searchPlaceholder = "Search items...",
  emptyMessage = "No results found.",
  maxSelected,
  className,
  badgeClassName,
  showBadges = true,
  showClear = true,
  renderTrigger,
  renderOption,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabels = value
    .map((val) => options.find((opt) => opt.value === val)?.label)
    .filter(Boolean) as string[];

  const handleSelect = (optionValue: string) => {
    if (!onValueChange) return;

    const isSelected = value.includes(optionValue);
    let newValue: string[];

    if (isSelected) {
      newValue = value.filter((val) => val !== optionValue);
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      newValue = [...value, optionValue];
    }

    onValueChange(newValue);
  };

  const handleClear = () => {
    onValueChange?.([]); 
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {renderTrigger ? (
            renderTrigger(value)
          ) : showBadges && selectedLabels.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedLabels.map((label) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className={cn("mr-1 mb-1", badgeClassName)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">
              {selectedLabels.length > 0
                ? `${selectedLabels.length} selected`
                : placeholder}
            </span>
          )}
          <IconX
            className={cn(
              "ml-2 h-4 w-4 shrink-0 opacity-50",
              selectedLabels.length === 0 && "hidden"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    disabled={option.disabled}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {renderOption ? (
                      renderOption(option, isSelected)
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <IconCheck
                          className={cn(
                            "h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          {option.description && (
                            <span className="text-sm text-muted-foreground">
                              {option.description}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {showClear && value.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-rose-500"
                  >
                    Clear all ({value.length})
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 