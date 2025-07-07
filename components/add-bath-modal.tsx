"use client";

import type React from "react";
import { useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Clock, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AddBathModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onBathAdded: () => void;
}

const emojis = ["😊", "😎", "🥶", "💪", "🔥", "😁", "😌"];

export default function AddBathModal({
  open,
  setOpen,
  onBathAdded,
}: AddBathModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("08:00");
  const [durationMinutes, setDurationMinutes] = useState("1");
  const [durationSeconds, setDurationSeconds] = useState("30");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const { supabase, session } = useSupabase();
  const [bathType, setBathType] = useState<"tub" | "shower" | "outside" | null>(
    null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!bathType) {
      toast.error("Please select a bath type before saving.");
      return;
    }

    if (!file) {
      setOpen(false);
      setShowImagePrompt(true); // Show prompt if no image
      return;
    }

    await submitBath();
  };

  const submitBath = async () => {
    if (!session) return;

    const duration = `${durationMinutes.padStart(2, "0")}:${durationSeconds.padStart(2, "0")}`;
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

    const { error } = await supabase.from("baths").insert({
      user_id: session.user.id,
      date: date.toISOString().split("T")[0],
      time,
      duration,
      feeling: selectedEmoji ?? "",
      proof_url,
      type: bathType,
    });

    if (error) {
      toast.error("Failed to save bath", { description: error.message });
      return;
    }

    toast.success("Ice bath recorded🧊", {
      description: `Your ice bath on ${format(date, "PPP", {
        locale: enUS,
      })} has been saved.`,
    });

    setOpen(false);
    setDate(new Date());
    setTime("08:00");
    setDurationMinutes("1");
    setDurationSeconds("30");
    setSelectedEmoji("😊");
    setFile(null);
    setPhotoPreview(null);
    setBathType("tub");
    onBathAdded?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="mx-auto w-[95%] sm:max-w-[425px] bg-[#242422] text-white border-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log a new ice bath</DialogTitle>
            <DialogDescription className="text-white">
              Fill in the details of your ice bath to add it to your challenge.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Label>
                <span className="w-7 h-7 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                How did you take your ice bath?
              </Label>
              <div className="flex gap-2 justify-center">
                {/* TUB */}
                <div className="flex flex-col items-center">
                  <Button
                    type="button"
                    className={`p-8 border text-white transition ${
                      bathType === "tub"
                        ? "bg-[#157FBF] border-[#157FBF] hover:bg-[#157FBF]"
                        : "bg-[#242422] border-[#157FBF] hover:border-[#157FBF] hover:bg-[#157FBF]"
                    }`}
                    onClick={() => setBathType("tub")}
                  >
                    <Image
                      src="/images/ice bath icon.png"
                      width={64}
                      height={64}
                      alt="ice bath tub"
                    />
                  </Button>
                  <span className="text-xs">ice bath</span>
                </div>

                {/* SHOWER */}
                <div className="flex flex-col items-center">
                  <Button
                    type="button"
                    className={`p-8 border text-white transition ${
                      bathType === "shower"
                        ? "bg-[#157FBF] border-[#157FBF] hover:bg-[#157FBF]"
                        : "bg-[#242422] border-[#157FBF] hover:border-[#157FBF] hover:bg-[#157FBF]"
                    }`}
                    onClick={() => setBathType("shower")}
                  >
                    <Image
                      src="/images/cold shower icon.png"
                      width={64}
                      height={64}
                      alt="cold shower icon"
                    />
                  </Button>
                  <span className="text-xs">cold shower</span>
                </div>

                {/* OUTSIDE */}
                <div className="flex flex-col items-center">
                  <Button
                    type="button"
                    className={`p-8 border text-white transition ${
                      bathType === "outside"
                        ? "bg-[#157FBF] border-[#157FBF] hover:bg-[#157FBF]"
                        : "bg-[#242422] border-[#157FBF] hover:border-[#157FBF] hover:bg-[#157FBF]"
                    }`}
                    onClick={() => setBathType("outside")}
                  >
                    <Image
                      src="/images/outside icon.png"
                      width={64}
                      height={64}
                      alt="outside ice bath icon"
                    />
                  </Button>
                  <span className="text-xs">outside</span>
                </div>
              </div>

              {/* TIME & DATE */}
              <div className="grid gap-2">
                <Label htmlFor="time">
                  <span className="w-7 h-7 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Select the time you took your ice bath
                </Label>
                <div className="flex items-center gap-2">
                  <div className="w-1/2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="w-full justify-start text-left font-normal bg-white text-black hover:bg-white">
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

              {/* DURATION */}
              <div className="grid gap-2">
                <Label>
                  <span className="w-7 h-7 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
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

              {/* EMOJIS */}
              <div className="grid gap-2">
                <Label>
                  <span className="w-7 h-7 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  How did it feel?
                </Label>
                <div className="grid grid-cols-7 gap-2 justify-center">
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      className={`text-xl p-2 border transition ${
                        selectedEmoji === emoji
                          ? "bg-[#157FBF] border-none hover:bg-[#115F93]"
                          : "bg-[#242422] border border-[#115F93] hover:border-[#115F93] hover:bg-[#115F93]"
                      } text-white`}
                      onClick={() => setSelectedEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              {/* FILE UPLOAD */}
              <div className="grid gap-2">
                <Label htmlFor="photo">
                  <span className="w-7 h-7 rounded-full bg-[#157FBF] text-white flex items-center justify-center text-sm font-bold">
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
                  />
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-[#157FBF] w-full border-none hover:bg-[#115F93] hover:text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image prompt if no image */}
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
              >
                Yes
              </Button>
              <Button
                className="bg-black text-white"
                onClick={async () => {
                  setShowImagePrompt(false);
                  await submitBath();
                }}
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
