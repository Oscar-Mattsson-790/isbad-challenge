"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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
        toast.error("Inloggning misslyckades", {
          description: error.message,
        });
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Ett fel uppstod", {
        description: "Kunde inte logga in. Försök igen senare.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error("Inloggning misslyckades", {
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Ett fel uppstod", {
        description: "Kunde inte logga in med Google. Försök igen senare.",
      });
    }
  };

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto grid w-full max-w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <div className="mx-auto text-3xl font-bold">ISBAD</div>
          <h1 className="text-3xl font-bold">Logga in</h1>
          <p className="text-sm text-muted-foreground">
            Logga in för att fortsätta din isbad challenge
          </p>
        </div>
        <form onSubmit={handleEmailLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-postadress</Label>
            <Input
              id="email"
              type="email"
              placeholder="namn@exempel.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Lösenord</Label>
              <Link href="/forgot-password" className="text-sm underline">
                Glömt lösenord?
              </Link>
            </div>
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
            className="bg-[#0B4F82] hover:bg-[#0A3F69]"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Eller fortsätt med
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8"></path>
            <path d="M12 8v8"></path>
          </svg>
          Google
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Har du inget konto?{" "}
          <Link href="/signup" className="underline">
            Registrera dig
          </Link>
        </p>
      </div>
    </div>
  );
}
