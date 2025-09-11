"use client";

import { useCallback, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export type Buddy = {
  friendName: string;
  friendProgress: number;
  friendLength: number;
} | null;

export function useBuddy(
  supabase: SupabaseClient<Database>,
  userId?: string | null,
  challengeActive?: boolean
) {
  const [buddy, setBuddy] = useState<Buddy>(null);

  const countUniqueDates = (rows: { date: string }[]) =>
    new Set(rows.map((r) => r.date)).size;

  const fetchBuddy = useCallback(async () => {
    if (!userId || !challengeActive) {
      setBuddy(null);
      return;
    }

    const { data: fr } = await supabase
      .from("friends")
      .select(
        "friend_id, profiles:friend_id(full_name, email, challenge_started_at, challenge_length, challenge_active)"
      )
      .eq("user_id", userId)
      .eq("status", "accepted")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // @ts-expect-error – Supabase alias-join
    const p = fr?.profiles as {
      full_name: string | null;
      email: string | null;
      challenge_started_at: string | null;
      challenge_length: number | null;
      challenge_active: boolean | null;
    };

    if (
      !fr ||
      !p ||
      !fr.friend_id ||
      !p.challenge_active ||
      !p.challenge_started_at
    ) {
      setBuddy(null);
      return;
    }

    const friendId = fr.friend_id as string;
    const friendName = p.full_name?.trim() ? p.full_name : p.email || "Friend";
    const friendStart = p.challenge_started_at!;
    const friendLen = p.challenge_length ?? 30;

    const { data: friendBaths } = await supabase
      .from("baths")
      .select("date")
      .eq("user_id", friendId)
      .gte("date", friendStart);

    const friendProgress = countUniqueDates(friendBaths ?? []);

    setBuddy({ friendName, friendProgress, friendLength: friendLen });
  }, [supabase, userId, challengeActive]);

  return { buddy, setBuddy, fetchBuddy };
}
