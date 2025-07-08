import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export async function fetchLeaderboard(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.rpc("get_leaderboard");

  if (error) {
    console.error("Error fetching leaderboard:", error.message);
    return [];
  }
  console.log("Leaderboard data:", data);
  return data;
}
