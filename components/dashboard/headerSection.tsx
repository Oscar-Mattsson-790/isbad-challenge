"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

type Props = {
  profile: {
    full_name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  } | null;
  setOpen: (open: boolean) => void;
};

export function HeaderSection({ profile, setOpen }: Props) {
  const router = useRouter();

  const displayName =
    (profile?.full_name && profile.full_name.trim()) ||
    profile?.email ||
    "there";

  const hasAvatar = Boolean(profile?.avatar_url);
  const avatarSrc = hasAvatar
    ? (profile!.avatar_url as string)
    : "/images/cube-logo.png";

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex gap-5 items-center md:w-3/4">
        <div
          className="
            relative shrink-0 aspect-square
            w-24 h-24 md:w-32 md:h-32
            rounded-full bg-[#2B2B29] overflow-hidden
            hover:shadow-[0_4px_20px_0_#157FBF] transition-shadow duration-300
          "
        >
          <Image
            src={avatarSrc}
            alt={hasAvatar ? "Avatar" : "Placeholder"}
            fill
            sizes="(min-width: 768px) 8rem, 6rem"
            className={hasAvatar ? "object-cover" : "object-contain p-3"}
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-base md:text-lg font-bold tracking-tight">
            Hi {displayName}!
          </h1>
          <p className="text-white/90 text-xs md:text-sm leading-relaxed">
            Upgrade yourself with cold exposure. Own your progress — solo or
            with friends.
            <br className="hidden sm:block" />
            Log ice baths, cold showers, or outdoor dips.
          </p>
        </div>
      </div>

      <div className="md:w-1/4 w-full flex items-center">
        <div className="w-full flex items-center gap-3">
          <button
            onClick={() => router.push("/timer")}
            className="group bg-[#157FBF] rounded-lg p-3 hover:shadow-[0_2px_10px_0_#157FBF] transition-shadow duration-300 outline-none focus:ring-2 focus:ring-[#157FBF]/40"
            aria-label="Open cold timer"
          >
            <Timer className="h-6 w-6 text-white group-hover:text-black" />
          </button>

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
