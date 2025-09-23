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
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    } catch {
      toast.error("An error occurred", {
        description: "Could not log in. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      toast.error("Failed to send reset email", { description: error.message });
    } else {
      toast.success("Password reset link sent!");
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
    <LayoutWrapper>
      <div className="flex h-[600px] w-full max-w-md mx-auto flex-col items-center justify-center text-white px-5">
        <div className="mx-auto grid w-full gap-6">
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
                placeholder="name@isbad.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 z-10 flex items-center justify-center px-2
                 text-black/70 hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-left text-xs font-bold text-[#157FBF] underline mt-1"
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
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
            className="bg-white border-none text-black hover:bg-black hover:text-white"
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
            <Link href="/signup" className="underline text-[#157FBF] font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </LayoutWrapper>
  );
}
