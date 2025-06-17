import { useCallback, useState } from "react";
import { getBathStats } from "../get-bath-stats";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BathStats } from "../get-bath-stats";

export function useBathStats(
  supabase: SupabaseClient,
  userId: string | undefined
) {
  const [stats, setStats] = useState<BathStats | null>(null);

  const fetchBathData = useCallback(async () => {
    if (!userId) return;
    const bathStats = await getBathStats(supabase, userId);
    setStats(bathStats);
  }, [supabase, userId]);

  return { stats, fetchBathData };
}
