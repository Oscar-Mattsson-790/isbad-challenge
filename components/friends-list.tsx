import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, UserPlus } from "lucide-react";

export function FriendsList() {
  const friends = [
    {
      id: 1,
      name: "Anna Andersson",
      progress: 18,
      status: "online",
    },
    {
      id: 2,
      name: "Erik Eriksson",
      progress: 25,
      status: "offline",
    },
    {
      id: 3,
      name: "Maria Svensson",
      progress: 15,
      status: "online",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dina vänner</CardTitle>
          <Button variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Hitta vänner
          </Button>
        </div>
        <CardDescription>
          Följ dina vänners progress i isbad-utmaningen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Sök bland dina vänner..."
            className="pl-8"
          />
        </div>
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt={friend.name}
                    className="rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      friend.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <div className="font-medium">{friend.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {friend.progress} dagar avklarade
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-[#0B4F82] hover:bg-[#0A3F69]">
                Utmana
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full">
          Visa alla
        </Button>
      </CardContent>
    </Card>
  );
}
