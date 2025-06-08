"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BathEntry {
  id: string;
  date: string;
  time: string;
  duration: string;
  feeling: string;
  proof_url: string | null;
}

export function RecentActivity() {
  const { supabase, session } = useSupabase();
  const [activities, setActivities] = useState<BathEntry[]>([]);

  useEffect(() => {
    async function fetchBaths() {
      if (!session) return;

      const { data, error } = await supabase
        .from("baths")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date", { ascending: false })
        .order("time", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error loading baths:", error.message);
      } else {
        setActivities(data);
      }
    }

    fetchBaths();
  }, [supabase, session]);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 rounded-lg border p-3"
          >
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="font-medium">
                  {new Date(activity.date).toLocaleDateString()}{" "}
                  {activity.time.slice(0, 5)}
                </div>
                <div className="text-2xl">{activity.feeling}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Duration: {activity.duration}
              </div>
            </div>
            {activity.proof_url ? (
              <div className="h-14 w-14 overflow-hidden rounded-md">
                <Image
                  src={activity.proof_url}
                  width={56}
                  height={56}
                  alt="Bath proof"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        View all
      </Button>
    </div>
  );
}
