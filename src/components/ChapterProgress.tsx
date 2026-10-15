import React from "react";
import { HeartIcon } from "./Illustrations";

const chapters = [
  "Welcome",
  "Our Story",
  "Do You Love Me?",
  "Reasons",
  "Letters",
  "Gallery",
  "Quiz",
  "Surprises",
  "Final Letter",
];

interface ChapterProgressProps {
  currentChapter: number;
  totalChapters?: number;
}

export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  currentChapter,
}) => {
  if (currentChapter <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Progress bar */}
      <div className="h-1 bg-love-blush/50">
        <div
          className="h-full bg-gradient-to-r from-love-pink to-love-coral transition-all duration-700 ease-out"
          style={{
            width: `${(currentChapter / (chapters.length - 1)) * 100}%`,
          }}
        />
      </div>
      {/* Chapter label */}
      <div className="pointer-events-auto flex items-center justify-center gap-2 py-2 bg-white/80 backdrop-blur-sm border-b border-love-blush/30">
        <HeartIcon size={12} color="#FF5C93" />
        <span
          className="text-xs font-medium tracking-wider text-love-plum/70"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {chapters[currentChapter] || `Chapter ${currentChapter}`}
        </span>
        <span className="text-xs text-love-coral/50">
          {currentChapter} of {chapters.length - 1}
        </span>
        <HeartIcon size={12} color="#FFA0B8" />
      </div>
    </div>
  );
};
