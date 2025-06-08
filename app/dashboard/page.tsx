"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BathCalendar } from "@/components/bath-calendar";
import { BathStatsCard } from "@/components/bath-stats-card";
import { RecentActivity } from "@/components/recent-activity";
import AddBathModal from "@/components/add-bath-modal";
import { UserProgress } from "@/components/user-progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends-list";
import type { BathStats } from "@/lib/get-bath-stats";
import { getBathStats } from "@/lib/get-bath-stats";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<BathStats | null>(null);

  const fetchBathData = async () => {
    if (!session) return;
    const bathStats = await getBathStats(supabase, session.user.id);
    setStats(bathStats);
  };

  useEffect(() => {
    async function init() {
      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
      }

      if (!data) {
        await supabase.from("profiles").insert([
          {
            id: session.user.id,
            full_name: session.user.user_metadata.full_name ?? "",
            email: session.user.email ?? "",
          },
        ]);
      } else {
        setProfile(data);
      }

      await fetchBathData();
      setLoading(false);
    }

    init();
  }, [session]);

  if (loading) return <div className="container py-10">Loading...</div>;

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hi {profile?.full_name || "there"}!
            </h1>
            <p className="text-muted-foreground">
              Keep track of your ice bath challenge and follow your progress.
            </p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="border border-black bg-black hover:bg-white hover:text-black"
          >
            Log new ice bath
          </Button>
        </div>

        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <BathStatsCard
              title="Days completed"
              value={stats.daysCompleted.toString()}
              description="out of 30 days"
            />
            <BathStatsCard
              title="Longest bath"
              value={stats.longestBath}
              description="minutes"
            />
            <BathStatsCard
              title="Latest bath"
              value={stats.latestBath}
              description={stats.latestTime}
            />
            <BathStatsCard
              title="Average"
              value={stats.averageDuration}
              description="minutes per bath"
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-3 lg:gap-8">
          <Card className="col-span-7 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-center">
                Your 30-day challenge
              </CardTitle>
              <CardDescription className="text-center">
                Track your progress in the calendar below
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <BathCalendar />
            </CardContent>
          </Card>
          <Card className="col-span-7 md:col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle>Your progress</CardTitle>
              <CardDescription>
                Your progress towards the 30-day goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserProgress
                value={Math.min(stats?.daysCompleted ?? 0, 30) * (100 / 30)}
              />
              <h3 className="mt-4 text-lg font-medium">Next milestone</h3>
              <p className="text-sm text-muted-foreground">
                15 days – Halfway there!
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-7 md:col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Your latest entries in the challenge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={stats?.activities ?? []} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          <TabsContent value="friends" className="border-none p-0 pt-4">
            <FriendsList />
          </TabsContent>
          <TabsContent value="challenges" className="border-none p-0 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Active challenges</CardTitle>
                <CardDescription>
                  See your ongoing challenges with friends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You have no active challenges at the moment.
                </p>
                <Button className="mt-4 border border-black bg-black hover:bg-white hover:text-black">
                  Challenge a friend
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddBathModal
        open={open}
        setOpen={setOpen}
        onBathAdded={() => {
          fetchBathData();
          setOpen(false);
        }}
      />
    </div>
  );
}
