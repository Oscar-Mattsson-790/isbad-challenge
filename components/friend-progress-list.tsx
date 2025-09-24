"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Item = {
  friendId: string;
  friendName: string;
  progress: number;
  length: number;
};

function ProgressBar({ pct }: { pct: number }) {
  const value = Math.max(0, Math.min(100, Math.round(pct)));
  const barColor = value >= 100 ? "#15BF6A" : "#157FBF";

  return (
    <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full"
        style={{ width: `${value}%`, backgroundColor: barColor }}
      />
    </div>
  );
}

export default function FriendProgressList({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return null;

  return (
    <Card className="bg-[#242422] text-white border-none">
      <CardHeader className="px-0">
        <CardTitle className="text-[#157FBF]">Friend progress</CardTitle>
        <CardDescription className="text-white">
          Your friend’s current challenge progress
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        {items.map((it) => {
          const pct = (it.progress / (it.length > 0 ? it.length : 1)) * 100;
          return (
            <div
              key={it.friendId}
              className="rounded-lg bg-[#2B2B29] px-4 py-3 border border-white/5"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium">{it.friendName}</div>
                <div className="text-xs text-white/60">{Math.round(pct)}%</div>
              </div>
              <ProgressBar pct={pct} />
              <p className="text-xs text-zinc-300 mt-1">
                {it.progress}/{it.length} days
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
