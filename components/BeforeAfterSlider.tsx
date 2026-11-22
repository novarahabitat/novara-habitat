"use client";

import { useState } from "react";

type Props = {
  beforeImage: string;
  afterImage: string;
  title: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

// Curseur avant / après : on fait glisser pour comparer les deux photos.
export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  beforeLabel = "Avant",
  afterLabel = "Après",
  className = "",
}: Props) {
  const [position, setPosition] = useState(50);

  return (
    <div className={`comp ${className}`}>
      <img src={afterImage} alt={`${title} — ${afterLabel}`} draggable={false} />
      <div className="haut" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={beforeImage} alt={`${title} — ${beforeLabel}`} draggable={false} />
      </div>
      <div className="trait" style={{ left: `${position}%` }} />
      <div className="bouton" style={{ left: `${position}%` }}>↔</div>
      <span className="tag g">{beforeLabel}</span>
      <span className="tag d">{afterLabel}</span>
      <input
        type="range"
        min={3}
        max={97}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={`Comparer ${beforeLabel.toLowerCase()} et ${afterLabel.toLowerCase()} : ${title}`}
      />
    </div>
  );
}
