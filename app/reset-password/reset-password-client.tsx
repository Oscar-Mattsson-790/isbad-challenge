"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LayoutWrapper from "@/components/layout-wrapper";

export default function ResetPasswordClient() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      toast.error("Missing recovery code in URL.");
    }
  }, [code]);

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast.error("Failed to reset password", { description: error.message });
    } else {
      toast.success("Password updated. You can now log in.");
      router.push("/login");
    }
  };

  return (
    <LayoutWrapper>
      <div className="flex h-[600px] w-full max-w-md mx-auto flex-col items-center justify-center text-white px-5">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-white text-2xl font-bold text-center">
            Reset Password
          </h2>
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            disabled={loading}
            onClick={handleReset}
            className="bg-[#157FBF] text-white w-full"
          >
            {loading ? "Resetting..." : "Set new password"}
          </Button>
        </div>
      </div>
    </LayoutWrapper>
  );
}
