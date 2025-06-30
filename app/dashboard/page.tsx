"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BathCalendar } from "@/components/bath-calendar";
import { BathStatsCard } from "@/components/bath-stats-card";
import { RecentActivity } from "@/components/recent-activity";
import AddBathModal from "@/components/add-bath-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends-list";
import { ProgressCard } from "@/components/progress-card";
import { loadOrCreateUserProfile } from "@/lib/profile/load-or-create-profile";
import { useBathStats } from "@/lib/hooks/use-bath-stats";
import Image from "next/image";

export default function Dashboard() {
  const [challengeLength, setChallengeLength] = useState(30);
  const [challengeStartedAt, setChallengeStartedAt] = useState<string | null>(
    null
  );
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeFailed, setChallengeFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const { supabase, session, initialLoading } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);

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

      if (window.location.hash === "#recent-activity") {
        const el = document.getElementById("recent-activity");
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
        }
      }

      if (window.location.hash === "#calendar-section") {
        const el = document.getElementById("calendar-section");
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
        }
      }

      // Kontroll för misslyckad utmaning
      if (profile.challenge_active && profile.challenge_started_at) {
        if (!stats) return;

        const started = new Date(profile.challenge_started_at);
        const today = new Date();
        const diffDays = Math.floor(
          (today.getTime() - started.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (
          diffDays > stats.daysCompleted &&
          today.toDateString() !== started.toDateString()
        ) {
          setChallengeFailed(true);
          await resetChallenge(); // nollställ progress
        }
      }
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

  const resetChallenge = useCallback(async () => {
    if (!session) return;
    setChallengeActive(false);
    setChallengeStartedAt(null);
    setChallengeLength(30);
    await supabase
      .from("profiles")
      .update({
        challenge_active: false,
        challenge_started_at: null,
        challenge_length: 30,
      })
      .eq("id", session.user.id);
  }, [session, supabase]);

  if (loading || initialLoading)
    return <div className="container py-10 text-white">Loading...</div>;

  return (
    <div className="w-full bg-[#242422] text-white px-4 md:px-8 lg:px-16 xl:px-32 py-6">
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex gap-5 items-center md:w-3/4">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#2B2B29] text-white p-0 hover:shadow-[0_4px_20px_0_#157FBF] border-none">
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
                Hi {profile?.full_name || "there"}!
              </h1>
              <p className="text-white text-xs md:text-sm pb-2">
                Keep track of your ice bath <br />
                challenge and follow your progress.
              </p>
            </div>
          </div>

          <div className="md:w-1/4 w-full flex items-center">
            <Button
              onClick={() => setOpen(true)}
              className="w-full h-12 bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
            >
              Log new ice bath
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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

        {/* Calendar and Progress */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8">
          <Card
            id="calendar-section"
            className="scroll-mt-[60px] bg-[#242422] border-none w-full"
          >
            <CardHeader className="p-0">
              <CardTitle className="text-center text-white text-xl">
                {challengeActive
                  ? `Your ${challengeLength}-day challenge`
                  : "Choose your challenge"}
              </CardTitle>
              <CardDescription className="text-center text-white pb-2">
                {challengeStartedAt
                  ? `Started on ${new Date(challengeStartedAt).toLocaleDateString("sv-SE")}`
                  : "Track your progress in the calendar below"}
              </CardDescription>

              {!challengeActive && (
                <div className="w-full rounded-sm bg-[#2B2B29] text-white p-5 hover:shadow-[0_4px_20px_0_#157FBF]">
                  <p className="text-white text-[13px] text-center pb-2">
                    Start a new challenge, choose a duration
                  </p>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {[10, 15, 30, 50, 100, 365].map((days) => (
                      <Button
                        key={days}
                        className="w-full bg-[#157FBF] hover:bg-[#157FBF]/90 h-12"
                        onClick={() => startChallenge(days)}
                      >
                        {days}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="px-0">
              <BathCalendar activities={stats?.activities ?? []} />
            </CardContent>
          </Card>

          <ProgressCard
            className="w-full"
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
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#242422] border-none text-white w-full lg:col-span-2">
          <CardHeader id="recent-activity" className="px-0 scroll-mt-20">
            <CardTitle className="text-white">Recent activity</CardTitle>
            <CardDescription className="text-white">
              Your latest entries in the challenge
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <RecentActivity activities={stats?.activities ?? []} />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="bg-[#2B2B29]">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          <TabsContent value="friends" className="border-none p-0 pt-4">
            <FriendsList />
          </TabsContent>
          <TabsContent value="challenges" className="border-none p-0 pt-4">
            <Card className="bg-[#2B2B29] text-white border-none">
              <CardHeader>
                <CardTitle>Active challenges</CardTitle>
                <CardDescription className="text-white">
                  See your ongoing challenges with friends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  You have no active challenges at the moment.
                </p>
                <Button className="mt-4 border bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white">
                  Challenge a friend
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal */}
        <AddBathModal
          open={open}
          setOpen={setOpen}
          onBathAdded={() => {
            fetchBathData();
            setOpen(false);
          }}
        />

        {/* 🔴 Failed Modal */}
        <Dialog open={challengeFailed} onOpenChange={setChallengeFailed}>
          <DialogContent className="bg-red-700 text-white border-none">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Failed challenge, try again
              </DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm">
              You missed a day. Please start a new challenge.
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
