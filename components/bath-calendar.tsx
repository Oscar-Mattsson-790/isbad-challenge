"use client";

import { useState } from "react";
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

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDayClick}
        className="rounded-md border"
        modifiers={{
          completed: (date) =>
            activities.some(
              (bath) =>
                new Date(bath.date).toDateString() === date.toDateString()
            ),
        }}
        modifiersClassNames={{
          completed: "bg-[#D0E7F8] text-[#0B4F82] font-bold",
        }}
        components={{
          DayContent: ({ date }) => {
            const bath = activities.find(
              (b) => new Date(b.date).toDateString() === date.toDateString()
            );

            return (
              <div className="flex h-9 w-9 items-center justify-center p-0">
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
        <div className="mt-4 rounded-md border p-4">
          <h3 className="font-medium">
            {new Date(selectedBath.date).toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Tidpunkt</p>
              <p>{selectedBath.time}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Varaktighet</p>
              <p>{selectedBath.duration}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Känsla</p>
              <p className="text-xl">{selectedBath.feeling}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Bevis</p>
              {selectedBath.proof_url ? (
                <a
                  href={selectedBath.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Visa bild
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Ingen bild</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
