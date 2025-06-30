"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

interface UserProfile {
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
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
        setAvatarUrl(profile.avatar_url ?? null);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;

    const filePath = `${session.user.id}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed", { description: uploadError.message });
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", session.user.id);

    if (updateError) {
      toast.error("Failed to save avatar", {
        description: updateError.message,
      });
    } else {
      toast.success("Avatar updated");
      setAvatarUrl(publicUrl);
    }
  };

  return (
    <div className="container pt-20 py-10 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="space-y-4">
        <div className="mb-4 flex items-center">
          <label
            htmlFor="avatar"
            className="relative cursor-pointer rounded-full bg-[#2B2B29] w-32 h-32 flex items-center justify-center hover:shadow-[0_4px_20px_0_#157FBF] overflow-hidden"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile avatar"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-sm">Upload</span>
            )}
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

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
