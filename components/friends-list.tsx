/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, UserPlus, X } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function FriendsList() {
  const { supabase, session } = useSupabase();
  const [friends, setFriends] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const fetchFriends = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("friends")
      .select("id, friend_id, profiles:friend_id (full_name, email)")
      .eq("user_id", session.user.id);

    if (!error) {
      setFriends(data);
    } else {
      console.error("Failed to load friends", error);
    }
  };

  const handleSearch = async () => {
    if (!session || !searchEmail.trim()) return;

    const trimmedEmail = searchEmail.trim();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", `%${trimmedEmail}%`);

    console.log("Search result:", data, "Error:", error);

    if (!error && data && data.length > 0) {
      const alreadyFriend = friends.some((f) => f.friend_id === data[0].id);
      if (data[0].id === session.user.id || alreadyFriend) {
        setSearchResult(null);
      } else {
        setSearchResult(data[0]);
      }
    } else {
      setSearchResult(null);
    }
  };

  const addFriend = async () => {
    if (!session || !searchResult) return;

    const { error } = await supabase.from("friends").insert({
      id: uuidv4(),
      user_id: session.user.id,
      friend_id: searchResult.id,
      status: "pending",
    });

    if (!error) {
      setSearchResult(null);
      setSearchEmail("");
      fetchFriends();
    } else {
      console.error("Failed to add friend", error);
    }
  };

  const removeFriend = async (friendId: string) => {
    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("user_id", session!.user.id)
      .eq("friend_id", friendId);

    if (error) {
      toast.error("Failed to remove friend", { description: error.message });
    } else {
      toast.success("Friend removed");
      fetchFriends();
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Friends</CardTitle>
        </div>
        <CardDescription>
          Track your friends’ progress in the challenge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4 flex gap-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email..."
            className="pl-8"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <Button size="sm" onClick={handleSearch}>
            <UserPlus className="mr-1 h-4 w-4" />
            Find
          </Button>
        </div>

        {searchResult && (
          <div className="mb-4 flex items-center justify-between rounded border p-2">
            <div>
              <div className="font-medium">{searchResult.full_name}</div>
              <div className="text-sm text-muted-foreground">
                {searchResult.email}
              </div>
            </div>
            <Button onClick={addFriend} size="sm" variant="outline">
              Add Friend
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.friend_id}
              className="flex items-center justify-between gap-4 border rounded p-2"
            >
              <div>
                <div className="font-medium">{friend.profiles.full_name}</div>
                <div className="text-sm text-muted-foreground">
                  {friend.profiles.email}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFriend(friend.friend_id)}
                title="Remove friend"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
