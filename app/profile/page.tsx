"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UserProfile {
  full_name: string;
  email: string;
}

export default function ProfilePage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile", { description: error.message });
        return;
      }

      if (data) {
        const profile = data as UserProfile;
        setFullName(profile.full_name ?? "");
        setEmail(profile.email ?? session.user.email);
      }
    };

    loadProfile();
  }, [session, supabase, router]);

  const handleUpdate = async () => {
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", session.user.id);

    if (error) {
      toast.error("Failed to update profile", { description: error.message });
    } else {
      toast.success("Profile updated");
    }
  };

  return (
    <div className="container pt-20 py-10 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email (readonly)</Label>
          <Input id="email" value={email} disabled />
        </div>

        <Button
          onClick={handleUpdate}
          className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
          size="lg"
        >
          Update Profile
        </Button>
      </div>
    </div>
  );
}
