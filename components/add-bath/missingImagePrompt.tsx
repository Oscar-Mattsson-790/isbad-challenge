"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onCancel: () => void;
  onContinue: () => void;
  disabled?: boolean;
};

export function MissingImagePrompt({ onCancel, onContinue, disabled }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
      <div className="bg-[#2B2B29] text-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">
          Don&apos;t you want to upload an image?
        </h2>
        <p className="mb-4 text-sm text-white/80">
          You can upload a photo or video as proof of your bath.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            className="bg-[#157FBF] hover:bg-[#115F93]"
            onClick={onCancel}
            disabled={disabled}
          >
            Yes
          </Button>
          <Button
            className="bg-black text-white"
            onClick={onContinue}
            disabled={disabled}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
}
