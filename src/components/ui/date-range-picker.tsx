
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "@/types/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateRangePicker({
  dateRange,
  onUpdate,
  className,
}: {
  dateRange: DateRange;
  onUpdate: (range: DateRange) => void;
  className?: string;
}) {
  const [date, setDate] = React.useState<DateRange>({
    from: dateRange.from,
    to: dateRange.to,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  // When internal state changes, call parent's onUpdate
  React.useEffect(() => {
    if (date.from && date.to) {
      onUpdate(date);
    }
  }, [date, onUpdate]);

  // When parent's dateRange prop changes, update internal state
  React.useEffect(() => {
    setDate(dateRange);
  }, [dateRange]);

  // Quick select presets
  const handleSelectPreset = (preset: string) => {
    const now = new Date();
    switch (preset) {
      case "today":
        setDate({ from: now, to: now });
        break;
      case "yesterday": {
        const yesterday = addDays(now, -1);
        setDate({ from: yesterday, to: yesterday });
        break;
      }
      case "7days":
        setDate({ from: addDays(now, -6), to: now });
        break;
      case "30days":
        setDate({ from: addDays(now, -29), to: now });
        break;
      case "thisMonth": {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        setDate({ from: firstDay, to: now });
        break;
      }
      case "lastMonth": {
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        setDate({ from: firstDay, to: lastDay });
        break;
      }
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from && date.to ? (
              date.from.toDateString() === date.to.toDateString() ? (
                format(date.from, "PP")
              ) : (
                <>
                  {format(date.from, "PP")} - {format(date.to, "PP")}
                </>
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center justify-between space-x-2 p-3 border-b">
            <Select
              onValueChange={handleSelectPreset}
              defaultValue="custom"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={(selected) => {
              if (selected?.from && selected?.to) {
                setDate(selected as DateRange);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
