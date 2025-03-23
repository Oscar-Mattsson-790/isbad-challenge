interface UserProgressProps {
  value: number;
}

export function UserProgress({ value }: UserProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div>Progress</div>
        <div className="font-medium">{value}%</div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-[#0B4F82]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
