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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends-list";
import { ProgressCard } from "@/components/progress-card";
import { loadOrCreateUserProfile } from "@/lib/profile/load-or-create-profile";
import { useBathStats } from "@/lib/hooks/use-bath-stats";

export default function Dashboard() {
  const [challengeLength, setChallengeLength] = useState(30);
  const [challengeStartedAt, setChallengeStartedAt] = useState<string | null>(
    null
  );
  const [challengeActive, setChallengeActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { supabase, session, initialLoading } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const { stats, fetchBathData } = useBathStats(supabase, session?.user.id);

  useEffect(() => {
    const init = async () => {
      if (initialLoading) return;

      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(true);
      const profile = await loadOrCreateUserProfile(supabase, session.user);
      setProfile(profile);
      setChallengeLength(profile.challenge_length ?? 30);
      setChallengeStartedAt(profile.challenge_started_at ?? null);
      setChallengeActive(profile.challenge_active ?? false);
      await fetchBathData();
      setLoading(false);
    };

    init();
  }, [initialLoading, session, router, supabase, fetchBathData]);

  const startChallenge = async (days: number) => {
    if (!session) return;
    const today = new Date().toISOString().split("T")[0];

    setChallengeLength(days);
    setChallengeStartedAt(today);
    setChallengeActive(true);

    await supabase
      .from("profiles")
      .update({
        challenge_length: days,
        challenge_started_at: today,
        challenge_active: true,
      })
      .eq("id", session.user.id);
  };

  const cancelChallenge = async () => {
    if (!session) return;

    setChallengeActive(false);
    setChallengeStartedAt(null);

    await supabase
      .from("profiles")
      .update({
        challenge_active: false,
        challenge_started_at: null,
      })
      .eq("id", session.user.id);
  };

  const resetChallenge = async () => {
    if (!session) return;

    setChallengeActive(false);
    setChallengeStartedAt(null);
    setChallengeLength(30); // default

    await supabase
      .from("profiles")
      .update({
        challenge_active: false,
        challenge_started_at: null,
        challenge_length: 30,
      })
      .eq("id", session.user.id);
  };

  if (loading || initialLoading)
    return <div className="container py-10">Loading...</div>;

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

        {!challengeActive && (
          <div>
            <p>Start a new challenge, choose a duration:</p>
            <div className="grid grid-cols-3 gap-1 max-w-sm">
              {[10, 15, 30, 50, 100, 365].map((days) => (
                <Button
                  className="bg-[#1AA7EC] hover:bg-[#1AA7EC]/90"
                  key={days}
                  onClick={() => startChallenge(days)}
                >
                  {days}
                </Button>
              ))}
            </div>
          </div>
        )}

        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <BathStatsCard
              title="Days completed"
              value={stats.daysCompleted.toString()}
              description={`out of ${challengeLength} days`}
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
                {challengeActive
                  ? `Your ${challengeLength}-day challenge`
                  : "Choose your challenge"}
              </CardTitle>
              <CardDescription className="text-center">
                {challengeStartedAt
                  ? `Started on ${new Date(challengeStartedAt).toLocaleDateString("sv-SE")}`
                  : "Track your progress in the calendar below"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <BathCalendar activities={stats?.activities ?? []} />
            </CardContent>
          </Card>

          <ProgressCard
            progress={Math.min(stats?.daysCompleted ?? 0, challengeLength)}
            challengeLength={challengeLength}
            onCancel={
              challengeActive && (stats?.daysCompleted ?? 0) < challengeLength
                ? cancelChallenge
                : undefined
            }
            onCompleteReset={
              challengeActive && (stats?.daysCompleted ?? 0) >= challengeLength
                ? resetChallenge
                : undefined
            }
          />

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
