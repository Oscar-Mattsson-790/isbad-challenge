import { Suspense } from "react";
import SetPasswordClient from "./set-password-client";

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordClient />
    </Suspense>
  );
}
