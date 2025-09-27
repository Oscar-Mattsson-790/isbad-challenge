"use client";

import { useCallback, useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { computeFriendProgress } from "@/lib/challenge-progress";

export type Buddy = {
  friendId: string;
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

  const fetchBuddy = useCallback(async () => {
    if (!userId || !challengeActive) {
      setBuddy(null);
      return;
    }

    const { data: me } = await supabase
      .from("profiles")
      .select("challenge_started_at, challenge_length, challenge_active")
      .eq("id", userId)
      .maybeSingle();

    const myStart = me?.challenge_started_at ?? null;
    const myLen = me?.challenge_length ?? 30;

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

    // @ts-expect-error – alias join
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

    const pairStart =
      myStart && friendStart
        ? myStart > friendStart
          ? myStart
          : friendStart
        : friendStart;
    const pairLen = Math.min(myLen, friendLen);

    const { data: friendBaths } = await supabase
      .from("baths")
      .select("date")
      .eq("user_id", friendId)
      .gte("date", pairStart);

    const friendProgress = computeFriendProgress(
      friendBaths ?? [],
      pairStart,
      true
    );

    setBuddy({
      friendId,
      friendName,
      friendProgress,
      friendLength: pairLen,
    });
  }, [supabase, userId, challengeActive]);

  useEffect(() => {
    const h = () => void fetchBuddy();
    window.addEventListener("friend-challenges-updated", h as EventListener);
    return () =>
      window.removeEventListener(
        "friend-challenges-updated",
        h as EventListener
      );
  }, [fetchBuddy]);

  return { buddy, setBuddy, fetchBuddy };
}
