"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

// Simulated bath data
const bathData = [
  { date: new Date(2024, 2, 1), duration: "02:15", emoji: "😊" },
  { date: new Date(2024, 2, 2), duration: "01:45", emoji: "🥶" },
  { date: new Date(2024, 2, 3), duration: "02:00", emoji: "💪" },
  { date: new Date(2024, 2, 5), duration: "01:30", emoji: "😎" },
  { date: new Date(2024, 2, 6), duration: "02:30", emoji: "🔥" },
  { date: new Date(2024, 2, 8), duration: "01:15", emoji: "😌" },
  { date: new Date(2024, 2, 9), duration: "01:45", emoji: "🥶" },
  { date: new Date(2024, 2, 10), duration: "02:15", emoji: "😁" },
  { date: new Date(2024, 2, 11), duration: "01:30", emoji: "💪" },
  { date: new Date(2024, 2, 12), duration: "02:00", emoji: "😊" },
  { date: new Date(), duration: "01:45", emoji: "🔥" },
];

export function BathCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBath, setSelectedBath] = useState<any>(null);

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;

    setDate(day);

    // Find bath data for the selected day
    const bath = bathData.find(
      (b) => b.date.toDateString() === day.toDateString()
    );

    setSelectedBath(bath);
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
            bathData.some(
              (bath) => bath.date.toDateString() === date.toDateString()
            ),
        }}
        modifiersClassNames={{
          completed: "bg-[#D0E7F8] text-[#0B4F82] font-bold",
        }}
        components={{
          DayContent: ({ date }) => {
            const bath = bathData.find(
              (b) => b.date.toDateString() === date.toDateString()
            );

            return (
              <div className="flex h-9 w-9 items-center justify-center p-0">
                <div className="flex flex-col items-center">
                  <span>{date.getDate()}</span>
                  {bath && (
                    <span className="mt-[-4px] text-[10px]">{bath.emoji}</span>
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
            {selectedBath.date.toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Tidpunkt</p>
              <p>10:30</p>
            </div>
            <div>
              <p className="text-muted-foreground">Varaktighet</p>
              <p>{selectedBath.duration}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Känsla</p>
              <p className="text-xl">{selectedBath.emoji}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Bevis</p>
              <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                Visa bild
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
