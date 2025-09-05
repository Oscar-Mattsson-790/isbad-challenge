"use client";

import { useState } from "react";
import LayoutWrapper from "@/components/layout-wrapper";
import { useSupabase } from "@/components/supabase-provider";
import { toast } from "sonner";

export default function ConfirmSignupPage() {
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    if (!session?.user?.email) {
      toast.error("No email found – try signing up again.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: session.user.email,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to resend email", {
        description: error.message,
      });
    } else {
      toast.success("Confirmation email resent!");
    }
  };

  return (
    <LayoutWrapper>
      <div className="flex h-[600px] w-full max-w-md mx-auto flex-col items-center justify-center text-white px-5">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Confirm your email</h1>
          <p className="text-sm">
            We&apos;ve sent a confirmation link. Please check your email and
            confirm.
          </p>

          <p className="text-sm">
            Didn&apos;t get the email?{" "}
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="underline text-[#157FBF] font-bold disabled:opacity-50"
            >
              {loading ? "Resending..." : "Click here to resend it"}
            </button>
          </p>
        </div>
      </div>
    </LayoutWrapper>
  );
}
