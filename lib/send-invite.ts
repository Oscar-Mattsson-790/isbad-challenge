import { toast } from "sonner";

export type InviteResponse = {
  success: boolean;
  error?: string;
  note?: string;
};

export const sendInvite = async (
  email: string,
  challengeLength: number
): Promise<InviteResponse> => {
  try {
    const res = await fetch("/api/invite-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, challengeLength }),
    });

    const text = await res.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = {};
    try {
      result = JSON.parse(text);
    } catch {}

    if (!res.ok) {
      const errorMsg = result?.error || `HTTP ${res.status}`;
      toast.error("Failed to send invite", { description: errorMsg });
      return { success: false, error: errorMsg };
    }

    toast.success("Invitation sent", {
      description: `Email sent to ${email}`,
    });
    return { success: true, note: result?.note };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    toast.error("Failed to send invite", { description: errorMsg });
    return { success: false, error: errorMsg };
  }
};
