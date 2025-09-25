"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  value: "tub" | "shower" | "outside" | null;
  onChange: (v: "tub" | "shower" | "outside") => void;
  disabled?: boolean;
};

export function BathTypePicker({ value, onChange, disabled }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {(["tub", "shower", "outside"] as const).map((t) => (
        <div key={t} className="flex flex-col items-center">
          <Button
            type="button"
            className={`bg-[#2B2B29] text-white border-none rounded-xl p-8 transition-all ${
              value === t
                ? "ring-2 ring-[#157FBF] shadow-[0_4px_20px_0_#157FBF]"
                : "hover:shadow-[0_4px_20px_0_#157FBF]"
            }`}
            onClick={() => onChange(t)}
            disabled={disabled}
          >
            <Image
              src={
                t === "tub"
                  ? "/images/ice bath icon.png"
                  : t === "shower"
                    ? "/images/cold shower icon.png"
                    : "/images/outside icon.png"
              }
              width={64}
              height={64}
              alt={`${t} icon`}
            />
          </Button>
          <span className="text-xs">{t === "tub" ? "ice bath" : t}</span>
        </div>
      ))}
    </div>
  );
}
