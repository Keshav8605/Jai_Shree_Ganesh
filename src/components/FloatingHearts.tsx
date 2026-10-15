import React, { useMemo } from "react";

const hearts = ["♡", "♥", "💗", "💕", "💖"];

interface FloatingHeart {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  drift: string;
  rotation: string;
  heart: string;
}

export const FloatingHearts: React.FC<{ count?: number }> = ({
  count = 12,
}) => {
  const items: FloatingHeart[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${10 + Math.random() * 16}px`,
        duration: `${8 + Math.random() * 12}s`,
        delay: `${Math.random() * 10}s`,
        drift: `${-30 + Math.random() * 60}px`,
        rotation: `${-20 + Math.random() * 40}deg`,
        heart: hearts[Math.floor(Math.random() * hearts.length)],
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {items.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            ["--left" as string]: h.left,
            ["--size" as string]: h.size,
            ["--duration" as string]: h.duration,
            ["--delay" as string]: h.delay,
            ["--drift" as string]: h.drift,
            ["--rotation" as string]: h.rotation,
            left: h.left,
            fontSize: h.size,
          }}
        >
          {h.heart}
        </span>
      ))}
    </div>
  );
};
