"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const [message, setMessage] = useState<string>("");

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

  const handleSendMessage = async () => {
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ email, message }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Message sent!");
      setMessage("");
    } else {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="container py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">Email (readonly)</Label>
          <Input id="email" value={email} disabled />
        </div>

        <Button
          onClick={handleUpdate}
          variant="whiteShadow"
          className="bg-black text-white"
        >
          Update Profile
        </Button>
      </div>

      <div className="mt-10 space-y-4">
        <Label htmlFor="message">Contact ISBAD.se</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message to ISBAD..."
        />
        <Button onClick={handleSendMessage}>Send Message</Button>
      </div>
    </div>
  );
}
