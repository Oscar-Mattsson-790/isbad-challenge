"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import type { ProfileRow } from "@/types/supabase";

export default function ProfileCompletionBanner() {
  const { session } = useSupabase();
  const { profile } = useUserProfile();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  // Gör en lokal, tolerant typning (inkl. 'phone')
  const p = (profile ?? {}) as Partial<ProfileRow> & { phone?: string | null };

  // ✅ Hooks ovan – inga tidiga returns före hooks!
  const isProfilePage = pathname?.startsWith("/profile") ?? false;

  const isIncomplete = useMemo(() => {
    const fullNameOk =
      typeof p.full_name === "string" && p.full_name.trim().length > 0;
    const phoneOk = typeof p.phone === "string" && p.phone.trim().length > 0;
    const avatarOk =
      typeof p.avatar_url === "string" && p.avatar_url.trim().length > 0;

    // kräv alla tre fälten
    return !(fullNameOk && phoneOk && avatarOk);
  }, [p.full_name, p.phone, p.avatar_url]);

  if (!session || isProfilePage || dismissed || !isIncomplete) return null;

  return (
    <div className="bg-red-600 text-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Vänligen fyll i din fullständiga profil och var med och vinn
            kommande priser!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
          >
            Komplettera profil
          </Link>
          <button
            aria-label="Stäng"
            onClick={() => setDismissed(true)}
            className="rounded p-1 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
