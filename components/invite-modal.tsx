"use client";

import { useState } from "react";
import { sendInvite } from "@/lib/send-invite";
import { X } from "lucide-react";

interface InviteModalProps {
  onClose: () => void;
}

const LENGTHS = [10, 15, 30, 50, 100, 365] as const;

export default function InviteModal({ onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [selectedLength, setSelectedLength] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInvite = async () => {
    if (!email) return;
    setLoading(true);
    const res = await sendInvite(email, selectedLength);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEmail("");
        onClose();
      }, 3500);
    } else {
      alert("Error: " + res.error);
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

        <h2 className="text-xl font-semibold mb-4">
          Invite a friend and take on the challenge together!
        </h2>

        <label className="block text-sm mb-1">Friend’s email</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600 placeholder:text-zinc-400"
        />

        <div className="w-full rounded-sm bg-[#2B2B29] text-white p-4 border border-zinc-700/40">
          <p className="text-white text-[13px] text-center pb-2">
            Start a new challenge, choose a duration
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
            onClick={handleInvite}
            disabled={loading || !email}
            className="px-4 py-2 bg-[#157FBF] hover:bg-[#115F93] text-white rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>

        {success && (
          <p className="text-green-400 mt-4">
            Invite sent to {email}! Challenge: {selectedLength} days.
          </p>
        )}
      </div>
    </div>
  );
}
