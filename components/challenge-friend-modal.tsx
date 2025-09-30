"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSupabase } from "@/components/supabase-provider";

type Props = {
  friendId: string;
  friendLabel: string;
  onClose: () => void;
};

const LENGTHS = [10, 15, 30, 50, 100, 365] as const;
type Allowed = (typeof LENGTHS)[number];

export default function ChallengeFriendModal({
  friendId,
  friendLabel,
  onClose,
}: Props) {
  const { supabase, session } = useSupabase();

  const [open, setOpen] = useState(true);
  const [length, setLength] = useState<Allowed>(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.user.id) return;

      const { data, error } = await supabase
        .from("friend_challenges")
        .select("length")
        .eq("user_id", session.user.id)
        .eq("friend_id", friendId)
        .eq("active", true)
        .maybeSingle();

      if (cancelled || error) return;

      if (data?.length && LENGTHS.includes(data.length as Allowed)) {
        setLength(data.length as Allowed);
      } else {
        setLength(30);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session, supabase, friendId]);

  const start = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friendId, length, force: true }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Failed (${res.status})`);
      }

      toast.success(`Challenge started with ${friendLabel} (${length} days)`);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("friend-challenges-updated"));
      }
      setOpen(false);
      onClose();
    } catch (e: any) {
      toast.error("Could not start challenge", { description: e?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setOpen(false);
          onClose();
        }
      }}
    >
      <DialogContent className="bg-[#242422] text-white border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Challenge {friendLabel}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-white/80">Choose a duration:</p>

          <div className="grid grid-cols-3 gap-2">
            {LENGTHS.map((d) => (
              <Button
                key={d}
                type="button"
                variant={d === length ? "default" : "secondary"}
                className={
                  d === length
                    ? "bg-[#157FBF] hover:bg-[#157FBF]/90"
                    : "bg-[#2B2B29] hover:bg-[#3A3A37] text-white border border-white/10"
                }
                onClick={() => setLength(d)}
              >
                {d}
              </Button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                onClose();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#157FBF] hover:bg-[#115F93]"
              onClick={start}
              disabled={loading}
            >
              {loading ? "Starting…" : "Start challenge"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
