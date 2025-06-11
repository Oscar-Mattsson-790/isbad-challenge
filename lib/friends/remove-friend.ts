import { SupabaseClient } from "@supabase/supabase-js";

export const removeFriend = async (
  supabase: SupabaseClient,
  userId: string,
  friendId: string
) => {
  const { error } = await supabase
    .from("friends")
    .delete()
    .eq("user_id", userId)
    .eq("friend_id", friendId);

  if (error) throw error;
};
