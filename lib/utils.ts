import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInTimeZone } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🔹 Returnerar datum i svensk tidszon (för att spara korrekt i databasen)
export function getLocalDate(date: Date): string {
  return formatInTimeZone(date, "Europe/Stockholm", "yyyy-MM-dd");
}

// 🔹 Returnerar datum + tid i användarens lokala tidszon och språk
export function formatLocalDateTime(date: string, time: string): string {
  const isoString = `${date}T${time}`;
  const localDate = new Date(isoString);

  return localDate.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
