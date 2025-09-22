import { useEffect, useRef } from "react";

export type SoundLevel = 0 | 1 | 2;

function fadeTo(audio: HTMLAudioElement, target: number, ms: number) {
  const steps = 20;
  const step = (target - audio.volume) / steps;
  let i = 0;
  const id = setInterval(() => {
    i++;
    audio.volume = Math.max(0, Math.min(1, audio.volume + step));
    if (i >= steps) clearInterval(id);
  }, ms / steps);
}

export function useIceSounds(
  soundLevel: SoundLevel,
  playBreathing: boolean,
  playSpa: boolean = true
) {
  const breathing = useRef<HTMLAudioElement | null>(null);
  const click = useRef<HTMLAudioElement | null>(null);
  const victory = useRef<HTMLAudioElement | null>(null);
  const spa = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof Audio === "undefined") return;

    breathing.current = new Audio("/mp3/breathing.mp3");
    breathing.current.loop = true;

    click.current = new Audio("/mp3/laptop-touchpad-click.mp3");
    victory.current = new Audio("/mp3/victory_trumpet.mp3");

    spa.current = new Audio("/mp3/echoes-from-the-spa.mp3");
    spa.current.loop = true;

    return () => {
      breathing.current?.pause();
      breathing.current = null;
      click.current = null;
      victory.current = null;

      spa.current?.pause();
      spa.current = null;
    };
  }, []);

  useEffect(() => {
    const volScale = soundLevel === 2 ? 1 : soundLevel === 1 ? 0.5 : 0;
    if (breathing.current) breathing.current.volume = 0.7 * volScale;
    if (click.current) click.current.volume = 0.5 * volScale;
    if (victory.current) victory.current.volume = 0.8 * volScale;
    if (spa.current) spa.current.volume = 0.15 * volScale;
  }, [soundLevel]);

  useEffect(() => {
    const b = breathing.current;
    const s = spa.current;

    if (b) {
      if (playBreathing && soundLevel > 0) {
        b.currentTime = 0;
        b.play().catch(() => {});
      } else {
        b.pause();
        b.currentTime = 0;
      }
    }

    if (s) {
      if (playBreathing && playSpa && soundLevel > 0) {
        try {
          s.play().then(() => fadeTo(s, s.volume || 0.15, 300));
        } catch {}
      } else {
        fadeTo(s, 0, 250);
        setTimeout(() => {
          s.pause();
          s.currentTime = 0;
        }, 260);
      }
    }
  }, [playBreathing, playSpa, soundLevel]);

  const playClick = () => {
    if (!click.current) return;
    click.current.currentTime = 0;
    void click.current.play().catch(() => {});
  };

  const playVictory = () => {
    if (!victory.current) return;
    victory.current.currentTime = 0;
    void victory.current.play().catch(() => {});
  };

  return { playClick, playVictory };
}
