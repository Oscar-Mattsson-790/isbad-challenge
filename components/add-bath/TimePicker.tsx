"use client";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Clock } from "lucide-react";

type Props = {
  time: string;
  setTime: (v: string) => void;
  date: Date;
  setDate: (d: Date) => void;
  disabled?: boolean;
};

export function TimePicker({ time, setTime, date, disabled }: Props) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="time">
        <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
          2
        </span>
        Select the time you took your ice bath
      </Label>

      <div className="flex items-center gap-2">
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                disabled={disabled}
                className="w-full justify-start text-left font-normal bg-white text-black hover:bg-white"
              >
                <Clock className="mr-2 h-4 w-4" />
                {time}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="w-auto p-2 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <select
                  value={time.split(":")[0]}
                  onChange={(e) =>
                    setTime(
                      `${e.target.value.padStart(2, "0")}:${time.split(":")[1]}`
                    )
                  }
                  className="border rounded px-2 py-1 bg-white text-black"
                >
                  {[...Array(24).keys()].map((h) => {
                    const val = h.toString().padStart(2, "0");
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
                <span className="text-lg font-medium">:</span>
                <select
                  value={time.split(":")[1]}
                  onChange={(e) =>
                    setTime(
                      `${time.split(":")[0]}:${e.target.value.padStart(2, "0")}`
                    )
                  }
                  className="border rounded px-2 py-1 bg-white text-black"
                >
                  {[...Array(60).keys()].map((m) => {
                    const val = m.toString().padStart(2, "0");
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-1/2 text-sm text-white/80">
          Today: {format(date, "MMMM do, yyyy", { locale: enUS })}
        </div>
      </div>
    </div>
  );
}
