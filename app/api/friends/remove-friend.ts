import type { SupabaseClient } from "@supabase/supabase-js";

export async function removeFriend(friendId: string): Promise<void>;
export async function removeFriend(
  _supa: SupabaseClient,
  _userId: string,
  friendId: string
): Promise<void>;
export async function removeFriend(
  arg1: string | SupabaseClient,
  _arg2?: string,
  arg3?: string
): Promise<void> {
  const friendId =
    typeof arg1 === "string" ? arg1 : (arg3 as string | undefined);
  if (!friendId) throw new Error("friendId is required");

  const res = await fetch("/api/friends/remove", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("friend-challenges-updated"));
  }
}
