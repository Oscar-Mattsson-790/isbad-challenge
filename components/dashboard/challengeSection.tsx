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

type Props = {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any;
  challengeLength: number;
  challengeActive: boolean;
  challengeStartedAt: string | null;
  startChallenge: (days: number) => void;
  cancelChallenge: () => void;
  resetChallenge: () => void;
};

export function ChallengeSection({
  stats,
  challengeLength,
  challengeActive,
  challengeStartedAt,
  startChallenge,
  cancelChallenge,
  resetChallenge,
}: Props) {
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
  );
}
