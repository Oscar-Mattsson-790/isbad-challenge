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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarIcon, Clock, Upload } from "lucide-react";
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
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { supabase, session } = useSupabase();

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

    if (!file) {
      toast.error("Please upload a photo or video");
      return;
    }

    const duration = `${durationMinutes.padStart(
      2,
      "0"
    )}:${durationSeconds.padStart(2, "0")}`;

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
      feeling: selectedEmoji,
      proof_url,
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
    onBathAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="mx-auto w-[95%] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a new ice bath</DialogTitle>
          <DialogDescription>
            Fill in the details of your ice bath to add it to your challenge.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "PPP", { locale: enUS })
                      : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
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
                          <option
                            key={val}
                            value={val}
                            className={
                              time.split(":")[0] === val
                                ? "font-semibold text-blue-600 bg-blue-100"
                                : ""
                            }
                          >
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
                          <option
                            key={val}
                            value={val}
                            className={
                              time.split(":")[1] === val
                                ? "font-semibold text-blue-600 bg-blue-100"
                                : ""
                            }
                          >
                            {val}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Duration</Label>
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

            <div className="grid gap-2">
              <Label>How did it feel?</Label>
              <div className="grid grid-cols-7 gap-2 justify-center">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant={selectedEmoji === emoji ? "default" : "outline"}
                    className={`text-xl ${
                      selectedEmoji === emoji ? "bg-[#157FBF]" : ""
                    }`}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photo">Proof (photo/video)</Label>
              <div className="flex flex-col gap-2 max-h-[220px] overflow-auto">
                <Label
                  htmlFor="photo"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-2 text-center"
                >
                  {photoPreview ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={photoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-auto max-h-[200px] w-full object-cover rounded"
                        width={300}
                        height={300}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 p-2 sm:p-4">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">
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
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="whiteShadow"
              className="border border-black w-full"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
