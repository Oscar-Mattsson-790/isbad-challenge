"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import LayoutWrapper from "@/components/layout-wrapper";

export default function SignUpPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        },
      });

      if (error) {
        toast.error("Sign up failed: " + error.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert([
          {
            id: data.user.id,
            full_name: fullName,
            email: email,
          },
        ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }

        // Skicka onboarding-meddelande via Novu
        const res = await fetch("/api/novu/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.user.id,
            email,
            fullName,
          }),
        });

        console.log("VAD ÄR DETTA :::::", res);
        if (!res.ok) {
          console.warn("Novu onboarding trigger failed");
        }

        toast.success("Sign up successful! Please check your email.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      toast.error("Google sign up failed: " + error.message);
    }
  };

  return (
    <LayoutWrapper>
      <div className="flex h-[600px] w-full max-w-md mx-auto flex-col items-center justify-center text-white px-5">
        <div className="mx-auto grid w-full gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-sm text-white">
              Sign up to start your ice bath challenge
            </p>
          </div>
          <form onSubmit={handleEmailSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            className="bg-white border-none text-black hover:bg-black hover:text-white"
            size="lg"
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <FcGoogle size={20} />
            Google
          </Button>
          <p className="text-center text-sm text-white">
            Already have an account?{" "}
            <Link href="/login" className="underline text-[#157FBF] font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </LayoutWrapper>
  );
}
