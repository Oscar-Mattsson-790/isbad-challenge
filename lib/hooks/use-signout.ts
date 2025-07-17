"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { toast } from "sonner";

export function useSignOut() {
  const { supabase } = useSupabase();
  const router = useRouter();

  return async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out error", { description: error.message });
    } else {
      router.push("/");
      router.refresh();
    }
  };
}
