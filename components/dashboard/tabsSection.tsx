"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/components/supabase-provider";
import { computeFriendProgress } from "@/lib/challenge-progress";

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="sr-only">Progress</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-[#157FBF]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

type ActivePair = {
  friendId: string;
  friendLabel: string;
  friendProgress: number;
  friendLength: number;
};

type Props = { layout?: "tabs" | "stacked" };

export function TabsSection({ layout = "tabs" }: Props) {
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [pairs, setPairs] = useState<ActivePair[]>([]);
  const [myActive, setMyActive] = useState(false);

  const fetchData = async () => {
    if (!session) return;
    setLoading(true);

    const { data: me } = await supabase
      .from("profiles")
      .select("challenge_active, challenge_started_at, challenge_length")
      .eq("id", session.user.id)
      .maybeSingle();

    const iAmActive = !!me?.challenge_active;
    const iStart = me?.challenge_started_at ?? null;
    const iLen = me?.challenge_length ?? 30;
    setMyActive(iAmActive);

    const { data: friends } = await supabase
      .from("friends")
      .select(
        "friend_id, profiles:friend_id(full_name, email, challenge_active, challenge_started_at, challenge_length)"
      )
      .eq("user_id", session.user.id)
      .eq("status", "accepted")
      .order("created_at", { ascending: false });

    if (!iAmActive || !iStart || !friends || friends.length === 0) {
      setPairs([]);
      setLoading(false);
      return;
    }

    const rows: ActivePair[] = [];
    for (const f of friends) {
      // @ts-expect-error alias
      const p = f?.profiles as {
        full_name: string | null;
        email: string | null;
        challenge_active: boolean | null;
        challenge_started_at: string | null;
        challenge_length: number | null;
      };
      if (!p?.challenge_active || !p.challenge_started_at) continue;

      const friendStart = p.challenge_started_at;
      const friendLen = p.challenge_length ?? 30;

      const pairStart =
        iStart && friendStart
          ? iStart > friendStart
            ? iStart
            : friendStart
          : friendStart;
      const pairLen = Math.min(iLen, friendLen);

      const { data: friendBaths } = await supabase
        .from("baths")
        .select("date")
        .eq("user_id", f.friend_id as string)
        .gte("date", pairStart);

      const friendProgress = computeFriendProgress(
        friendBaths ?? [],
        pairStart,
        true
      );

      const label =
        p.full_name && p.full_name.trim().length > 0
          ? p.full_name
          : p.email || "Friend";

      rows.push({
        friendId: f.friend_id as string,
        friendLabel: label,
        friendProgress,
        friendLength: pairLen,
      });
    }

    setPairs(rows);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const ChallengesCard = (
    <Card className="bg-[#2B2B29] text-white border-none">
      <CardHeader>
        <CardTitle>Active challenges</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!myActive && (
          <p className="text-sm text-white/80">
            Start your own challenge to see friend match-ups here.
          </p>
        )}

        {loading && <p className="text-sm text-white/80">Loading…</p>}

        {!loading && myActive && pairs.length === 0 && (
          <p className="text-sm">
            You have no active challenges with friends yet.
          </p>
        )}

        {!loading &&
          myActive &&
          pairs.map((p) => {
            const pct =
              (p.friendProgress / (p.friendLength > 0 ? p.friendLength : 1)) *
              100;
            return (
              <div
                key={p.friendId}
                className="rounded-lg bg-[#242422] px-4 py-3 border border-white/5"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{p.friendLabel}</div>
                  <div className="text-xs text-white/60">
                    {p.friendProgress}/{p.friendLength} days
                  </div>
                </div>
                <ProgressBar value={pct} />
              </div>
            );
          })}
      </CardContent>
    </Card>
  );

  if (layout === "stacked") {
    return (
      <div className="w-full space-y-6">
        <FriendsList />
        {ChallengesCard}
      </div>
    );
  }

  return (
    <Tabs defaultValue="friends" className="w-full">
      <TabsList className="bg-[#2B2B29]">
        <TabsTrigger value="friends">Friends</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
      </TabsList>
      <TabsContent value="friends" className="border-none p-0 pt-4">
        <FriendsList />
      </TabsContent>
      <TabsContent value="challenges" className="border-none p-0 pt-4">
        {ChallengesCard}
      </TabsContent>
    </Tabs>
  );
}
