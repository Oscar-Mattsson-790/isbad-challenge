import { Suspense } from "react";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
