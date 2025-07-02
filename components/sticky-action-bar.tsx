"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Calendar, Plus, Activity, MailPlus } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";

export default function StickyActionBar({
  onAddBathClick,
}: {
  onAddBathClick?: () => void;
}) {
  const { session } = useSupabase();
  const router = useRouter();
  const [active, setActive] = useState<string>("");

  if (!session) return null;

  const iconClass = (name: string) =>
    `flex flex-col items-center text-xs transition-colors ${
      active === name ? "text-[#157FBF]" : "text-white"
    }`;

  const goToRecentActivity = () => {
    setActive("activity");
    router.push("/dashboard#recent-activity");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#242422]">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto flex justify-between items-center py-4 pb-4">
        <button
          onClick={() => {
            onAddBathClick?.();
            setActive("add");
          }}
          className={iconClass("add")}
        >
          <Plus className="h-6 w-6" />
          Add bath
        </button>
        <button
          onClick={() => {
            setActive("calendar");
            router.push("/dashboard#calendar-section");
          }}
          className={iconClass("calendar")}
        >
          <Calendar className="h-6 w-6" />
          Challenge
        </button>
        <button onClick={goToRecentActivity} className={iconClass("activity")}>
          <Activity className="h-6 w-6" />
          Activity
        </button>
        <button
          onClick={() => {
            setActive("order");
            window.open(
              "https://isbad.se/product/isbad-premium-plus-black-edition/",
              "_blank"
            );
          }}
          className={iconClass("order")}
        >
          <ShoppingCart className="h-6 w-6" />
          Order bath
        </button>
        <button
          onClick={() => setActive("invite")}
          className={iconClass("invite")}
        >
          <MailPlus className="h-6 w-6" />
          Invite
        </button>
      </div>
    </div>
  );
}
