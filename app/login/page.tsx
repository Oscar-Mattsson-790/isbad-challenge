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

export default function LoginPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login failed", { description: error.message });
        return;
      }

      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred", {
        description: "Could not log in. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
    if (error) {
      toast.error("Google login failed: " + error.message);
    }
  };

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center text-white">
      <div className="mx-auto grid w-full max-w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Log in</h1>
          <p className="text-sm text-white">
            Log in to continue your ice bath challenge
          </p>
        </div>
        <form onSubmit={handleEmailLogin} className="grid gap-4">
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
            className="border border-black bg-black text-white hover:bg-white hover:text-black"
          >
            {loading ? "Logging in..." : "Log in"}
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
          className="bg-[#116FA1] border-[1px] border-white hover:bg-black hover:text-white hover:border-white hover:border-[1px]"
          size="lg"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FcGoogle size={20} />
          Google
        </Button>
        <p className="text-center text-sm text-white">
          Don’t have an account?{" "}
          <Link href="/signup" className="underline text-[#1AA7EC] font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
