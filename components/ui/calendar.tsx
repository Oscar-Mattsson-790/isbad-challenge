"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("px-0 bg-[#242422] text-white w-full", className)}
      classNames={{
        months: "w-full",
        month: "w-full",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-l font-semibold",
        nav: "flex items-center gap-1",
        nav_button: cn(
          "w-8 h-8 bg-[#1AA7EC] text-white rounded-md flex items-center justify-center p-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full table-fixed border-collapse text-sm",
        head_row: "w-full",
        head_cell: "text-white font-medium w-10 h-10 text-center",
        row: "w-full",
        cell: cn(
          "w-10 h-10 p-1 text-center text-sm relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-10 h-10 p-0 font-normal aria-selected:text-black"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[#1AA7EC] aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-[#1AA7EC] aria-selected:text-white",
        day_selected: "bg-white text-black",
        day_today: "bg-white !text-black",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-[#1AA7EC] aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
