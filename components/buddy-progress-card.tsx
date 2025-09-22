"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type BuddyProps = {
  friendName: string;
  friendProgress: number;
  friendLength: number;
  className?: string;
};

export default function BuddyProgressCard({
  friendName,
  friendProgress,
  friendLength,
  className,
}: BuddyProps) {
  const safeLen = friendLength > 0 ? friendLength : 1;
  const pct = Math.min((friendProgress / safeLen) * 100, 100);
  const pctRounded = Math.round(pct);

  return (
    <Card className={`bg-[#242422] text-white border-none ${className ?? ""}`}>
      <CardHeader className="px-0">
        <CardTitle className="text-[#157FBF]">Friend progress</CardTitle>
        <CardDescription className="text-white">
          Your friend’s current challenge progress
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <div className="flex items-center justify-between text-sm mb-1">
          <div>{friendName || "Friend"}</div>
          <div className="font-medium">{pctRounded}%</div>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-[#157FBF]" style={{ width: `${pct}%` }} />
        </div>

        <p className="text-xs text-zinc-300 mt-1">
          {friendProgress}/{friendLength} days
        </p>
      </CardContent>
    </Card>
  );
}
