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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Menu } from "lucide-react";
import Image from "next/image";
import { useUserProfile } from "@/lib/hooks/use-user-profile";

export default function Header() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const { profile } = useUserProfile();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out error", {
        description: error.message,
      });
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#242422]">
      <div className="container px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/isbad_logo_white.png"
            alt="ISBAD Logo"
            width={100}
            height={40}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-white transition-colors hover:text-[#157FBF]"
          >
            Home
          </Link>
          <Link
            href="https://www.isbad.se"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white transition-colors hover:text-[#157FBF]"
          >
            About
          </Link>
          {session && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white transition-colors hover:text-[#157FBF]"
            >
              My Challenge
            </Link>
          )}
        </nav>

        {/* User area (desktop & mobile) */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#242422] text-white border-none shadow-md"
              >
                <DropdownMenuItem
                  asChild
                  className="hover:bg-white hover:text-black"
                >
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-white hover:text-black"
                >
                  <Link
                    href="https://www.isbad.se"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    About
                  </Link>
                </DropdownMenuItem>

                {!session && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Log in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign up</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {session && (
                  <DropdownMenuItem
                    asChild
                    className="hover:bg-white hover:text-black"
                  >
                    <Link href="/dashboard">My Challenge</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Session-specific dropdown */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-70 bg-[#242422] text-white border-none shadow-md"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name ?? session.user.email}
                    </p>
                    <p className="text-xs leading-none text-[#157FBF]">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard")}
                  className="hover:bg-white hover:text-black"
                >
                  <User className="mr-2 h-4 w-4 text-[#157FBF] hover:text-black" />
                  <span>Challenge</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="hover:bg-white hover:text-black"
                >
                  <Settings className="mr-2 h-4 w-4 text-[#157FBF] hover:text-black" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="hover:bg-white hover:text-black"
                >
                  <LogOut className="mr-2 h-4 w-4 text-[#157FBF] hover:text-black" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="border border-black bg-white text-black hover:bg-black hover:text-white"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="border border-black bg-[#242422] hover:bg-white hover:text-black"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
