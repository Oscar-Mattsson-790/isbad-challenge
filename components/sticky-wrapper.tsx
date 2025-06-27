"use client";

import { useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import StickyActionBar from "@/components/sticky-action-bar";
import AddBathModal from "@/components/add-bath-modal";
import { useBathStats } from "@/lib/hooks/use-bath-stats";

export default function StickyWrapper() {
  const { session, supabase } = useSupabase();
  const [open, setOpen] = useState(false);
  const { fetchBathData } = useBathStats(supabase, session?.user.id);

  if (!session) return null;

  return (
    <>
      <StickyActionBar onAddBathClick={() => setOpen(true)} />
      <AddBathModal
        open={open}
        setOpen={setOpen}
        onBathAdded={() => {
          fetchBathData();
          setOpen(false);
        }}
      />
    </>
  );
}
