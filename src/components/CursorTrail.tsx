import React, { useEffect, useRef, useCallback } from "react";

export const CursorTrail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(0);

  const createHeart = useCallback((x: number, y: number) => {
    if (!containerRef.current) return;

    const heart = document.createElement("span");
    heart.className = "cursor-heart";
    heart.textContent = ["♡", "💗", "♥"][Math.floor(Math.random() * 3)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.color = ["#FF5C93", "#FFA0B8", "#FFE4EC"][
      Math.floor(Math.random() * 3)
    ];

    containerRef.current.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }, []);

  useEffect(() => {
    // Only on desktop - check for touch capability
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current < 80) return; // Throttle
      lastTimeRef.current = now;
      createHeart(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [createHeart]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
};
