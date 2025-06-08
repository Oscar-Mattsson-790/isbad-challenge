// components/progress-card.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function ProgressCard({ progress }: { progress: number }) {
  const percentage = progress * (100 / 30);
  const nextMilestone =
    progress >= 15 ? "30 days – Almost done!" : "15 days – Halfway there!";

  return (
    <Card className="col-span-7 md:col-span-3 lg:col-span-1">
      <CardHeader>
        <CardTitle>Your progress</CardTitle>
        <CardDescription>Your progress towards the 30-day goal</CardDescription>
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
        <h3 className="mt-4 text-lg font-medium">Next milestone</h3>
        <p className="text-sm text-muted-foreground">{nextMilestone}</p>
      </CardContent>
    </Card>
  );
}
