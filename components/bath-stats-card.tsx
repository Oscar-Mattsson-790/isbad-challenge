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
    <Card className="rounded-sm bg-[#2B2B29] text-white p-0 hover:shadow-[0_4px_20px_0_#157FBF] border-none">
      <CardHeader className="p-2 pb-0">
        <CardTitle className="text-md font-bold text-[#157FBF] leading-tight mb-[2px]">
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
