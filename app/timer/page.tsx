"use client";

import { useState } from "react";
import IceBathTimer from "@/components/ice-bath-timer";
import LayoutWrapper from "@/components/layout-wrapper";
import AddBathModal from "@/components/add-bath-modal";

export default function TimerPage() {
  const [open, setOpen] = useState(false);
  const [presetDurationSec, setPresetDurationSec] = useState<number | null>(
    null
  );

  return (
    <LayoutWrapper>
      <main className="min-h-[calc(100vh-140px)] bg-[#242422] flex items-center justify-center p-4">
        <IceBathTimer
          onAddSession={(ms) => {
            setPresetDurationSec(Math.max(0, Math.round(ms / 1000)));
            setOpen(true);
          }}
        />
      </main>

      <AddBathModal
        open={open}
        setOpen={setOpen}
        onBathAdded={() => {
          setOpen(false);
          window.dispatchEvent(new CustomEvent("timer-session-logged"));
        }}
        presetDurationSec={presetDurationSec ?? undefined}
        hideDuration={true}
      />
    </LayoutWrapper>
  );
}
