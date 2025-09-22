import { BathStatsCard } from "@/components/bath-stats-card";
import type { BathStats } from "@/lib/get-bath-stats";

type Props = {
  stats: BathStats;
  challengeLength?: number;
  mode?: "self" | "friend";
};

export function StatsGrid({
  stats,
  challengeLength = 0,
  mode = "self",
}: Props) {
  const daysDescription =
    mode === "self"
      ? `out of ${challengeLength} days`
      : `out of ${stats.activities.length} total baths`;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-4">
      <BathStatsCard
        title="Days completed"
        value={stats.daysCompleted.toString()}
        description={daysDescription}
      />
      <BathStatsCard
        title="Longest bath"
        value={stats.longestBath}
        description="Your longest bath"
      />
      <BathStatsCard
        title="Average duration"
        value={stats.averageDuration}
        description="Average bath time"
      />
      <BathStatsCard
        title="Latest bath"
        value={stats.latestBath}
        description={`at ${stats.latestTime}`}
      />
    </div>
  );
}
