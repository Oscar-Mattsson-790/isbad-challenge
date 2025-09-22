import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BathCalendar } from "@/components/bath-calendar";
import { ProgressCard } from "@/components/progress-card";
import BuddyProgressCard from "@/components/buddy-progress-card";
import { getLocalDate } from "@/lib/utils";
import { computeMyProgressDays } from "@/lib/challenge-progress";
import { useEffect, useRef } from "react";
import { useChallengeActions } from "@/lib/hooks/use-challenge-actions";
import { useSupabase } from "@/components/supabase-provider";

type Props = {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any;
  challengeLength: number;
  challengeActive: boolean;
  challengeStartedAt: string | null;
  startChallenge: (days: number) => void;
  cancelChallenge: () => void;
  resetChallenge: () => void;
  buddy?: {
    friendName: string;
    friendProgress: number;
    friendLength: number;
  } | null;
};

export function ChallengeSection({
  stats,
  challengeLength,
  challengeActive,
  challengeStartedAt,
  startChallenge,
  cancelChallenge,
  resetChallenge,
  buddy,
}: Props) {
  const todayLocal = getLocalDate(new Date());

  const myProgressDays = Math.min(
    computeMyProgressDays(stats?.activities, challengeStartedAt, todayLocal),
    challengeLength
  );

  const { supabase, session } = useSupabase();
  const { completeLatestChallenge } = useChallengeActions(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase as any,
    session?.user.id
  );

  const completionGuard = useRef<{ start: string | null; done: boolean }>({
    start: null,
    done: false,
  });

  useEffect(() => {
    if (challengeStartedAt !== completionGuard.current.start) {
      completionGuard.current = { start: challengeStartedAt, done: false };
    }

    const maybeComplete = async () => {
      if (
        challengeActive &&
        challengeStartedAt &&
        myProgressDays >= challengeLength &&
        !completionGuard.current.done
      ) {
        await completeLatestChallenge();
        completionGuard.current.done = true;

        window.dispatchEvent(new CustomEvent("challenge-completed"));
      }
    };

    void maybeComplete();
  }, [
    challengeActive,
    challengeStartedAt,
    myProgressDays,
    challengeLength,
    completeLatestChallenge,
  ]);

  return (
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

      <div className="flex flex-col gap-4">
        <ProgressCard
          className="w-full"
          progress={myProgressDays}
          challengeLength={challengeLength}
          onCancel={
            challengeActive && myProgressDays < challengeLength
              ? cancelChallenge
              : undefined
          }
          onCompleteReset={
            challengeActive && myProgressDays >= challengeLength
              ? resetChallenge
              : undefined
          }
        />

        {buddy && (
          <BuddyProgressCard
            className="w-full"
            friendName={buddy.friendName}
            friendProgress={buddy.friendProgress}
            friendLength={buddy.friendLength}
          />
        )}
      </div>
    </div>
  );
}
