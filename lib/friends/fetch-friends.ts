import { SupabaseClient } from "@supabase/supabase-js";

export const fetchFriends = async (
  supabase: SupabaseClient,
  userId: string
) => {
  const { data, error } = await supabase
    .from("friends")
    .select("id, friend_id, profiles:friend_id (full_name)")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};
