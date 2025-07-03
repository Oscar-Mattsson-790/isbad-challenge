import type { SupabaseClient } from "@supabase/supabase-js";
import type { BathRow } from "@/types/supabase";
import type { Database } from "@/types/supabase";

export interface BathStats {
  daysCompleted: number;
  longestBath: string;
  averageDuration: string;
  latestBath: string;
  latestTime: string;
  activities: BathRow[];
}

export async function getBathStats(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<BathStats> {
  const { data, error } = await supabase
    .from("baths")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("time", { ascending: false });

  if (error || !data) {
    console.error("Error fetching baths", error);
    return {
      daysCompleted: 0,
      longestBath: "0:00",
      averageDuration: "0:00",
      latestBath: "",
      latestTime: "",
      activities: [],
    };
  }

  const durations = data.map((b) => {
    const [min, sec] = b.duration.split(":").map(Number);
    return min * 60 + sec;
  });

  const total = durations.length;
  const longest = total > 0 ? Math.max(...durations) : 0;
  const average = total > 0 ? durations.reduce((a, b) => a + b, 0) / total : 0;

  const format = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // 🧠 Fixad streak-logik: unika datum, jämför dag för dag bakåt från idag
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDateStrings = Array.from(new Set(data.map((b) => b.date)));

  const uniqueDates = uniqueDateStrings
    .map((dateStr) => {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      return d;
    })
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    if (uniqueDates[i].toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return {
    daysCompleted: streak,
    longestBath: format(longest),
    averageDuration: format(Math.round(average)),
    latestBath: data[0]?.date ?? "No bath yet",
    latestTime: data[0]?.time?.slice(0, 5) ?? "-",
    activities: data,
  };
}
