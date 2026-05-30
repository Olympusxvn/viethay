"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import type { ReelShot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReelPlayerProps {
  shots: ReelShot[];
}

export function ReelPlayer({ shots }: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    if (playing) v.play().catch(() => {});
  }, [current, playing]);

  function handleEnded() {
    if (current < shots.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setCurrent(0);
      setPlaying(false);
    }
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  const shot = shots[current];

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 bg-black">
        <video
          ref={videoRef}
          src={shot.videoUrl}
          poster={shot.coverUrl}
          controls
          playsInline
          onEnded={handleEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-contain"
        />
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          Shot {current + 1}/{shots.length} · {shot.title}
        </div>
      </div>

      <div className="border-t border-white/8 p-3">
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <div className="flex flex-1 gap-1">
            {shots.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                title={`${s.title} · ${s.duration}s`}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i === current
                    ? "bg-[#ff8a3d]"
                    : i < current
                      ? "bg-white/50"
                      : "bg-white/15"
                )}
              />
            ))}
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-[#e9eaf2]/55">{shot.prompt}</p>
      </div>
    </div>
  );
}
