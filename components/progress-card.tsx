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
};

export function ProgressCard({
  progress,
  challengeLength,
  onCancel,
  onCompleteReset,
}: Props) {
  const percentage = Math.min((progress / challengeLength) * 100, 100);
  const nextMilestone =
    progress >= challengeLength
      ? "Challenge complete! 🎉"
      : `${challengeLength} days – Keep going!`;

  return (
    <Card className="col-span-7 md:col-span-3 lg:col-span-1 bg-[#242422] text-white border-none">
      <CardHeader>
        <CardTitle className="text-[#1AA7EC]">Your progress</CardTitle>
        <CardDescription className="text-white">
          Progress towards your {challengeLength}-day goal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Progress</div>
            <div className="font-medium">{Math.round(percentage)}%</div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-[#1AA7EC]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <h3 className="mt-4 font-medium text-[#1AA7EC]">Next milestone</h3>
        <p className="text-sm text-white mb-4">{nextMilestone}</p>

        {onCancel && (
          <Button
            className="bg-[#1AA7EC] border-[1px] border-white hover:bg-black hover:text-white hover:border-white hover:border-[1px]"
            size="lg"
            onClick={onCancel}
          >
            Cancel Challenge
          </Button>
        )}

        {onCompleteReset && (
          <div className="space-y-2 mt-4">
            <p className="text-sm text-center font-medium">
              🎉 Congratulations!
            </p>
            <Button
              className="bg-[#1AA7EC] border-[1px] border-white hover:bg-black hover:text-white hover:border-white hover:border-[1px]"
              size="lg"
              onClick={onCompleteReset}
            >
              Start a new challenge
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
