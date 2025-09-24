// components/add-bath-modal.tsx
"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { getLocalDate } from "@/lib/utils";
import { Clock, Upload, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AddBathModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onBathAdded: () => void;
  presetDurationSec?: number;
  hideDuration?: boolean;
}

const emojis = ["😊", "😎", "🥶", "💪", "🔥", "😁", "😌"];

export default function AddBathModal({
  open,
  setOpen,
  onBathAdded,
  presetDurationSec,
  hideDuration = false,
}: AddBathModalProps) {
  const { supabase, session } = useSupabase();

  // --- form state ---
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

  // — Anti-dup guards —
  const [isSaving, setIsSaving] = useState(false); // för UI
  const lockRef = useRef(false); // synkron, stoppar dubbelklick innan state hinner uppdatera

  // Ett id per öppnad modal. Återanvänds på alla klick tills modal stängs.
  const submissionIdRef = useRef<string>(uuidv4());
  useEffect(() => {
    if (open) {
      submissionIdRef.current = uuidv4();
      lockRef.current = false;
      setIsSaving(false);
    }
  }, [open]);

  // Sätt preset från timer (om finns)
  useEffect(() => {
    if (typeof presetDurationSec === "number") {
      const mins = Math.floor(presetDurationSec / 60);
      const secs = presetDurationSec % 60;
      setDurationMinutes(String(mins));
      setDurationSeconds(String(secs));
    }
  }, [presetDurationSec]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

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

  // Vi kör submit via knappens onClick (type="button") för att undvika dubbel form submit.
  const onSaveClick = async () => {
    if (!session) return;

    // Omedelbar, synkron låsning (stoppar multi-click race)
    if (lockRef.current) return;
    lockRef.current = true;

    if (!bathType) {
      toast.error("Please select a bath type before saving.");
      lockRef.current = false;
      return;
    }

    // Om ingen bild – fråga först (men lämna låsning åt submitBath som hanterar allt)
    if (!file) {
      setOpen(false);
      setShowImagePrompt(true);
      lockRef.current = false; // lås upp så man kan klicka i prompten
      return;
    }

    await submitBath();
  };

  const [showImagePrompt, setShowImagePrompt] = useState(false);

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

      // Idempotent på DB-nivå: upsert med samma id och ignorera dubletter
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

      if (error) {
        // Om felet indikerar dupe kör vi vidare som lyckat; annars visa fel
        if (!/duplicate|conflict/i.test(error.message)) {
          toast.error("Failed to save bath", { description: error.message });
          return;
        }
      }

      toast.success("Ice bath recorded🧊", {
        description: `Your ice bath on ${format(date, "PPP", { locale: enUS })} has been saved.`,
      });

      // Förbered nytt id till nästa öppning
      submissionIdRef.current = uuidv4();

      // Stäng & reset
      setOpen(false);
      setDate(new Date());
      setSelectedEmoji("😊");
      setFile(null);
      setPhotoPreview(null);
      setBathType("tub");
      onBathAdded?.();
    } finally {
      setIsSaving(false);
      lockRef.current = false; // släpp lås
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="mx-auto w-[95%] sm:max-w-[425px] bg-[#242422] text-white border-none max-h-[80vh] overflow-y-auto"
          // extra skydd – inga klick går igenom under save
          style={isSaving ? { pointerEvents: "none", opacity: 0.9 } : undefined}
        >
          <DialogHeader className="items-center">
            <DialogTitle className="flex items-center">
              <CalendarPlus className="mr-2 h-6 w-6 text-[#157FBF]" />
              Log a new ice bath
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* 1. Bath type */}
            <Label>
              <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
                1
              </span>
              How did you take your ice bath?
            </Label>
            <div className="flex gap-2 justify-center">
              {(["tub", "shower", "outside"] as const).map((t) => (
                <div key={t} className="flex flex-col items-center">
                  <Button
                    type="button"
                    className={`bg-[#2B2B29] text-white border-none rounded-xl p-8 transition-all ${
                      bathType === t
                        ? "ring-2 ring-[#157FBF] shadow-[0_4px_20px_0_#157FBF]"
                        : "hover:shadow-[0_4px_20px_0_#157FBF]"
                    }`}
                    onClick={() => setBathType(t)}
                    disabled={isSaving}
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
                  <span className="text-xs">
                    {t === "tub" ? "ice bath" : t}
                  </span>
                </div>
              ))}
            </div>

            {/* 2. Time & date */}
            <div className="grid gap-2">
              <Label htmlFor="time">
                <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Select the time you took your ice bath
              </Label>
              <div className="flex items-center gap-2">
                <div className="shrink-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full justify-start text-left font-normal bg-white text-black hover:bg-white"
                        type="button"
                        disabled={isSaving}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      align="start"
                      className="w-auto p-2 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <select
                          value={time.split(":")[0]}
                          onChange={(e) =>
                            setTime(
                              `${e.target.value.padStart(2, "0")}:${time.split(":")[1]}`
                            )
                          }
                          className="border rounded px-2 py-1 bg-white text-black"
                        >
                          {[...Array(24).keys()].map((h) => {
                            const val = h.toString().padStart(2, "0");
                            return (
                              <option key={val} value={val}>
                                {val}
                              </option>
                            );
                          })}
                        </select>
                        <span className="text-lg font-medium">:</span>
                        <select
                          value={time.split(":")[1]}
                          onChange={(e) =>
                            setTime(
                              `${time.split(":")[0]}:${e.target.value.padStart(2, "0")}`
                            )
                          }
                          className="border rounded px-2 py-1 bg-white text-black"
                        >
                          {[...Array(60).keys()].map((m) => {
                            const val = m.toString().padStart(2, "0");
                            return (
                              <option key={val} value={val}>
                                {val}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-1/2 text-sm text-white/80">
                  Today: {format(date, "MMMM do, yyyy", { locale: enUS })}
                </div>
              </div>
            </div>

            {/* 3. Duration */}
            {!hideDuration && (
              <div className="grid gap-2">
                <Label>
                  <span className="w-6 h-6 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  How long did you stay in the water?
                </Label>
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm">Minutes</span>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="border rounded px-2 py-1 bg-white text-black"
                      disabled={isSaving}
                    >
                      {[...Array(31).keys()].map((min) => (
                        <option key={min} value={min.toString()}>
                          {min.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">Seconds</span>
                    <select
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(e.target.value)}
                      className="border rounded px-2 py-1 bg-white text-black"
                      disabled={isSaving}
                    >
                      {[...Array(60).keys()].map((sec) => (
                        <option key={sec} value={sec.toString()}>
                          {sec.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Emojis */}
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
                    className={`bg-[#2B2B29] text-white border-none rounded-xl p-4 transition-all text-xl ${
                      selectedEmoji === emoji
                        ? "ring-2 ring-[#157FBF] shadow-[0_4px_20px_0_#157FBF]"
                        : "hover:shadow-[0_4px_20px_0_#157FBF]"
                    }`}
                    onClick={() => setSelectedEmoji(emoji)}
                    disabled={isSaving}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            {/* 5. Proof */}
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
                {photoPreview ? (
                  <Image
                    src={photoPreview}
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
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSaving}
                />
              </Label>
            </div>
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

      {/* Prompt om man saknar bild */}
      {showImagePrompt && (
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
                onClick={() => {
                  setShowImagePrompt(false);
                  setOpen(true);
                }}
                disabled={isSaving}
              >
                Yes
              </Button>
              <Button
                className="bg-black text-white"
                onClick={async () => {
                  setShowImagePrompt(false);
                  await submitBath();
                }}
                disabled={isSaving}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
