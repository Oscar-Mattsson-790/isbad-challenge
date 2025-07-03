"use client";

import { useSupabase } from "@/components/supabase-provider";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import LayoutWrapper from "@/components/layout-wrapper";
import { Trophy } from "lucide-react";

export default function ScoreboardPage() {
  const { session, initialLoading } = useSupabase();

  if (initialLoading) return null;

  if (!session) return null;

  return (
    <LayoutWrapper>
      <div className="pt-10 px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-[#157FBF]" />
          <span>Top ice bathers</span>
        </h1>
        <LeaderboardTable />
      </div>
    </LayoutWrapper>
  );
}
