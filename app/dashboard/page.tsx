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

type BuddyState = {
  friendName: string;
  friendProgress: number;
  friendLength: number;
} | null;

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

  const [buddy, setBuddy] = useState<BuddyState>(null);

  const countUniqueDates = (rows: { date: string }[]) => {
    const s = new Set<string>();
    rows.forEach((r) => s.add(r.date));
    return s.size;
  };

  const fetchBuddy = useCallback(async () => {
    if (!session || !challengeActive) return setBuddy(null);

    const { data: fr } = await supabase
      .from("friends")
      .select(
        "friend_id, profiles:friend_id(full_name, email, challenge_started_at, challenge_length, challenge_active)"
      )
      .eq("user_id", session.user.id)
      .eq("status", "accepted")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // @ts-expect-error Supabase type join alias
    const p = fr?.profiles as {
      full_name: string | null;
      email: string | null;
      challenge_started_at: string | null;
      challenge_length: number | null;
      challenge_active: boolean | null;
    };

    if (
      !fr ||
      !p ||
      !fr.friend_id ||
      !p.challenge_active ||
      !p.challenge_started_at
    ) {
      setBuddy(null);
      return;
    }

    const friendId = fr.friend_id as string;

    const friendName =
      p.full_name && p.full_name.trim().length > 0
        ? p.full_name
        : p.email || "Friend";
    const friendStart = p.challenge_started_at;
    const friendLen = p.challenge_length ?? 30;

    const { data: friendBaths } = await supabase
      .from("baths")
      .select("date")
      .eq("user_id", friendId)
      .gte("date", friendStart);

    const friendProgress = countUniqueDates(friendBaths ?? []);

    setBuddy({
      friendName,
      friendProgress,
      friendLength: friendLen,
    });
  }, [session, supabase, challengeActive]);

  useEffect(() => {
    const init = async () => {
      if (initialLoading) return;

      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(true);
      const prof = await loadOrCreateUserProfile(supabase, session.user);
      setProfile(prof);

      setChallengeLength(prof.challenge_length ?? 30);
      setChallengeStartedAt(prof.challenge_started_at ?? null);
      setChallengeActive(prof.challenge_active ?? false);

      await fetchBathData();
      await fetchBuddy();
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

      if (prof.challenge_active && prof.challenge_started_at && stats) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hasBatchedToday = stats.activities.some(
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          (activity: any) =>
            new Date(activity.date).toDateString() === today.toDateString()
        );

        if (!hasBatchedToday) {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          const missedYesterday = !stats.activities.some(
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (activity: any) =>
              new Date(activity.date).toDateString() ===
              yesterday.toDateString()
          );

          if (
            missedYesterday &&
            today.toDateString() !==
              new Date(prof.challenge_started_at).toDateString()
          ) {
            setChallengeFailed(true);
            await resetChallenge();
          }
        }
      }
    };

    init();
  }, [initialLoading, session, router, supabase, fetchBathData, fetchBuddy]);

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

    await fetchBathData();
    await fetchBuddy();
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

    await fetchBathData();
    await fetchBuddy();
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

    await fetchBathData();
    await fetchBuddy();
  }, [session, supabase, fetchBathData, fetchBuddy]);

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
          buddy={challengeActive ? buddy : null}
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
          onBathAdded={async () => {
            await fetchBathData();
            await fetchBuddy();
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
