"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/components/supabase-provider";
import { computeFriendProgress } from "@/lib/challenge-progress";

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const barColor = pct >= 100 ? "#15BF6A" : "#157FBF";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="sr-only">Progress</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
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

type CompletedChallenge = {
  id: string;
  started_at: string | null;
  completed_at: string;
  challenge_length: number;
};

type Props = { layout?: "tabs" | "stacked" };

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d as string;
  }
}

export function TabsSection({ layout = "tabs" }: Props) {
  const { supabase, session } = useSupabase();

  const [loadingActive, setLoadingActive] = useState(true);
  const [pairs, setPairs] = useState<ActivePair[]>([]);
  const [myActive, setMyActive] = useState(false);

  const [loadingCompleted, setLoadingCompleted] = useState(true);
  const [completed, setCompleted] = useState<CompletedChallenge[]>([]);

  const fetchData = async () => {
    if (!session) return;

    const { data: me } = await supabase
      .from("profiles")
      .select("challenge_active")
      .eq("id", session.user.id)
      .maybeSingle();

    setMyActive(!!me?.challenge_active);

    setLoadingActive(true);

    // Hämta alla aktiva friend_challenges där jag är med (som user_id eller friend_id)
    const { data: pairsRaw, error: pairsErr } = await supabase
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
      .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (pairsErr || !pairsRaw || pairsRaw.length === 0) {
      setPairs([]);
      setLoadingActive(false);
    } else {
      const rows: ActivePair[] = [];
      for (const r of pairsRaw as any[]) {
        const iAmUser = r.user_id === session.user.id;
        const counterpartId = iAmUser ? r.friend_id : r.user_id;
        const labelSrc = iAmUser ? r.friend_profile : r.user_profile;

        const label =
          labelSrc?.full_name && labelSrc.full_name.trim().length > 0
            ? labelSrc.full_name
            : labelSrc?.email || "Friend";

        const pairStart = r.started_at as string;
        const friendLen = r.length as number;

        const { data: friendBaths } = await supabase
          .from("baths")
          .select("date")
          .eq("user_id", counterpartId)
          .gte("date", pairStart);

        const friendProgress = computeFriendProgress(
          friendBaths ?? [],
          pairStart,
          true
        );

        rows.push({
          friendId: counterpartId,
          friendLabel: label,
          friendProgress,
          friendLength: friendLen,
        });
      }
      setPairs(rows);
      setLoadingActive(false);
    }

    setLoadingCompleted(true);
    const { data: logs, error } = await supabase
      .from("challenge_logs")
      .select("id, started_at, completed_at, challenge_length")
      .eq("user_id", session.user.id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Failed to load completed challenges:", error.message);
      setCompleted([]);
    } else {
      setCompleted((logs ?? []) as CompletedChallenge[]);
    }
    setLoadingCompleted(false);
  };

  useEffect(() => {
    fetchData();
    const onCompleted = () => fetchData();
    const onPairsUpdated = () => fetchData();
    window.addEventListener(
      "challenge-completed",
      onCompleted as EventListener
    );
    window.addEventListener(
      "friend-challenges-updated",
      onPairsUpdated as EventListener
    );
    return () => {
      window.removeEventListener(
        "challenge-completed",
        onCompleted as EventListener
      );
      window.removeEventListener(
        "friend-challenges-updated",
        onPairsUpdated as EventListener
      );
    };
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
        {loadingActive && <p className="text-sm text-white/80">Loading…</p>}
        {!loadingActive && pairs.length === 0 && (
          <p className="text-sm">
            You have no active challenges with friends yet.
          </p>
        )}
        {!loadingActive &&
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

  const CompletedCard = (
    <Card className="bg-[#2B2B29] text-white border-none">
      <CardHeader>
        <CardTitle>Completed challenges</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingCompleted && <p className="text-sm text-white/80">Loading…</p>}
        {!loadingCompleted && completed.length === 0 && (
          <p className="text-sm">No completed challenges yet.</p>
        )}
        {!loadingCompleted &&
          completed.map((c) => {
            const title = `${c.challenge_length}-day challenge`;
            const subtitle = c.started_at
              ? `${fmtDate(c.started_at)} — ${fmtDate(c.completed_at)}`
              : `Completed: ${fmtDate(c.completed_at)}`;
            return (
              <div
                key={c.id}
                className="rounded-lg bg-[#242422] px-4 py-3 border border-white/5"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{title}</div>
                    <div className="text-xs text-white/60">{subtitle}</div>
                  </div>
                  <div className="text-xs text-white/60 ml-3 whitespace-nowrap">
                    {c.challenge_length}/{c.challenge_length} days
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={100} />
                </div>
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
        {CompletedCard}
      </div>
    );
  }

  return (
    <Tabs defaultValue="friends" className="w-full">
      <TabsList className="bg-[#2B2B29]">
        <TabsTrigger value="friends">Friends</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      <TabsContent value="friends" className="border-none p-0 pt-4">
        <FriendsList />
      </TabsContent>
      <TabsContent value="challenges" className="border-none p-0 pt-4">
        {ChallengesCard}
      </TabsContent>
      <TabsContent value="completed" className="border-none p-0 pt-4">
        {CompletedCard}
      </TabsContent>
    </Tabs>
  );
}
