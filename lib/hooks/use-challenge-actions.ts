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

  const completeLatestChallenge = async () => {
    if (!userId) return;

    const { data: openLog } = await supabase
      .from("challenge_logs")
      .select("id")
      .eq("user_id", userId)
      .is("completed_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!openLog?.id) return;

    await supabase
      .from("challenge_logs")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", openLog.id);
  };

  return {
    startChallenge,
    cancelChallenge,
    resetChallenge,
    completeLatestChallenge,
  };
}
