"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/supabase-provider";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
import { DesktopNav } from "./desktop-nav";
import { UserDropdown } from "./user-dropdown";

export default function Header() {
  const { session } = useSupabase();
  const { profile } = useUserProfile();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#242422]">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/isbad challenge new logo in white no bg.png"
            alt="ISBAD Logo"
            width={100}
            height={40}
            priority
          />
        </Link>

        {/* Desktop / iPad navigation */}
        <DesktopNav session={session} />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Mobil: visa Login om inte inloggad */}
          {!session && (
            <Button asChild size="sm" className="bg-white text-black sm:hidden">
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Inloggad: visa user dropdown på alla skärmar */}
          <UserDropdown session={session} profile={profile} />
        </div>
      </div>
    </header>
  );
}
