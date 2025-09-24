"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  progress: number;
  challengeLength: number;
  onCancel?: () => void;
  onCompleteReset?: () => void;
  className?: string;
};

export function ProgressCard({
  progress,
  challengeLength,
  onCancel,
  onCompleteReset,
  className,
}: Props) {
  const percentage = Math.min((progress / challengeLength) * 100, 100);
  const remainingDays = Math.max(challengeLength - progress, 0);
  const nextMilestone =
    progress >= challengeLength
      ? "Challenge complete! 🎉"
      : `${remainingDays} day${remainingDays === 1 ? "" : "s"} left – Keep going!`;

  return (
    <Card className={`bg-[#242422] text-white border-none ${className ?? ""}`}>
      <CardHeader className="px-0">
        <CardTitle className="text-[#157FBF]">My challenge</CardTitle>
        <CardDescription className="text-white">
          Progress towards your {challengeLength}-day goal
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        {/* Ljusgrå “vän-box”-stil */}
        <div className="rounded-lg bg-[#2B2B29] px-4 py-4 border border-white/5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>Progress</div>
              <div className="font-medium">{Math.round(percentage)}%</div>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-[#157FBF]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-[#157FBF]">Next milestone</h3>
            <p className="text-sm text-white">{nextMilestone}</p>
          </div>

          {onCancel && (
            <Button
              className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
              size="lg"
              onClick={onCancel}
            >
              Cancel Challenge
            </Button>
          )}

          {onCompleteReset && (
            <div className="space-y-2">
              <p className="text-sm text-center font-medium">
                🎉 Congratulations!
              </p>
              <Button
                className="bg-[#157FBF] border-[1px] border-white hover:bg-black hover:text-white hover:border-white hover:border-[1px]"
                size="lg"
                onClick={onCompleteReset}
              >
                Start a new challenge
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
