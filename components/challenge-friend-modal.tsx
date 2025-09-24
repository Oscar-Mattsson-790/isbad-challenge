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

type Props = {
  friendId: string;
  friendLabel: string;
  onClose: () => void;
};

const LENGTHS = [10, 15, 30, 50, 100, 365];

export default function ChallengeFriendModal({
  friendId,
  friendLabel,
  onClose,
}: Props) {
  const [open, setOpen] = useState(true);
  const [length, setLength] = useState<number>(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLength(15);
  }, []);

  const start = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/challenge-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId, length, force: true }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Failed (${res.status})`);
      }

      toast.success(`Challenge started with ${friendLabel} (${length} days)`);
      window.dispatchEvent(new CustomEvent("friend-challenges-updated"));
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
