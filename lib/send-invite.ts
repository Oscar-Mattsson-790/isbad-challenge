/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export type InviteResponse = { success: boolean; error?: string };

export const sendInvite = async (
  email: string,
  challengeLength: number = 30
): Promise<InviteResponse> => {
  try {
    const res = await fetch("/api/invite-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, challengeLength }),
      credentials: "include",
    });

    const text = await res.text();
    let result: any = {};
    try {
      result = JSON.parse(text);
    } catch {}

    if (!res.ok) {
      const errorMsg = result?.error || `HTTP ${res.status}`;
      toast.error("Failed to send invite", { description: errorMsg });
      return { success: false, error: errorMsg };
    }

    toast.success("Invitation sent", { description: `Email sent to ${email}` });
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || "Unknown error";
    toast.error("Failed to send invite", { description: errorMsg });
    return { success: false, error: errorMsg };
  }
};
