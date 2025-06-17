"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface BathEntry {
  id: string;
  date: string;
  time: string;
  duration: string;
  feeling: string;
  proof_url: string | null;
}

export function RecentActivity({ activities }: { activities: BathEntry[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {visibleActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 rounded-lg border p-3"
          >
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="font-medium">
                  {new Date(activity.date).toLocaleDateString("sv-SE")}{" "}
                  {activity.time.slice(0, 5)}
                </div>
                <div className="text-2xl">{activity.feeling}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Duration: {activity.duration}
              </div>
            </div>
            {activity.proof_url && (
              <div className="h-14 w-14 overflow-hidden rounded-md">
                <Image
                  src={activity.proof_url}
                  width={56}
                  height={56}
                  alt="Bath proof"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Show less" : "View All"}
      </Button>
    </div>
  );
}
