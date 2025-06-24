import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BathStatsCardProps {
  title: string;
  value: string;
  description: string;
}

export function BathStatsCard({
  title,
  value,
  description,
}: BathStatsCardProps) {
  return (
    <Card className="rounded-sm bg-[#242422] text-white border border-white shadow-none p-0">
      <CardHeader className="p-2 pb-0">
        <CardTitle className="text-md font-bold text-[#1AA7EC] leading-tight mb-[2px]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="text-base font-bold leading-none">{value}</div>
        <p className="text-[11px] text-white leading-tight mt-[2px]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
