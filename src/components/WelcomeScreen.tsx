import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { CuddlingCouple, SparkleIcon } from "./Illustrations";

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Create heart burst
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const newBursts = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 80,
      }));
      setBursts(newBursts);
      setIsExiting(true);
      setTimeout(() => onEnter(), 1200);
    },
    [onEnter]
  );

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.section
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #FFF2F6 0%, #FFE4EC 30%, #EBDDFB 70%, #FFF2F6 100%)",
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Ambient sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              >
                <SparkleIcon
                  size={8 + Math.random() * 12}
                  color={
                    ["#FFA0B8", "#FF5C93", "#EBDDFB", "#FFE4EC"][
                      Math.floor(Math.random() * 4)
                    ]
                  }
                />
              </motion.div>
            ))}
          </div>

          {/* Floating small hearts */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-love-coral/40"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  fontSize: `${10 + Math.random() * 14}px`,
                }}
                animate={{
                  y: [0, -600],
                  x: [0, (Math.random() - 0.5) * 40],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeOut",
                }}
              >
                ♡
              </motion.span>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
            {/* Label */}
            <motion.p
              className="text-xs sm:text-sm tracking-[0.25em] text-love-pink/80 mb-6"
              style={{ fontFamily: "var(--font-body)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {loveConfig.welcomeLabel}
            </motion.p>

            {/* Characters */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                type: "spring",
                stiffness: 120,
              }}
            >
              <div className="gentle-bounce">
                <CuddlingCouple size={220} />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-love-plum mb-4"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {loveConfig.welcomeHeading}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg text-love-plum/70 mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              {loveConfig.welcomeSubtitle}
            </motion.p>

            {/* CTA Button */}
            <motion.button
              id="welcome-enter-button"
              className="btn-glow relative px-8 py-4 rounded-full text-white font-semibold text-lg cursor-pointer
                         bg-gradient-to-r from-love-pink to-love-coral
                         hover:scale-105 active:scale-95
                         transition-transform duration-200"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              aria-label="Open your surprise"
            >
              {loveConfig.welcomeButton}
            </motion.button>

            {/* Tiny note */}
            <motion.p
              className="mt-4 text-xs text-love-coral/60 italic"
              style={{ fontFamily: "var(--font-handwritten)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              {loveConfig.welcomeNote}
            </motion.p>
          </div>

          {/* Heart burst particles */}
          {bursts.map((b) => (
            <motion.span
              key={b.id}
              className="fixed pointer-events-none text-love-pink z-[60]"
              style={{ left: b.x, top: b.y, fontSize: "18px" }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 2,
                y: -80 + Math.random() * -60,
                x: (Math.random() - 0.5) * 120,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              💗
            </motion.span>
          ))}
        </motion.section>
      ) : (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #FFF2F6 0%, #FFE4EC 50%, #EBDDFB 100%)",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
        >
          {/* Expanding heart */}
          <motion.div
            className="text-love-pink"
            initial={{ scale: 1 }}
            animate={{ scale: 30, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <span style={{ fontSize: "60px" }}>💗</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
