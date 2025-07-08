"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadOrCreateUserProfile } from "@/lib/profile/load-or-create-profile";
import { useBathStats } from "@/lib/hooks/use-bath-stats";
import AddBathModal from "@/components/add-bath-modal";
import { RecentActivity } from "@/components/recent-activity";
import { HeaderSection } from "@/components/dashboard/headerSection";
import { StatsGrid } from "@/components/dashboard/statsGrid";
import { ChallengeSection } from "@/components/dashboard/challengeSection";
import { TabsSection } from "@/components/dashboard/tabsSection";
import { FailedChallengeModal } from "@/components/dashboard/failedChallengeModal";
import LayoutWrapper from "@/components/layout-wrapper";

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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);

  const { stats, fetchBathData } = useBathStats(
    supabase,
    session?.user.id,
    challengeStartedAt
  );

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
        if (el)
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
      }

      if (window.location.hash === "#calendar-section") {
        const el = document.getElementById("calendar-section");
        if (el)
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 200);
      }

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
          await resetChallenge();
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
    await fetchBathData(); // Uppdatera data direkt efter start
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
    await fetchBathData(); // 🧠 Detta gör att progress uppdateras direkt
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
    await fetchBathData(); // Uppdatera även vid reset
  }, [session, supabase, fetchBathData]);

  if (loading || initialLoading)
    return <div className="container py-10 text-white">Loading...</div>;

  return (
    <LayoutWrapper>
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-8 pt-10 px-4 sm:px-0">
        <HeaderSection profile={profile} setOpen={setOpen} />

        {stats && <StatsGrid stats={stats} challengeLength={challengeLength} />}

        <ChallengeSection
          stats={stats}
          challengeLength={challengeLength}
          challengeActive={challengeActive}
          challengeStartedAt={challengeStartedAt}
          startChallenge={startChallenge}
          cancelChallenge={cancelChallenge}
          resetChallenge={resetChallenge}
        />

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

        <TabsSection />

        <AddBathModal
          open={open}
          setOpen={setOpen}
          onBathAdded={() => {
            fetchBathData();
            setOpen(false);
          }}
        />

        <FailedChallengeModal
          challengeFailed={challengeFailed}
          setChallengeFailed={setChallengeFailed}
        />
      </div>
    </LayoutWrapper>
  );
}
