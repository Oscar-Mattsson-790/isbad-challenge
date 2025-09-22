export function computeMyProgressDays(
  activities: { date?: string | null }[] | undefined,
  challengeStartedAt: string | null,
  todayLocal: string
): number {
  if (!challengeStartedAt) return 0;

  const uniqueBeforeToday = new Set(
    (activities ?? [])
      .filter(
        (a) => a?.date && a.date >= challengeStartedAt && a.date < todayLocal
      )
      .map((a) => a!.date as string)
  ).size;

  const hasToday = (activities ?? []).some(
    (a) => a?.date && a.date >= challengeStartedAt && a.date === todayLocal
  );

  return uniqueBeforeToday + (hasToday ? 1 : 0);
}

export function computeFriendProgress(
  friendBathDates: { date: string }[] | undefined,
  pairStartISO: string,
  includeToday = true,
  todayLocal?: string
): number {
  const dates = (friendBathDates ?? [])
    .map((r) => r.date)
    .filter((d) => d && d >= pairStartISO);

  const set = new Set<string>(
    includeToday || !todayLocal ? dates : dates.filter((d) => d < todayLocal)
  );

  return set.size;
}
