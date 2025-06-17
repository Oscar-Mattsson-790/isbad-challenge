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
    };
    await supabase.from("profiles").insert([newProfile]);
    return newProfile;
  }

  return data;
}
