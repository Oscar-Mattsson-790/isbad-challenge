import { useState, useEffect } from "react";
import { loadOrCreateUserProfile } from "@/lib/profile/load-or-create-profile";
import { useSupabase } from "@/components/supabase-provider";

export function useUserProfile() {
  const { supabase, session } = useSupabase();
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (session) {
        const data = await loadOrCreateUserProfile(supabase, session.user);
        setProfile(data);
      }
      setLoading(false);
    };
    load();
  }, [supabase, session]);

  return { profile, loading };
}
