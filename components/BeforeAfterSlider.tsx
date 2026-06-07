"use client";

import { useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(95, Math.max(5, (x / rect.width) * 100));

    setPosition(percentage);
  };

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
      <div
        ref={containerRef}
        className="relative h-[320px] touch-none overflow-hidden select-none md:h-[420px]"
        onMouseDown={(e) => updatePosition(e.clientX)}
        onMouseMove={(e) => {
          if (e.buttons === 1) updatePosition(e.clientX);
        }}
        onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
        onTouchMove={(e) => {
          e.preventDefault();
          updatePosition(e.touches[0].clientX);
        }}
      >
        <img
          src={afterImage}
          alt={`${title} après`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            alt={`${title} avant`}
            className="h-full object-cover"
            style={{
              width: `${10000 / position}%`,
              maxWidth: "none",
            }}
            draggable={false}
          />
        </div>

        <div
          className="absolute top-0 z-20 h-full w-[3px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          style={{ left: `${position}%` }}
        />

        <div
          className="pointer-events-none absolute top-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/75 text-white shadow-xl backdrop-blur"
          style={{ left: `${position}%` }}
        >
          ↔
        </div>

        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur">
          Avant
        </div>

        <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-[#c9a45c]/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black backdrop-blur">
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
