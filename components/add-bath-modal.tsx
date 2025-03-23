"use client";

import type React from "react";

import { useState } from "react";
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
import { sv } from "date-fns/locale";
import { CalendarIcon, Clock, Upload } from "lucide-react";
import { toast } from "sonner";

interface AddBathModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const emojis = ["😊", "😎", "🥶", "💪", "🔥", "😁", "😌"];

export default function AddBathModal({ open, setOpen }: AddBathModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("08:00");
  const [duration, setDuration] = useState("01:30");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate saving data
    toast.success("Isbad registrerat!", {
      description: `Ditt isbad den ${format(date, "PPP", {
        locale: sv,
      })} har sparats.`,
    });

    setOpen(false);
    // Reset form
    setDate(new Date());
    setTime("08:00");
    setDuration("01:30");
    setSelectedEmoji("😊");
    setFile(null);
    setPhotoPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrera ett nytt isbad</DialogTitle>
          <DialogDescription>
            Fyll i information om ditt isbad för att registrera det i din
            utmaning.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Datum</Label>
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
                      ? format(date, "PPP", { locale: sv })
                      : "Välj ett datum"}
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
              <Label htmlFor="time">Tidpunkt</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Varaktighet (mm:ss)</Label>
              <Input
                id="duration"
                type="text"
                placeholder="01:30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Hur kändes det?</Label>
              <div className="flex justify-between">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant={selectedEmoji === emoji ? "default" : "outline"}
                    className={`text-xl ${
                      selectedEmoji === emoji ? "bg-[#0B4F82]" : ""
                    }`}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo">Bevis (bild/video)</Label>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="photo"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed"
                >
                  {photoPreview ? (
                    <div className="relative h-full w-full">
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="Förhandsvisning"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 p-4 text-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Dra och släpp eller klicka för att ladda upp
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Bild eller kort video (max 20MB)
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
            <Button type="submit" className="bg-[#0B4F82] hover:bg-[#0A3F69]">
              Spara
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
