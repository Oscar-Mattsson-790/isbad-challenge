import { BathStatsCard } from "@/components/bath-stats-card";

type Props = {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any;
  challengeLength: number;
};

export function StatsGrid({ stats, challengeLength }: Props) {
  return (
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
  );
}
