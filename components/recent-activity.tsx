import Image from "next/image";
import { Button } from "@/components/ui/button";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      date: "Idag 10:30",
      duration: "1:45",
      emoji: "🔥",
      hasImage: true,
    },
    {
      id: 2,
      date: "Igår 08:15",
      duration: "2:00",
      emoji: "😊",
      hasImage: true,
    },
    {
      id: 3,
      date: "23 mars 09:45",
      duration: "1:30",
      emoji: "💪",
      hasImage: false,
    },
    {
      id: 4,
      date: "22 mars 07:30",
      duration: "2:15",
      emoji: "🥶",
      hasImage: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 rounded-lg border p-3"
          >
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="font-medium">{activity.date}</div>
                <div className="text-2xl">{activity.emoji}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Varaktighet: {activity.duration}
              </div>
            </div>
            {activity.hasImage ? (
              <div className="h-14 w-14 overflow-hidden rounded-md">
                <Image
                  src="/placeholder.svg?height=56&width=56"
                  width={56}
                  height={56}
                  alt="Bad bevis"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        Visa alla
      </Button>
    </div>
  );
}
