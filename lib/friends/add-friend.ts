import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export const addFriend = async (
  supabase: SupabaseClient,
  userId: string,
  friendId: string
) => {
  const { error } = await supabase.from("friends").insert({
    id: uuidv4(),
    user_id: userId,
    friend_id: friendId,
    status: "pending",
  });

  if (error) throw error;
};
