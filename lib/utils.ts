import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInTimeZone } from "date-fns-tz";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalDate(date: Date): string {
  return formatInTimeZone(date, "Europe/Stockholm", "yyyy-MM-dd");
}

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

export async function fetchCompletedChallengesCount(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { count, error } = await supabase
    .from("challenge_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("completed_at", "is", null);

  if (error) {
    console.error("fetchCompletedChallengesCount:", error);
    return 0;
  }
  return count ?? 0;
}
