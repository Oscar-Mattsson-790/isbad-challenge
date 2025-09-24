"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useStopwatch } from "@/lib/hooks/useStopwatch";
import { SoundLevel, useIceSounds } from "@/lib/hooks/useIceSounds";

type Props = {
  onAddSession?: (durationMs: number) => void;
};

const PENDING_KEY = "timer.pending";
const MS_KEY = "timer.ms";

export default function IceBathTimer({ onAddSession }: Props) {
  const [soundLevel, setSoundLevel] = useState<SoundLevel>(2);
  const [running, setRunning] = useState(false);
  const [showLogButton, setShowLogButton] = useState(false);
  const victoryFiredRef = useRef(false);

  const { ms, setMs, reset } = useStopwatch(running, 100);
  const { playClick, playVictory } = useIceSounds(soundLevel, running);

  useEffect(() => {
    try {
      const pending = localStorage.getItem(PENDING_KEY) === "1";
      const storedMs = Number(localStorage.getItem(MS_KEY) ?? "0");
      if (pending && storedMs > 0) {
        setShowLogButton(true);
        setMs(storedMs);
      }
    } catch {}
  }, [setMs]);

  useEffect(() => {
    const onLogged = () => {
      clearPending();
      setShowLogButton(false);
    };
    window.addEventListener("timer-session-logged", onLogged as EventListener);
    return () =>
      window.removeEventListener(
        "timer-session-logged",
        onLogged as EventListener
      );
  }, []);

  const formatTime = (totalMs: number) => {
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const centi = Math.floor((totalMs % 1000) / 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}:${String(centi).padStart(2, "0")}`;
  };

  const seconds = Math.floor(ms / 1000);
  const motivational = useMemo(() => {
    if (seconds === 0) return "Ready to embrace the cold?";
    if (seconds < 30) return "Feel the chill awakening your body";
    if (seconds < 60) return "Your mind is getting stronger";
    if (seconds < 120) return "Breathe through the cold";
    if (seconds < 180) return "You're building mental resilience";
    return "Ice warrior mode activated! 🧊";
  }, [seconds]);

  if (running && seconds >= 180 && !victoryFiredRef.current) {
    victoryFiredRef.current = true;
    playVictory();
  }
  if (!running && seconds < 180 && victoryFiredRef.current) {
    victoryFiredRef.current = false;
  }

  const vibrate = () =>
    "vibrate" in navigator ? (navigator as any).vibrate?.(50) : undefined;

  const setPending = (val: boolean, atMs: number) => {
    try {
      if (val) {
        localStorage.setItem(PENDING_KEY, "1");
        localStorage.setItem(MS_KEY, String(atMs));
      } else {
        clearPending();
      }
    } catch {}
  };

  const clearPending = () => {
    try {
      localStorage.removeItem(PENDING_KEY);
      localStorage.removeItem(MS_KEY);
    } catch {}
  };

  const handleStart = () => {
    playClick();
    vibrate();
    setRunning(true);
    setShowLogButton(false);
    clearPending();
  };

  const handleStop = () => {
    playClick();
    vibrate();
    setRunning(false);
    if (ms > 0) {
      setShowLogButton(true);
      setPending(true, ms);
    }
  };

  const handleReset = () => {
    playClick();
    vibrate();
    setRunning(false);
    reset();
    setShowLogButton(false);
    clearPending();
    victoryFiredRef.current = false;
  };

  const handleLog = () => {
    playClick();
    vibrate();
    onAddSession?.(ms);
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <Image
            src="/images/cube-logo.png"
            alt="Ice Bath Logo"
            width={28}
            height={28}
            className="opacity-80 sm:w-8 sm:h-8"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/80 tracking-tight">
            COLD TIMER
          </h1>
          <Image
            src="/images/cube-logo.png"
            alt="Ice Bath Logo"
            width={28}
            height={28}
            className="opacity-80 sm:w-8 sm:h-8"
          />
        </div>
      </div>

      <Card className="relative overflow-hidden border-2 border-[#157FBF]/30 shadow-2xl bg-[#242422]">
        <CardContent className="p-4 sm:p-6 lg:p-8 text-center relative">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="text-white/60 text-xs">OFF</span>
            <input
              type="range"
              min={0}
              max={2}
              value={soundLevel}
              onChange={(e) =>
                setSoundLevel(Number(e.target.value) as SoundLevel)
              }
              className="w-20 sm:w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #157FBF 0%, #157FBF ${(soundLevel / 2) * 100}%, #4a5568 ${(soundLevel / 2) * 100}%, #4a5568 100%)`,
              }}
            />
            <span className="text-white/60 text-xs">HIGH</span>
          </div>

          <div className={`mb-6 sm:mb-8 ${running ? "pulse-cold" : ""}`}>
            <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-mono font-bold text-[#157FBF] mb-2 tracking-wider overflow-visible">
              {formatTime(ms)}
            </div>
          </div>

          <div className="mb-6 sm:mb-8 h-10 sm:h-15 flex items-center justify-center px-2">
            <p
              className={`text-s sm:text-sm text-center leading-relaxed ${seconds >= 180 ? "text-white victory-glow pulse-cold" : running ? "text-white/80 pulse-cold" : "text-white/80"}`}
            >
              {motivational}
            </p>
          </div>

          <div className="flex flex-row gap-3 sm:gap-4 justify-center">
            {!running ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="flex items-center gap-2 px-4 sm:px-8 py-3 bg-[#157FBF] hover:bg-[#157FBF]/90 text-white"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" /> START
              </Button>
            ) : (
              <Button
                onClick={handleStop}
                size="lg"
                className="flex items-center gap-2 px-4 sm:px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white"
              >
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> STOP
              </Button>
            )}

            <Button
              onClick={handleReset}
              size="lg"
              className="flex items-center gap-2 px-3 sm:px-6 py-3 border-2 border-[#157FBF] text-[#157FBF] hover:bg-[#157FBF] hover:text-white"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /> RESET
            </Button>
          </div>

          {showLogButton && (
            <div className="border-t border-white/20 mt-6 pt-4">
              <div className="flex justify-center pt-8">
                <Button
                  onClick={handleLog}
                  size="lg"
                  className="px-6 py-3 bg-[#157FBF] hover:bg-[#157FBF]/90 text-white uppercase"
                >
                  ADD THIS SESSION
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <p className="text-white/60 text-xs sm:text-sm">
          Embrace the cold and upgrade yourself today
        </p>
      </div>
    </div>
  );
}
