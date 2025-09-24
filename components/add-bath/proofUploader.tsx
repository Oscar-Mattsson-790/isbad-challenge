"use client";

import type React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

type Props = {
  setFile: (f: File | null) => void;
  preview: string | null;
  setPreview: (p: string | null) => void;
  disabled?: boolean;
};

export function ProofUploader({
  setFile,
  preview,
  setPreview,
  disabled,
}: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="photo">
        <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
          5
        </span>
        Proof (photo/video)
      </Label>

      <Label
        htmlFor="photo"
        className="relative max-h-64 overflow-y-auto cursor-pointer flex flex-col items-center justify-center rounded-md border border-dashed border-white p-2 text-center"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="h-auto max-h-[200px] w-full object-cover rounded"
            width={300}
            height={300}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 p-2 sm:p-4">
            <Upload className="h-6 w-6 text-white" />
            <p className="text-sm font-medium">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-white">
              Photo or short video (max 20MB)
            </p>
          </div>
        )}
        <Input
          id="photo"
          type="file"
          accept="image/*,video/*"
          onChange={handleFile}
          className="hidden"
          disabled={disabled}
        />
      </Label>
    </div>
  );
}
