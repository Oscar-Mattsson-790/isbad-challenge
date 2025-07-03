"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { useEffect, useState } from "react";
import { getBathStats, type BathStats } from "@/lib/get-bath-stats";
import { StatsGrid } from "./dashboard/statsGrid";
import { BathCalendar } from "./bath-calendar";

type Props = {
  supabase: SupabaseClient<Database>;
  friendId: string;
  fullName: string;
  open: boolean;
  onClose: () => void;
};

export function FriendStatsModal({
  supabase,
  friendId,
  fullName,
  open,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BathStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const result = await getBathStats(supabase, friendId);
      setStats(result);
      setLoading(false);
    };

    if (open) fetchStats();
  }, [open, friendId, supabase]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#2B2B29] text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-white">
            {fullName}&apos;s stats
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div>Loading...</div>
        ) : stats ? (
          <>
            <StatsGrid stats={stats} mode="friend" />
            <BathCalendar activities={stats.activities} />
          </>
        ) : (
          <div>Could not load stats.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
