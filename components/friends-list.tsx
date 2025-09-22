"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Swords, X } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchFriends } from "@/lib/friends/fetch-friends";
import { removeFriend } from "@/lib/friends/remove-friend";
import { FriendStatsModal } from "@/components/friendsStatsModal";
import ChallengeFriendModal from "@/components/challenge-friend-modal";

export function FriendsList() {
  const { supabase, session } = useSupabase();
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedFriendName, setSelectedFriendName] = useState<string>("");

  const [challengeFriend, setChallengeFriend] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const nameOf = (p?: { full_name?: string | null; email?: string | null }) => {
    const n = (p?.full_name ?? "").trim();
    return n.length > 0 ? n : (p?.email ?? "Unknown");
  };

  const loadFriends = useCallback(async () => {
    if (!session) return;
    try {
      const data = await fetchFriends(supabase, session.user.id);
      setFriends(data);
    } catch (err) {
      console.error("Failed to load friends", err);
    }
  }, [supabase, session]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

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

  return (
    <Card className="w-full bg-[#2B2B29] text-white border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Friend list</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl bg-[#242422] border border-white/5 overflow-hidden">
          {friends.length === 0 ? (
            <div className="px-4 py-6 text-sm text-white/70">
              No friends yet.
            </div>
          ) : (
            friends.map((friend, idx) => {
              const p = friend.profiles;
              const display = nameOf(p);
              const notLast = idx < friends.length - 1;

              return (
                <div
                  key={friend.friend_id}
                  className={[
                    "px-4 py-3 flex items-center justify-between",
                    notLast ? "border-b border-white/5" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="h-4 w-4 text-[#157FBF] cursor-pointer"
                      onClick={() => {
                        setSelectedFriendId(friend.friend_id);
                        setSelectedFriendName(display);
                      }}
                    />
                    <button
                      className="font-medium text-left hover:underline decoration-white/20"
                      onClick={() => {
                        setSelectedFriendId(friend.friend_id);
                        setSelectedFriendName(display);
                      }}
                    >
                      {display}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
                      onClick={() =>
                        setChallengeFriend({
                          id: friend.friend_id as string,
                          label: display,
                        })
                      }
                      title="Challenge your friend"
                    >
                      <Swords className="h-4 w-4 mr-1" />
                      Challenge
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFriend(friend.friend_id)}
                      title="Remove friend"
                    >
                      <X className="h-4 w-4 text-[#157FBF]" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>

      {selectedFriendId && (
        <FriendStatsModal
          supabase={supabase}
          friendId={selectedFriendId}
          fullName={selectedFriendName}
          open={!!selectedFriendId}
          onClose={() => setSelectedFriendId(null)}
        />
      )}

      {challengeFriend && (
        <ChallengeFriendModal
          friendId={challengeFriend.id}
          friendLabel={challengeFriend.label}
          onClose={() => setChallengeFriend(null)}
        />
      )}
    </Card>
  );
}
