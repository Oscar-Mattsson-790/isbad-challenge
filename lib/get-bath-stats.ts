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
  const longest = Math.max(...durations);
  const average = durations.reduce((a, b) => a + b, 0) / total;

  const format = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // 🧠 Streak-logik: räkna hur många dagar i rad man har loggat
  const today = new Date();
  const sortedDates = data
    .map((b) => new Date(b.date.split("T")[0]))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (sortedDates[i].toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return {
    daysCompleted: streak,
    longestBath: format(longest),
    averageDuration: format(Math.round(average)),
    latestBath: data[0]?.date ?? "",
    latestTime: data[0]?.time?.slice(0, 5) ?? "",
    activities: data,
  };
}
