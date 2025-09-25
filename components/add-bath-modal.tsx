"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";

import { useSupabase } from "@/components/supabase-provider";
import { getLocalDate } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { BathTypePicker } from "@/components/add-bath/bathTypePicker";
import { TimePicker } from "./add-bath/TimePicker";
import { DurationPicker } from "@/components/add-bath/durationPicker";
import { EmojiPicker } from "@/components/add-bath/emojiPicker";
import { ProofUploader } from "@/components/add-bath/proofUploader";
import { MissingImagePrompt } from "@/components/add-bath/missingImagePrompt";

interface AddBathModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onBathAdded: () => void;
  presetDurationSec?: number;
  hideDuration?: boolean;
}

const EMOJIS = ["😊", "😎", "🥶", "💪", "🔥", "😁", "😌"] as const;

export default function AddBathModal({
  open,
  setOpen,
  onBathAdded,
  presetDurationSec,
  hideDuration = false,
}: AddBathModalProps) {
  const { supabase, session } = useSupabase();

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  });

  const [durationMinutes, setDurationMinutes] = useState("1");
  const [durationSeconds, setDurationSeconds] = useState("30");

  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [bathType, setBathType] = useState<"tub" | "shower" | "outside" | null>(
    null
  );

  const [isSaving, setIsSaving] = useState(false);
  const lockRef = useRef(false);
  const submissionIdRef = useRef<string>(uuidv4());

  useEffect(() => {
    if (open) {
      submissionIdRef.current = uuidv4();
      lockRef.current = false;
      setIsSaving(false);
    }
  }, [open]);

  useEffect(() => {
    if (typeof presetDurationSec === "number") {
      const mins = Math.floor(presetDurationSec / 60);
      const secs = presetDurationSec % 60;
      setDurationMinutes(String(mins));
      setDurationSeconds(String(secs));
    }
  }, [presetDurationSec]);

  const durationString = useMemo(() => {
    if (typeof presetDurationSec === "number") {
      const mins = Math.floor(presetDurationSec / 60);
      const secs = presetDurationSec % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${durationMinutes.padStart(2, "0")}:${durationSeconds.padStart(
      2,
      "0"
    )}`;
  }, [presetDurationSec, durationMinutes, durationSeconds]);

  const [showImagePrompt, setShowImagePrompt] = useState(false);

  const onSaveClick = async () => {
    if (!session) return;
    if (lockRef.current) return;
    lockRef.current = true;

    if (!bathType) {
      toast.error("Please select a bath type before saving.");
      lockRef.current = false;
      return;
    }

    if (!file) {
      setOpen(false);
      setShowImagePrompt(true);
      lockRef.current = false;
      return;
    }

    await submitBath();
  };

  const submitBath = async () => {
    if (!session) return;
    if (isSaving) return;

    setIsSaving(true);
    const currentSubmissionId = submissionIdRef.current;

    try {
      let proof_url: string | null = null;
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("bathproofs")
          .upload(filePath, file);

        if (uploadError) {
          toast.error("Failed to upload image", {
            description: uploadError.message,
          });
          return;
        }
        const { data: publicUrl } = supabase.storage
          .from("bathproofs")
          .getPublicUrl(filePath);
        proof_url = publicUrl?.publicUrl ?? null;
      }

      const { error } = await supabase.from("baths").upsert(
        [
          {
            id: currentSubmissionId,
            user_id: session.user.id,
            date: getLocalDate(date),
            time,
            duration: durationString,
            feeling: selectedEmoji ?? "",
            proof_url,
            type: bathType,
          },
        ],
        { onConflict: "id", ignoreDuplicates: true }
      );

      if (error && !/duplicate|conflict/i.test(error.message)) {
        toast.error("Failed to save bath", { description: error.message });
        return;
      }

      toast.success("Ice bath recorded🧊", {
        description: `Your ice bath on ${format(date, "PPP", { locale: enUS })} has been saved.`,
      });

      submissionIdRef.current = uuidv4();

      setOpen(false);
      setDate(new Date());
      setSelectedEmoji("😊");
      setFile(null);
      setPhotoPreview(null);
      setBathType("tub");
      onBathAdded?.();
    } finally {
      setIsSaving(false);
      lockRef.current = false;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="mx-auto w-[95%] sm:max-w-[425px] bg-[#242422] text-white border-none max-h-[80vh] overflow-y-auto"
          style={isSaving ? { pointerEvents: "none", opacity: 0.9 } : undefined}
        >
          <DialogHeader className="items-center">
            <DialogTitle className="flex items-center">
              <CalendarPlus className="mr-2 h-6 w-6 text-[#157FBF]" />
              Log a new ice bath
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Label>
              <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
                1
              </span>
              How did you take your ice bath?
            </Label>
            <BathTypePicker
              value={bathType}
              onChange={setBathType}
              disabled={isSaving}
            />

            <TimePicker
              time={time}
              setTime={setTime}
              date={date}
              setDate={setDate}
              disabled={isSaving}
            />

            {!hideDuration && (
              <DurationPicker
                minutes={durationMinutes}
                seconds={durationSeconds}
                setMinutes={setDurationMinutes}
                setSeconds={setDurationSeconds}
                disabled={isSaving}
              />
            )}

            <EmojiPicker
              emojis={EMOJIS as unknown as string[]}
              value={selectedEmoji}
              onChange={setSelectedEmoji}
              disabled={isSaving}
            />

            <ProofUploader
              setFile={setFile}
              preview={photoPreview}
              setPreview={setPhotoPreview}
              disabled={isSaving}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={onSaveClick}
              className="bg-[#157FBF] w-full border-none hover:bg-[#115F93] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSaving}
              aria-disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showImagePrompt && (
        <MissingImagePrompt
          onCancel={() => {
            setShowImagePrompt(false);
            setOpen(true);
          }}
          onContinue={async () => {
            setShowImagePrompt(false);
            await submitBath();
          }}
          disabled={isSaving}
        />
      )}
    </>
  );
}
