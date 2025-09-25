"use client";

import { Label } from "@/components/ui/label";

type Props = {
  minutes: string;
  seconds: string;
  setMinutes: (v: string) => void;
  setSeconds: (v: string) => void;
  disabled?: boolean;
};

export function DurationPicker({
  minutes,
  seconds,
  setMinutes,
  setSeconds,
  disabled,
}: Props) {
  return (
    <div className="grid gap-2">
      <Label>
        <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
          3
        </span>
        How long did you stay in the water?
      </Label>

      <div className="flex gap-2">
        <div className="flex flex-col">
          <span className="text-sm">Minutes</span>
          <select
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="border rounded px-2 py-1 bg-white text-black"
            disabled={disabled}
          >
            {[...Array(31).keys()].map((min) => (
              <option key={min} value={min.toString()}>
                {min.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <span className="text-sm">Seconds</span>
          <select
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="border rounded px-2 py-1 bg-white text-black"
            disabled={disabled}
          >
            {[...Array(60).keys()].map((sec) => (
              <option key={sec} value={sec.toString()}>
                {sec.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
