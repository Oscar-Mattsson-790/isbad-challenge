/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner";

export const sendInvite = async (email: string) => {
  try {
    const res = await fetch("/api/send-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    toast.success("Invitation sent", {
      description: `Email sent to ${email}`,
    });
  } catch (err: any) {
    toast.error("Failed to send invite", {
      description: err.message,
    });
  }
};
