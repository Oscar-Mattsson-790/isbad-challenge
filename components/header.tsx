"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, Settings } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Fel vid utloggning", {
        description: error.message,
      });
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/isbad_logo_black.png"
            alt="ISBAD Logo"
            width={150}
            height={40}
            priority
          />
        </Link>

        <nav className="hidden md:flex md:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-black transition-colors hover:text-[#1AA7EC]"
          >
            Hem
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-black transition-colors hover:text-[#1AA7EC]"
          >
            Om ISBAD
          </Link>
          <Link
            href="/benefits"
            className="text-sm font-medium text-black transition-colors hover:text-[#1AA7EC]"
          >
            Fördelar
          </Link>
          {session ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-black transition-colors hover:text-[#1AA7EC]"
            >
              Min Utmaning
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Utmaning</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Inställningar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logga ut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="border border-black bg-white text-black hover:bg-black hover:text-white"
              >
                <Link href="/login">Logga in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="border border-black bg-[#242422] hover:bg-white hover:text-black"
              >
                <Link href="/signup">Registrera dig</Link>
              </Button>
            </div>
          )}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
