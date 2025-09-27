"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { toast } from "sonner";
import LayoutWrapper from "@/components/layout-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

function readTokensFromHash() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash?.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (access_token && refresh_token) return { access_token, refresh_token };
  return null;
}

export default function SetPasswordClient() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const sp = useSearchParams();

  const inviter = useMemo(() => sp.get("inviter") || "", [sp]);
  const skipPw = useMemo(() => sp.get("skip_pw") === "1", [sp]);

  const challengeLenParam = useMemo(
    () => sp.get("challenge_length") || "",
    [sp]
  );
  const challengeLen = useMemo(() => {
    const n = Number(challengeLenParam);
    return Number.isFinite(n) ? n : undefined;
  }, [challengeLenParam]);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [finalizing, setFinalizing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (session) {
        setBooting(false);
        return;
      }
      const tokens = readTokensFromHash();
      if (!tokens) {
        setBooting(false);
        return;
      }
      const { error } = await supabase.auth.setSession(tokens);
      if (error) {
        toast.error("Could not initialize session", {
          description: error.message,
        });
        setBooting(false);
        return;
      }
      if (!cancelled) {
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState({}, "", url.toString());
      }
      setBooting(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session, supabase]);

  const finalizedOnce = useRef(false);
  const finalizeInvite = async () => {
    if (!inviter || finalizedOnce.current) return;
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) return;

    finalizedOnce.current = true;

    const qs =
      challengeLen !== undefined
        ? `inviter=${encodeURIComponent(inviter)}&challenge_length=${encodeURIComponent(
            String(challengeLen)
          )}`
        : `inviter=${encodeURIComponent(inviter)}`;

    try {
      const res = await fetch(`/api/finalize-invite?${qs}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("finalize-invite failed:", txt);
      }
    } catch (e) {
      console.error("finalize-invite error:", e);
    }
  };

  useEffect(() => {
    (async () => {
      if (!skipPw) return;
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return;
      setFinalizing(true);
      await finalizeInvite();
      router.replace("/dashboard");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipPw, supabase]);

  useEffect(() => {
    if (skipPw) return;
    void finalizeInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipPw, inviter, challengeLen]);

  if (booting || finalizing || skipPw) {
    return (
      <LayoutWrapper>
        <div className="flex h-[600px] w-full max-w-md mx-auto items-center justify-center text-white px-5">
          {booting ? "Initializing…" : "Finalizing your invite…"}
        </div>
      </LayoutWrapper>
    );
  }

  const onSave = async () => {
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) {
      toast.error("Session missing. Please open the invite link again.");
      return;
    }
    if (pw.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (pw !== pw2) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) {
      toast.error("Could not set password", { description: error.message });
      return;
    }
    toast.success("Password set. Welcome!");
    router.replace("/dashboard");
  };

  return (
    <LayoutWrapper>
      <div className="flex h-[600px] w-full max-w-md mx-auto flex-col items-center justify-center text-white px-5">
        <div className="mx-auto grid w-full gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Choose a password</h1>
            <p className="text-sm text-white/90">
              You’re invited and already signed in. Pick a password to complete
              your account.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="********"
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  title={showPw ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 z-10 flex items-center justify-center px-2 text-black/70 hover:text-black"
                >
                  {showPw ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password2">Repeat password</Label>
              <div className="relative">
                <Input
                  id="password2"
                  type={showPw2 ? "text" : "password"}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  placeholder="********"
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((v) => !v)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={showPw2 ? "Hide password" : "Show password"}
                  title={showPw2 ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 z-10 flex items-center justify-center px-2 text-black/70 hover:text-black"
                >
                  {showPw2 ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
            >
              {loading ? "Saving…" : "Save password"}
            </Button>
          </div>

          <p className="text-center text-sm text-white">
            If you reached this page without an invite,{" "}
            <a href="/login" className="underline text-[#157FBF] font-bold">
              log in
            </a>{" "}
            or{" "}
            <a href="/signup" className="underline text-[#157FBF] font-bold">
              sign up
            </a>
            .
          </p>
        </div>
      </div>
    </LayoutWrapper>
  );
}
