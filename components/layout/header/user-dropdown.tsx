"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Settings, Trophy, User, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignOut } from "@/lib/hooks/use-signout";

export function UserDropdown({
  session,
  profile,
}: {
  session: any;
  profile: any;
}) {
  const router = useRouter();
  const handleSignOut = useSignOut();

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 rounded-full hover:shadow-[0_4px_20px_0_#157FBF] overflow-hidden ">
          <User className="h-5 w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-[#242422] text-white border-none"
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {profile?.full_name ?? session.user.email}
            </p>
            <p className="text-xs text-[#157FBF]">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <User className="mr-2 h-4 w-4 text-[#157FBF]" />
          My Challenges
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/scoreboard")}>
          <Trophy className="mr-2 h-4 w-4 text-[#157FBF]" />
          Top ice bathers
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <Settings className="mr-2 h-4 w-4 text-[#157FBF]" />
          My profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/contact")}>
          <Mail className="mr-2 h-4 w-4 text-[#157FBF]" />
          Contact
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/about")}>
          <Info className="mr-2 h-4 w-4 text-[#157FBF]" />
          About
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4 text-[#157FBF]" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
