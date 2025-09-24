"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

type Props = {
  profile: any;
  setOpen: (open: boolean) => void;
};

export function HeaderSection({ profile, setOpen }: Props) {
  const router = useRouter();

  const displayName =
    profile?.full_name && String(profile.full_name).trim().length > 0
      ? profile.full_name
      : (profile?.email ?? "there");

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex gap-5 items-center md:w-3/4">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#2B2B29] overflow-hidden hover:shadow-[0_4px_20px_0_#157FBF] transition-shadow duration-300">
          {profile?.avatar_url && (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-base md:text-lg font-bold tracking-tight">
            Hi {displayName}!
          </h1>
          <p className="text-white text-xs md:text-sm pb-2">
            Keep track of your ice bath <br />
            challenge and follow your progress.
          </p>
        </div>
      </div>

      <div className="md:w-1/4 w-full flex items-center">
        <div className="w-full flex items-center gap-3">
          <div
            onClick={() => router.push("/timer")}
            role="button"
            tabIndex={0}
            className="group bg-[#157FBF] rounded-lg p-3 cursor-pointer
             hover:shadow-[0_2px_10px_0_#157FBF] transition-shadow duration-300
             outline-none focus:ring-2 focus:ring-[#157FBF]/40"
          >
            <Timer className="h-6 w-6 text-white group-hover:text-black" />
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="flex-1 h-12 bg-[#157FBF] text-white border-none hover:bg-[#115F93] hover:text-white"
          >
            Log new ice bath
          </Button>
        </div>
      </div>
    </div>
  );
}
