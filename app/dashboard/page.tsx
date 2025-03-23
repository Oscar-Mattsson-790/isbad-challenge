"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BathCalendar } from "@/components/bath-calendar";
import { BathStatsCard } from "@/components/bath-stats-card";
import { RecentActivity } from "@/components/recent-activity";
import AddBathModal from "@/components/add-bath-modal";
import { UserProgress } from "@/components/user-progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends-list";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function checkSession() {
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [session, supabase, router]);

  if (loading) {
    return <div className="container py-10">Laddar...</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hej {profile?.full_name || "där"}!
            </h1>
            <p className="text-muted-foreground">
              Håll koll på din 30-dagars isbad utmaning och följ din progress
            </p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-[#0B4F82] hover:bg-[#0A3F69]"
          >
            Registrera nytt isbad
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <BathStatsCard
            title="Dagar avklarade"
            value="12"
            description="av 30 dagar"
          />
          <BathStatsCard
            title="Längsta badet"
            value="2:45"
            description="minuter"
          />
          <BathStatsCard
            title="Senaste badet"
            value="Idag"
            description="10:30"
          />
          <BathStatsCard
            title="Medelvärde"
            value="1:30"
            description="minuter per bad"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-3 lg:gap-8">
          <Card className="col-span-7 lg:col-span-2">
            <CardHeader>
              <CardTitle>Din 30-dagars utmaning</CardTitle>
              <CardDescription>
                Följ din progress i kalendern nedan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BathCalendar />
            </CardContent>
          </Card>
          <Card className="col-span-7 md:col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle>Din progress</CardTitle>
              <CardDescription>
                Din progress mot målet på 30 dagar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserProgress value={40} />
              <h3 className="mt-4 text-lg font-medium">Nästa milstolpe</h3>
              <p className="text-sm text-muted-foreground">
                15 dagar - Halvvägs!
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-7 md:col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Senaste aktivitet</CardTitle>
              <CardDescription>
                De senaste registreringarna i din utmaning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList>
            <TabsTrigger value="friends">Vänner</TabsTrigger>
            <TabsTrigger value="challenges">Utmaningar</TabsTrigger>
          </TabsList>
          <TabsContent value="friends" className="border-none p-0 pt-4">
            <FriendsList />
          </TabsContent>
          <TabsContent value="challenges" className="border-none p-0 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Aktiva utmaningar</CardTitle>
                <CardDescription>
                  Här ser du dina pågående utmaningar med vänner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Du har inga aktiva utmaningar för tillfället.
                </p>
                <Button className="mt-4 bg-[#0B4F82] hover:bg-[#0A3F69]">
                  Utmana en vän
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AddBathModal open={open} setOpen={setOpen} />
    </div>
  );
}
