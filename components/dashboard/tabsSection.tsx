import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TabsSection() {
  return (
    <Tabs defaultValue="friends" className="w-full">
      <TabsList className="bg-[#2B2B29]">
        <TabsTrigger value="friends">Friends</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
      </TabsList>
      <TabsContent value="friends" className="border-none p-0 pt-4">
        <FriendsList />
      </TabsContent>
      <TabsContent value="challenges" className="border-none p-0 pt-4">
        <Card className="bg-[#2B2B29] text-white border-none">
          <CardHeader>
            <CardTitle>Active challenges</CardTitle>
            <CardDescription className="text-white">
              See your ongoing challenges with friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              You have no active challenges at the moment.
            </p>
            <Button className="mt-4 border bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white">
              Challenge a friend
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
