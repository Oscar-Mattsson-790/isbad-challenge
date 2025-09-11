"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export function useChallengeActions(
  supabase: SupabaseClient<Database>,
  userId?: string | null
) {
  const startChallenge = async (days: number, startedAtISO: string) => {
    if (!userId) return;

    await supabase
      .from("profiles")
      .update({
        challenge_length: days,
        challenge_started_at: startedAtISO,
        challenge_active: true,
      })
      .eq("id", userId);

    await supabase.from("challenge_logs").insert({
      user_id: userId,
      started_at: startedAtISO,
      challenge_length: days,
    });
  };

  const cancelChallenge = async () => {
    if (!userId) return;
    await supabase
      .from("profiles")
      .update({ challenge_active: false, challenge_started_at: null })
      .eq("id", userId);
  };

  const resetChallenge = async () => {
    if (!userId) return;
    await supabase
      .from("profiles")
      .update({
        challenge_active: false,
        challenge_started_at: null,
        challenge_length: 30,
      })
      .eq("id", userId);
  };

  return { startChallenge, cancelChallenge, resetChallenge };
}
