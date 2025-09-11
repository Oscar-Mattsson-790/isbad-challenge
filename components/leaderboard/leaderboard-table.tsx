"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchLeaderboard } from "@/lib/fetch-leaderboard";
import { useSupabase } from "@/components/supabase-provider";
import type { LeaderboardRow } from "@/types/supabase";

export function LeaderboardTable() {
  const { supabase } = useSupabase();
  const [data, setData] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await fetchLeaderboard(supabase);
      setData(result);
      setLoading(false);
    };
    load();
  }, [supabase]);

  // Sortera alltid på antal bad (fallande)
  const sortedData = useMemo(() => {
    const copy = [...data];
    return copy.sort((a, b) => b.bath_count - a.bath_count);
  }, [data]);

  const maxBaths = useMemo(() => {
    const vals = sortedData.map((u) => u.bath_count);
    return Math.max(1, ...vals);
  }, [sortedData]);

  const rankBadge = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `${i + 1}.`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="rounded-xl bg-[#2B2B29] border border-white/5 text-white overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-5 md:p-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              Top ice bathers
            </h2>
            <p className="text-white/60 text-sm">
              Leaderboard across the ISBAD community
            </p>
          </div>

          {/* Litet "badge" som visar vad listan rankar på */}
          <div className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1.5 text-sm">
            Ranking by{" "}
            <span className="mx-1 font-medium text-[#157FBF]">baths</span>
          </div>
        </div>

        {/* Table header (desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 md:px-6 pb-2 text-xs uppercase tracking-wide text-[#157FBF]">
          <div className="col-span-1">Rank</div>
          <div className="col-span-6">Ice bather</div>
          <div className="col-span-2 text-right">Total baths</div>
          <div className="col-span-3 text-right">Completed challenges</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {loading && (
            <div className="p-6 text-white/70">Loading leaderboard…</div>
          )}

          {!loading && sortedData.length === 0 && (
            <div className="p-6 text-white/70">No leaderboard data yet.</div>
          )}

          {!loading &&
            sortedData.map((u, i) => {
              const pct = Math.max(
                0,
                Math.min(100, Math.round((u.bath_count / maxBaths) * 100))
              );

              return (
                <div
                  key={`${u.full_name}-${i}`}
                  className="px-5 md:px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-1 text-white/90">
                      {rankBadge(i)}
                    </div>

                    <div className="col-span-6 font-medium">{u.full_name}</div>

                    <div className="col-span-2 text-right tabular-nums">
                      {u.bath_count}
                    </div>

                    <div className="col-span-3 text-right tabular-nums">
                      {u.challenges_completed}
                    </div>

                    {/* Progressbar */}
                    <div className="col-span-12 mt-2">
                      <div className="h-2 w-full rounded bg-white/10">
                        <div
                          className="h-2 rounded bg-[#157FBF]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-white/60">
                        Total baths: {u.bath_count}
                      </div>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white/90">{rankBadge(i)}</span>
                        <span className="font-medium">{u.full_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/60">
                          Baths • Challenges
                        </div>
                        <div className="tabular-nums">
                          {u.bath_count} • {u.challenges_completed}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="h-2 w-full rounded bg-white/10">
                        <div
                          className="h-2 rounded bg-[#157FBF]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-white/60">
                        Total baths: {u.bath_count}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
