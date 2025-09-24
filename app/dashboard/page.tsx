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
import { useBuddy } from "@/lib/hooks/use-buddy";
import { useChallengeActions } from "@/lib/hooks/use-challenge-actions";

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

  const [profile, setProfile] = useState<any>(null);
  const { stats, fetchBathData } = useBathStats(
    supabase,
    session?.user.id,
    challengeStartedAt
  );

  const { fetchBuddy } = useBuddy(supabase, session?.user.id, challengeActive);

  const {
    startChallenge: dbStart,
    cancelChallenge: dbCancel,
    resetChallenge: dbReset,
  } = useChallengeActions(supabase, session?.user.id);

  const refreshAll = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    const prof = await loadOrCreateUserProfile(supabase, session.user);
    setProfile(prof);
    setChallengeLength(prof.challenge_length ?? 30);
    setChallengeStartedAt(prof.challenge_started_at ?? null);
    setChallengeActive(prof.challenge_active ?? false);

    await fetchBathData();
    await fetchBuddy();

    setLoading(false);
  }, [session, supabase, fetchBathData, fetchBuddy]);

  useEffect(() => {
    const init = async () => {
      if (initialLoading) return;

      if (!session) {
        router.push("/login");
        return;
      }

      await refreshAll();

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

      if (profile?.challenge_active && profile?.challenge_started_at && stats) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const isFirstDay =
          today.toDateString() ===
          new Date(profile.challenge_started_at).toDateString();

        const missedYesterday = !stats.activities.some(
          (a: any) =>
            new Date(a.date).toDateString() === yesterday.toDateString()
        );

        if (missedYesterday && !isFirstDay) {
          setChallengeFailed(true);
          await resetChallenge();
        }
      }
    };

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoading, session, router, refreshAll]);

  useEffect(() => {
    const handler = () => {
      void refreshAll();
    };
    window.addEventListener("challenge-started", handler as EventListener);
    return () =>
      window.removeEventListener("challenge-started", handler as EventListener);
  }, [refreshAll]);

  const startChallenge = async (days: number) => {
    if (!session) return;
    const today = new Date().toISOString().split("T")[0];

    setChallengeLength(days);
    setChallengeStartedAt(today);
    setChallengeActive(true);

    await dbStart(days, today);

    await Promise.all([fetchBathData(), fetchBuddy()]);
  };

  const cancelChallenge = async () => {
    if (!session) return;

    setChallengeActive(false);
    setChallengeStartedAt(null);

    await dbCancel();
    await Promise.all([fetchBathData(), fetchBuddy()]);
  };

  const resetChallenge = useCallback(async () => {
    if (!session) return;

    // endast din egen
    setChallengeActive(false);
    setChallengeStartedAt(null);
    setChallengeLength(30);
    await dbReset();

    await Promise.all([fetchBathData(), fetchBuddy()]);
  }, [session, dbReset, fetchBathData, fetchBuddy]);

  if (loading || initialLoading) {
    return <div className="container py-10 text-white">Loading...</div>;
  }

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

        <TabsSection layout="stacked" />

        <AddBathModal
          open={open}
          setOpen={setOpen}
          onBathAdded={async () => {
            await Promise.all([fetchBathData(), fetchBuddy()]);
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
