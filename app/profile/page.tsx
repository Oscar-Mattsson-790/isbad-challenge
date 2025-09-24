"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import LayoutWrapper from "@/components/layout-wrapper";

interface UserProfile {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
}

export default function ProfilePage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url, phone")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile", { description: error.message });
        return;
      }

      if (data) {
        const p = data as UserProfile;
        setFullName(p.full_name ?? "");
        setEmail(p.email ?? session.user.email ?? "");
        setAvatarUrl(p.avatar_url ?? null);
        setPhone(p.phone ?? "");
      }
    };

    loadProfile();
  }, [session, supabase, router]);

  const handleSave = async () => {
    if (!session) return;

    if (phone && !/^\+[1-9]\d{1,14}$/.test(phone)) {
      toast.error("Invalid phone number", {
        description: "Use international format, e.g. +46701234567.",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
      })
      .eq("id", session.user.id);

    setSaving(false);

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

  const handlePasswordReset = async () => {
    if (!session || !session.user.email) {
      toast.error("No email found for this user");
      return;
    }

    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      session.user.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
      }
    );
    setResetting(false);

    if (error) {
      toast.error("Failed to send reset email", { description: error.message });
    } else {
      toast.success("Password reset link sent to your email");
    }
  };

  return (
    <LayoutWrapper>
      <div className="container pt-20 py-10 max-w-2xl mx-auto text-white px-5">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <div className="rounded-xl bg-[#2B2B29] border border-white/5 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <label
              htmlFor="avatar"
              className="relative cursor-pointer rounded-full bg-[#1f1f1d] w-28 h-28 flex items-center justify-center hover:shadow-[0_4px_20px_0_#157FBF] overflow-hidden"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile avatar"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="text-white text-xs">Upload</span>
              )}
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>

            <div>
              <div className="text-sm text-white/70">Email</div>
              <div className="text-sm">{email}</div>
              <Button
                onClick={handlePasswordReset}
                disabled={resetting}
                className="mt-3 bg-transparent border border-white/20 hover:bg-white/10 text-white"
                size="sm"
              >
                {resetting ? "Sending…" : "Send password reset"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+46701234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-white/50">
                Use international format (E.164), e.g. +46701234567.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#157FBF] hover:bg-[#115F93] text-white"
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
