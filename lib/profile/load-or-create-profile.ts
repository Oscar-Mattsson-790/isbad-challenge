import { SupabaseClient } from "@supabase/supabase-js";

export async function loadOrCreateUserProfile(
  supabase: SupabaseClient,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching profile:", error);
    return null;
  }

  if (!data) {
    const newProfile = {
      id: user.id,
      full_name: user.user_metadata.full_name ?? "",
      email: user.email ?? "",
      challenge_length: 30,
      challenge_active: false,
      challenge_started_at: null,
    };
    const { data: insertedProfile } = await supabase
      .from("profiles")
      .insert([newProfile])
      .select()
      .single();

    return insertedProfile;
  }

  return data;
}
