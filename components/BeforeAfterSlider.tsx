"use client";

import { useState } from "react";

type BeforeAfterSliderProps = {
  beforeImage: string;
  afterImage: string;
  title: string;
};

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
      <div className="relative h-[320px] overflow-hidden bg-black md:h-[420px]">
        <img
          src={afterImage}
          alt={`${title} après`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={`${title} avant`}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div
          className="pointer-events-none absolute top-0 z-20 h-full w-[3px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.35)]"
          style={{ left: `${position}%` }}
        />

        <div
          className="pointer-events-none absolute top-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/75 text-white shadow-xl backdrop-blur"
          style={{ left: `${position}%` }}
        >
          ↔
        </div>

        <input
          type="range"
          min="5"
          max="95"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 z-40 h-full w-full cursor-ew-resize opacity-0"
          aria-label={`Comparer avant après ${title}`}
        />

        <div className="pointer-events-none absolute left-4 top-4 z-30 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur">
          Avant
        </div>

        <div className="pointer-events-none absolute right-4 top-4 z-30 rounded-full bg-[#c9a45c]/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black backdrop-blur">
          Après
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-xl font-light text-[#1f1f1f] md:text-2xl">
          {title}
        </h3>
      </div>
    </div>
  );
}
