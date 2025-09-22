import { useEffect, useRef, useState } from "react";

export function useStopwatch(isRunning: boolean, stepMs: number = 100) {
  const [ms, setMs] = useState<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    lastRef.current = performance.now();

    const loop = (now: number) => {
      const delta = now - lastRef.current;
      if (delta >= stepMs) {
        const steps = Math.floor(delta / stepMs);
        lastRef.current = now;
        setMs((prev) => prev + steps * stepMs);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isRunning, stepMs]);

  const reset = () => setMs(0);

  return { ms, setMs, reset };
}
