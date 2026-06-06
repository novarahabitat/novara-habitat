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

  const updatePosition = (
    clientX: number,
    element: HTMLDivElement
  ) => {
    const rect = element.getBoundingClientRect();

    const x = clientX - rect.left;

    const percentage = Math.min(
      95,
      Math.max(5, (x / rect.width) * 100)
    );

    setPosition(percentage);
  };

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
      <div
        className="relative h-[320px] overflow-hidden md:h-[420px]"
        onPointerDown={(e) =>
          updatePosition(e.clientX, e.currentTarget)
        }
        onPointerMove={(e) => {
          if (e.buttons === 1) {
            updatePosition(e.clientX, e.currentTarget);
          }
        }}
      >
        {/* IMAGE APRES */}
        <img
          src={afterImage}
          alt={`${title} Après`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* IMAGE AVANT */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            alt={`${title} Avant`}
            className="h-full object-cover"
            style={{
              width: `${10000 / position}%`,
              maxWidth: "none",
            }}
          />
        </div>

        {/* LIGNE DE SEPARATION */}
        <div
          className="absolute top-0 h-full w-[3px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]"
          style={{ left: `${position}%` }}
        />

        {/* CURSEUR INVISIBLE */}
        <input
          type="range"
          min="5"
          max="95"
          value={position}
          onChange={(e) =>
            setPosition(Number(e.target.value))
          }
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />

        {/* BOUTON CENTRAL */}
        <div
          className="pointer-events-none absolute top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/70 text-white shadow-xl backdrop-blur"
          style={{ left: `${position}%` }}
        >
          ↔
        </div>

        {/* LABEL AVANT */}
        <div className="absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur">
          Avant
        </div>

        {/* LABEL APRES */}
        <div className="absolute right-4 top-4 rounded-full bg-[#c9a45c]/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black backdrop-blur">
          Après
        </div>
      </div>

      {/* TITRE */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-light text-[#1f1f1f] md:text-2xl">
          {title}
        </h3>
      </div>
    </div>
  );
}
