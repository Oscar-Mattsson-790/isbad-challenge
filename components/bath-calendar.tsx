"use client";

import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import type { BathRow } from "@/types/supabase";

interface BathCalendarProps {
  activities: BathRow[];
}

export function BathCalendar({ activities }: BathCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedBath, setSelectedBath] = useState<BathRow | null>(null);

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    setDate(day);

    const match = activities.find(
      (b) => new Date(b.date).toDateString() === day.toDateString()
    );

    setSelectedBath(match ?? null);
  };

  const completedDates = useMemo(
    () => activities.map((b) => new Date(b.date).toDateString()),
    [activities]
  );

  const challengeStart = useMemo(() => {
    return activities.length > 0
      ? new Date(activities[activities.length - 1].date)
      : new Date();
  }, [activities]);

  const today = new Date();
  const totalDays = Math.floor(
    (today.getTime() - challengeStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  const failedDates = useMemo(() => {
    const allDates = Array.from({ length: totalDays }, (_, i) => {
      const d = new Date(challengeStart);
      d.setDate(d.getDate() + i);
      return d.toDateString();
    });

    return allDates.filter((d) => !completedDates.includes(d));
  }, [challengeStart, completedDates, totalDays]);

  return (
    <div className="space-y-4 px-0">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDayClick}
        className="rounded-md w-full"
        modifiers={{
          completed: (date) => completedDates.includes(date.toDateString()),
          failed: (date) => failedDates.includes(date.toDateString()),
        }}
        modifiersClassNames={{
          completed: "bg-[#157FBF] text-white font-bold",
          failed: "bg-red-700 text-white font-bold",
        }}
        components={{
          DayContent: ({ date }) => {
            const bath = activities.find(
              (b) => new Date(b.date).toDateString() === date.toDateString()
            );

            return (
              <div className="flex h-10 w-10 items-center justify-center p-0">
                <div className="flex flex-col items-center">
                  <span>{date.getDate()}</span>
                  {bath && (
                    <span className="mt-[-4px] text-[10px]">
                      {bath.feeling}
                    </span>
                  )}
                </div>
              </div>
            );
          },
        }}
      />

      {selectedBath && (
        <div className="mt-4 rounded-md bg-[#2B2B29] text-white p-4 hover:shadow-[0_4px_20px_0_#157FBF]">
          <h3 className="font-medium text-white">
            {new Date(selectedBath.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-white">Time</p>
              <p className="text-[#157FBF]">{selectedBath.time?.slice(0, 5)}</p>
            </div>
            <div>
              <p className="text-white">Duration</p>
              <p className="text-[#157FBF]">{selectedBath.duration}</p>
            </div>
            <div>
              <p className="text-white">Feeling</p>
              <p className="text-xl">{selectedBath.feeling}</p>
            </div>
            <div>
              <p className="text-white">Proof</p>
              {selectedBath.proof_url ? (
                <a
                  href={selectedBath.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#157FBF] hover:underline"
                >
                  Show image
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No image</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
