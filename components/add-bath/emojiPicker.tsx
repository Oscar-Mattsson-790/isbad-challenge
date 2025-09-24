"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  emojis: string[];
  value: string | null;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export function EmojiPicker({ emojis, value, onChange, disabled }: Props) {
  return (
    <div className="grid gap-2">
      <Label>
        <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
          4
        </span>
        How did it feel?
      </Label>
      <div className="grid grid-cols-7 gap-2 justify-center">
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            type="button"
            disabled={disabled}
            className={`bg-[#2B2B29] text-white border-none rounded-xl p-4 transition-all text-xl ${
              value === emoji
                ? "ring-2 ring-[#157FBF] shadow-[0_4px_20px_0_#157FBF]"
                : "hover:shadow-[0_4px_20px_0_#157FBF]"
            }`}
            onClick={() => onChange(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </div>
  );
}
