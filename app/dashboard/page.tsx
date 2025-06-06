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

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    async function checkSession() {
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [session, supabase, router]);

  if (loading) {
    return <div className="container py-10">Loading...</div>;
  }

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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <BathStatsCard
            title="Days completed"
            value="12"
            description="out of 30 days"
          />
          <BathStatsCard
            title="Longest bath"
            value="2:45"
            description="minutes"
          />
          <BathStatsCard
            title="Latest bath"
            value="Today"
            description="10:30"
          />
          <BathStatsCard
            title="Average"
            value="1:30"
            description="minutes per bath"
          />
        </div>

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
              <UserProgress value={40} />
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
              <RecentActivity />
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
      <AddBathModal open={open} setOpen={setOpen} />
    </div>
  );
}
