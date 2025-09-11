"use client";

import { useState } from "react";
import { X, Swords } from "lucide-react";
import { toast } from "sonner";

const LENGTHS = [10, 15, 30, 50, 100, 365] as const;

type Props = {
  friendId: string;
  friendLabel: string;
  onClose: () => void;
};

function confirmWithToast(opts: {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> {
  const {
    title,
    description,
    confirmText = "Reset & start",
    cancelText = "Cancel",
  } = opts;

  return new Promise((resolve) => {
    // I Sonner är t = id (string|number)
    toast.custom(
      (t) => (
        <div className="w-[360px] rounded-lg border border-white/10 bg-[#242422] p-4 text-white shadow-lg">
          <div className="text-sm font-medium">{title}</div>
          {description ? (
            <div className="mt-1 text-xs text-white/70">{description}</div>
          ) : null}
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              className="h-8 px-3 rounded text-white/90 hover:bg-white/10"
              onClick={() => {
                toast.dismiss(t);
                resolve(false);
              }}
            >
              {cancelText}
            </button>
            <button
              className="h-8 px-3 rounded bg-[#157FBF] hover:bg-[#115F93]"
              onClick={() => {
                toast.dismiss(t);
                resolve(true);
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
}

export default function ChallengeFriendModal({
  friendId,
  friendLabel,
  onClose,
}: Props) {
  const [selectedLength, setSelectedLength] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  const start = async (force = false) => {
    try {
      setLoading(true);
      const res = await fetch("/api/challenge-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friendId, length: selectedLength, force }),
      });

      const data = await res.json().catch(() => ({}));

      // 🔁 Ny logik: needsReset i stället för 409
      if (data?.needsReset) {
        setLoading(false);
        const proceed = await confirmWithToast({
          title: "Active challenge detected",
          description:
            "You or your friend already has an active challenge. Start a new one and reset progress for both?",
          confirmText: "Reset & start",
          cancelText: "Cancel",
        });
        if (proceed) return start(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      toast.success("Challenge started!", {
        description: `You and ${friendLabel} are on a ${selectedLength}-day challenge.`,
      });

      // Signalera till dashboard att hämta om profil/stats
      window.dispatchEvent(
        new CustomEvent("challenge-started", {
          detail: { length: selectedLength, friendId },
        })
      );

      onClose();
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      toast.error("Could not start challenge", {
        description: err?.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative bg-[#2B2B29] text-white border-none rounded-xl p-6 w-full max-w-md transition-all hover:shadow-[0_4px_20px_0_#157FBF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Swords className="w-5 h-5 text-[#157FBF]" />
          <h2 className="text-xl font-semibold">Challenge your friend</h2>
        </div>
        <p className="text-sm text-white/80 mb-4">
          Start a new challenge with{" "}
          <span className="font-medium">{friendLabel}</span>. Choose a duration
          and hit start.
        </p>

        <div className="w-full rounded-sm bg-[#2B2B29] text-white p-4 border border-zinc-700/40">
          <p className="text-white text-[13px] text-center pb-2">
            Choose challenge duration
          </p>
          <div className="grid grid-cols-3 gap-2 w-full">
            {LENGTHS.map((days) => {
              const active = selectedLength === days;
              return (
                <button
                  type="button"
                  key={days}
                  onClick={() => setSelectedLength(days)}
                  className={[
                    "h-12 w-full rounded",
                    active
                      ? "bg-[#157FBF] text-white"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
                  ].join(" ")}
                >
                  {days}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-center mt-3 text-zinc-300">
            Both of you will start a {selectedLength}-day challenge.
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => start(false)}
            disabled={loading}
            className="px-4 py-2 bg-[#157FBF] hover:bg-[#115F93] text-white rounded disabled:opacity-50"
          >
            {loading ? "Starting..." : "Start challenge"}
          </button>
        </div>
      </div>
    </div>
  );
}
