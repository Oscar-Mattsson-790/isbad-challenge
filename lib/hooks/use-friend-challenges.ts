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

    const { data: pairs, error } = await supabase
      .from("friend_challenges")
      .select(
        "friend_id, started_at, length, profiles:friend_id(full_name, email)"
      )
      .eq("user_id", userId)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error || !pairs) {
      setItems([]);
      setLoading(false);
      return;
    }

    const rows: FriendChallenge[] = [];
    for (const r of pairs as any[]) {
      const friendId = r.friend_id as string;
      const startedAt = r.started_at as string;
      const length = r.length as number;

      const labelSrc = r.profiles as {
        full_name: string | null;
        email: string | null;
      };
      const friendName =
        (labelSrc?.full_name?.trim()?.length
          ? labelSrc.full_name
          : labelSrc?.email) ?? "Friend";

      const { data: friendBaths } = await supabase
        .from("baths")
        .select("date")
        .eq("user_id", friendId)
        .gte("date", startedAt);

      const progress = computeFriendProgress(
        friendBaths ?? [],
        startedAt,
        true
      );

      rows.push({ friendId, friendName, startedAt, length, progress });
    }

    setItems(rows);
    setLoading(false);
  }, [supabase, userId]);

  return { items, loading, fetchAll };
}
