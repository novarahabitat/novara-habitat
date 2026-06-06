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
    <div className="group overflow-hidden rounded-[32px] bg-white shadow-xl">
      <div className="relative h-[420px] overflow-hidden">
        <img
          src={afterImage}
          alt={`${title} après`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            alt={`${title} avant`}
            className="h-full w-full object-cover"
            style={{ width: `${10000 / position}%` }}
          />
        </div>

        <div
          className="absolute top-0 h-full w-[3px] bg-white shadow-[0_0_25px_rgba(0,0,0,0.35)]"
          style={{ left: `${position}%` }}
        />

        <input
          type="range"
          min="5"
          max="95"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />

        <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur">
          Avant
        </div>

        <div className="absolute right-5 top-5 rounded-full bg-[#c9a45c]/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black backdrop-blur">
          Après
        </div>

        <div
          className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/60 text-white shadow-xl backdrop-blur"
          style={{ left: `${position}%` }}
        >
          ↔
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-light text-[#1f1f1f]">{title}</h3>
      </div>
    </div>
  );
}
