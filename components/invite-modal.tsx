"use client";

import { useState } from "react";
import { sendInvite } from "@/lib/send-invite";
import { X } from "lucide-react";

interface InviteModalProps {
  onClose: () => void;
}

export default function InviteModal({ onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInvite = async () => {
    setLoading(true);
    const res = await sendInvite(email);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEmail("");
        onClose();
      }, 2500);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="relative bg-[#2B2B29] text-white border-none rounded-xl p-6 w-full max-w-md transition-all hover:shadow-[0_4px_20px_0_#157FBF]">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Invite a friend and take on the challenge together!
        </h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600 placeholder:text-zinc-400"
        />

        <div className="flex justify-end">
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-4 py-2 bg-[#157FBF] hover:bg-[#115F93] text-white rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>

        {success && (
          <p className="text-green-400 mt-4">Invite sent to {email}!</p>
        )}
      </div>
    </div>
  );
}
