"use client";

import { User, Calendar, Plus, Activity } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";

export default function StickyActionBar({
  onAddBathClick,
}: {
  onAddBathClick?: () => void;
}) {
  const { session } = useSupabase();
  const router = useRouter();

  if (!session) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#242422] text-white flex justify-evenly items-center py-2">
      <button
        onClick={() => router.push("/profile")}
        className="flex flex-col items-center text-xs transition-colors hover:text-[#157FBF]"
      >
        <User className="h-6 w-6" />
        Profile
      </button>
      <button
        onClick={onAddBathClick}
        className="flex flex-col items-center text-xs transition-colors hover:text-[#157FBF]"
      >
        <Plus className="h-6 w-6" />
        Add bath
      </button>
      <button className="flex flex-col items-center text-xs transition-colors hover:text-[#157FBF]">
        <Calendar className="h-6 w-6" />
        Calendar
      </button>
      <button className="flex flex-col items-center text-xs transition-colors hover:text-[#157FBF]">
        <Activity className="h-6 w-6" />
        Recents activity
      </button>
    </div>
  );
}
