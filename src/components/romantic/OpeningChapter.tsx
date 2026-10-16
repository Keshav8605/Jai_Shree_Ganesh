import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { OpeningChapterConfig } from "../../types/romantic";
import { CuddlingCouple, SparkleIcon } from "../Illustrations";

interface OpeningChapterProps {
  config: OpeningChapterConfig;
  recipientName: string;
  senderName: string;
  onContinue: () => void;
}

/**
 * Opening Chapter — Faithfully restores the original WelcomeScreen base experience
 * as Chapter 1 in the recipient's linear story.
 * Includes gentle-bounce CuddlingCouple illustration, ambient sparkle particles,
 * floating hearts, and the signature glowing CTA button with heart bursts.
 */
export const OpeningChapter: React.FC<OpeningChapterProps> = ({
  config,
  recipientName,
  senderName: _senderName,
  onContinue,
}) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Pre-compute sparkle positions
  const sparkles = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        left: `${15 + Math.random() * 70}%`,
        top: `${10 + Math.random() * 80}%`,
        size: 8 + Math.random() * 12,
        color: ["#FFA0B8", "#FF5C93", "#EBDDFB", "#FFE4EC"][
          Math.floor(Math.random() * 4)
        ],
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    []
  );

  const floatingHearts = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        fontSize: `${10 + Math.random() * 14}px`,
        duration: 6 + Math.random() * 4,
        delay: Math.random() * 5,
        xDrift: (Math.random() - 0.5) * 40,
      })),
    []
  );

  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const newBursts = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 80,
      }));
      setBursts(newBursts);
      setIsRevealing(true);
      setTimeout(() => onContinue(), 1000);
    },
    [onContinue]
  );

  return (
    <div className="relative min-h-[82vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-12">
      {/* Ambient sparkles */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: s.left, top: s.top }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: "easeInOut",
            }}
          >
            <SparkleIcon
              size={s.size}
              color={s.color}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating small hearts */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {floatingHearts.map((h) => (
          <motion.span
            key={h.id}
            className="absolute text-love-coral/40"
            style={{ left: h.left, fontSize: h.fontSize }}
            animate={{
              y: [0, -600],
              x: [0, h.xDrift],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              delay: h.delay,
              ease: "easeOut",
            }}
          >
            ♡
          </motion.span>
        ))}
      </div>

      {/* Heart bursts on click */}
      {bursts.map((b) => (
        <motion.span
          key={b.id}
          className="fixed text-love-coral pointer-events-none z-50 text-xl"
          style={{ left: b.x, top: b.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            y: -100,
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          💖
        </motion.span>
      ))}

      {/* Content Container */}
      <AnimatePresence>
        {!isRevealing && (
          <motion.div
            className="relative z-10 flex flex-col items-center text-center max-w-lg w-full"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* Small label */}
            <motion.p
              className="text-xs sm:text-sm tracking-[0.25em] text-love-deep/75 mb-6 uppercase font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              MADE WITH ALL MY LOVE ♡
            </motion.p>

            {/* Characters / Illustration */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                type: "spring",
                stiffness: 120,
              }}
            >
              {config.heroImageUrl ? (
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-love-blush shadow-xl shadow-love-pink/15">
                  <img
                    src={config.heroImageUrl}
                    alt={`For ${recipientName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="gentle-bounce flex items-center justify-center">
                  <CuddlingCouple size={220} />
                </div>
              )}
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-love-plum mb-4 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {config.greeting || `Hey ${recipientName}, my favorite person...`}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg text-love-plum/70 mb-8 max-w-md font-medium"
              style={{ fontFamily: "var(--font-serif)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {config.subtitle || "I made a little something just for you."}
            </motion.p>

            {/* CTA Button */}
            <motion.button
              id="welcome-enter-button"
              className="btn-glow relative px-8 py-4 rounded-full text-white font-bold text-base sm:text-lg cursor-pointer
                         bg-gradient-to-r from-love-pink to-love-deep
                         hover:scale-105 active:scale-95 shadow-lg shadow-love-pink/30
                         transition-transform duration-200"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
            >
              {config.ctaLabel || "Open Your Surprise ♡"}
            </motion.button>

            {/* Whisper Note */}
            <motion.p
              className="text-xs text-love-coral/70 mt-4 italic font-medium"
              style={{ fontFamily: "var(--font-handwritten)", fontSize: "16px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {config.tinyNote || "Psst... this is only for you."}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
