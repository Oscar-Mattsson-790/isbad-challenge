"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { toast } from "sonner";
import { sendInvite } from "@/lib/send-invite";
import { fetchFriends } from "@/lib/friends/fetch-friends";
import { addFriend } from "@/lib/friends/add-friend";
import { removeFriend } from "@/lib/friends/remove-friend";

export function FriendsList() {
  const { supabase, session } = useSupabase();
  const [friends, setFriends] = useState<any[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const loadFriends = async () => {
    if (!session) return;
    try {
      const data = await fetchFriends(supabase, session.user.id);
      setFriends(data);
    } catch (err) {
      console.error("Failed to load friends", err);
    }
  };

  const handleSearch = async () => {
    if (!session || !searchName.trim()) return;

    const trimmed = searchName.trim();
    let foundProfiles: any[] = [];

    // 1. Försök hitta via namn
    const { data: nameMatches, error: nameError } = await supabase
      .from("profiles")
      .select("*")
      .ilike("full_name", `%${trimmed}%`);

    if (nameError) {
      toast.error("Search failed", { description: nameError.message });
      return;
    }

    if (nameMatches && nameMatches.length > 0) {
      foundProfiles = nameMatches;
    } else {
      // 2. Om inget matchar på namn, försök hitta via email exakt
      const { data: emailMatch, error: emailError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", trimmed);

      if (emailError) {
        toast.error("Email search failed", { description: emailError.message });
        return;
      }

      if (emailMatch && emailMatch.length > 0) {
        foundProfiles = emailMatch;
      }
    }

    if (foundProfiles.length > 0) {
      const filtered = foundProfiles.filter(
        (person) =>
          person.id !== session.user.id &&
          !friends.some((f) => f.friend_id === person.id)
      );

      setSearchResult(filtered.length > 0 ? filtered[0] : null);
    } else {
      // 3. Skicka invite endast om det verkligen inte finns någon användare alls
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmed)) {
        await sendInvite(trimmed); // 📨 Skicka inbjudan
      } else {
        toast.error("No match", {
          description: "No match found and input is not an email address.",
        });
      }

      setSearchResult(null);
    }
  };

  const handleAddFriend = async () => {
    if (!session || !searchResult) return;
    try {
      await addFriend(supabase, session.user.id, searchResult.id);
      toast.success("Friend added!");
      setSearchResult(null);
      setSearchName("");
      loadFriends();
    } catch (err: any) {
      toast.error("Failed to add friend", { description: err.message });
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!session) return;
    try {
      await removeFriend(supabase, session.user.id, friendId);
      toast.success("Friend removed");
      loadFriends();
    } catch (err: any) {
      toast.error("Failed to remove friend", { description: err.message });
    }
  };

  useEffect(() => {
    loadFriends();
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Find Your Friends</CardTitle>
        </div>
        <CardDescription>
          Track your friends progress in the challenge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4 flex gap-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
            </div>
            <Button onClick={handleAddFriend} size="sm" variant="outline">
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
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFriend(friend.friend_id)}
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
