import { SupabaseClient } from "@supabase/supabase-js";

export const fetchFriends = async (
  supabase: SupabaseClient,
  userId: string
) => {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      id,
      friend_id,
      profiles:friend_id (
        id,
        full_name,
        email,
        avatar_url
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
