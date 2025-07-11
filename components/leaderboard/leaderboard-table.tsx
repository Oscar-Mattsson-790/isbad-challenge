"use client";
import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/fetch-leaderboard";
import { useSupabase } from "@/components/supabase-provider";
import type { LeaderboardRow } from "@/types/supabase";

export function LeaderboardTable() {
  const { supabase } = useSupabase();
  const [data, setData] = useState<LeaderboardRow[]>([]);
  const [filterBy, setFilterBy] = useState<"baths" | "challenges">("baths");

  useEffect(() => {
    const load = async () => {
      const result = await fetchLeaderboard(supabase);
      setData(result);
    };
    load();
  }, [supabase]);

  const sortedData = [...data].sort((a, b) =>
    filterBy === "baths"
      ? b.bath_count - a.bath_count
      : b.challenges_completed - a.challenges_completed
  );

  return (
    <div className="flex flex-col items-center text-white w-full px-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded transition ${
            filterBy === "baths"
              ? "bg-[#157FBF] text-white hover:bg-[#115F93]"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setFilterBy("baths")}
        >
          Filter by Baths
        </button>
        <button
          className={`px-4 py-2 rounded transition ${
            filterBy === "challenges"
              ? "bg-[#157FBF] text-white hover:bg-[#115F93]"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setFilterBy("challenges")}
        >
          Filter by Challenges
        </button>
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mb-2 text-sm uppercase text-[#157FBF]">
        <div>Ice bathers</div>
        <div>Total baths</div>
        <div>Completed challenges</div>
      </div>

      {/* Data Rows */}
      {sortedData.map((user, idx) => (
        <div key={idx} className="grid grid-cols-3 gap-4 w-full max-w-4xl mb-3">
          <div className="rounded-sm bg-[#2B2B29] text-white p-4 hover:shadow-[0_4px_20px_0_#157FBF] transition duration-200">
            {user.full_name}
          </div>
          <div className="rounded-sm bg-[#2B2B29] text-white p-4 hover:shadow-[0_4px_20px_0_#157FBF] transition duration-200">
            {user.bath_count}
          </div>
          <div className="rounded-sm bg-[#2B2B29] text-white p-4 hover:shadow-[0_4px_20px_0_#157FBF] transition duration-200">
            {user.challenges_completed}
          </div>
        </div>
      ))}
    </div>
  );
}
