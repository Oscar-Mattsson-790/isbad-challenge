"use client";

import { useCallback, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { computeFriendProgress } from "@/lib/challenge-progress";

export type FriendChallenge = {
  friendId: string;
  friendName: string;
  startedAt: string;
  length: number;
  progress: number;
};

export function useFriendChallenges(
  supabase: SupabaseClient<Database>,
  userId?: string | null
) {
  const [items, setItems] = useState<FriendChallenge[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("friend_challenges")
      .select(
        `
        id,
        user_id,
        friend_id,
        started_at,
        length,
        active,
        user_profile:user_id(full_name,email),
        friend_profile:friend_id(full_name,email)
      `
      )
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Failed to load friend challenges:", error?.message);
      setItems([]);
      setLoading(false);
      return;
    }

    const out: FriendChallenge[] = [];

    for (const row of data as any[]) {
      const iAmUser = row.user_id === userId;
      const counterpartId: string = iAmUser ? row.friend_id : row.user_id;
      const labelSrc = iAmUser ? row.friend_profile : row.user_profile;

      const friendName =
        (labelSrc?.full_name && labelSrc.full_name.trim().length > 0
          ? labelSrc.full_name
          : labelSrc?.email) ?? "Friend";

      const startedAt: string = row.started_at as string;
      const length: number = row.length as number;

      const { data: baths } = await supabase
        .from("baths")
        .select("date")
        .eq("user_id", counterpartId)
        .gte("date", startedAt);

      const progress = computeFriendProgress(baths ?? [], startedAt, true);

      out.push({
        friendId: counterpartId,
        friendName,
        startedAt,
        length,
        progress,
      });
    }

    setItems(out);
    setLoading(false);
  }, [supabase, userId]);

  return { items, loading, fetchAll };
}
