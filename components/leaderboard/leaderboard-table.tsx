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
    <div className="text-white">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded border transition ${
            filterBy === "baths"
              ? "bg-[#157FBF] text-white border-none hover:bg-[#115F93]"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setFilterBy("baths")}
        >
          Filter by Baths
        </button>
        <button
          className={`px-4 py-2 rounded border transition ${
            filterBy === "challenges"
              ? "bg-[#157FBF] text-white border-none hover:bg-[#115F93]"
              : "bg-white text-black border border-black"
          }`}
          onClick={() => setFilterBy("challenges")}
        >
          Filter by Challenges
        </button>
      </div>

      <table className="w-full table-fixed border border-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Ice bathers</th>
            <th className="border px-4 py-2">Total baths</th>
            <th className="border px-4 py-2">Total completed challenges</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((user, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{user.full_name}</td>
              <td className="border px-4 py-2">{user.bath_count}</td>
              <td className="border px-4 py-2">{user.challenges_completed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
