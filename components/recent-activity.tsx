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
  type: "tub" | "shower" | "outside";
}

function getBathTypeImage(type: BathEntry["type"]) {
  switch (type) {
    case "tub":
      return "/images/ice bath icon.png";
    case "shower":
      return "/images/cold shower icon.png";
    case "outside":
      return "/images/outside icon.png";
    default:
      return "/images/isbad_logo_white.png";
  }
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
            className="flex items-center gap-4 rounded-sm bg-[#2B2B29] text-white p-4 hover:shadow-[0_4px_20px_0_#157FBF]"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {new Date(activity.date).toLocaleDateString("sv-SE")}{" "}
                  {activity.time.slice(0, 5)}
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={getBathTypeImage(activity.type)}
                    width={24}
                    height={24}
                    alt={`${activity.type} icon`}
                  />
                  <span className="text-2xl">{activity.feeling}</span>
                </div>
              </div>
              <div className="text-sm text-[#157FBF]">
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
        className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
        size="lg"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Show less" : "View All"}
      </Button>
    </div>
  );
}
