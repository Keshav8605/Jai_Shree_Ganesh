import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { HuggingCouple, HeartIcon, FlowerIcon, SparkleIcon } from "./Illustrations";

interface FinalLetterProps {
  onReplay: () => void;
}

export const FinalLetter: React.FC<FinalLetterProps> = ({ onReplay }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const letterLines = loveConfig.finalLetter
    .split("\n")
    .filter((line) => line.trim() !== "" || true); // Keep empty lines for spacing

  useEffect(() => {
    if (isOpened && !showFullLetter) {
      let lineIndex = 0;
      timerRef.current = setInterval(() => {
        lineIndex++;
        setVisibleLines(lineIndex);
        if (lineIndex >= letterLines.length) {
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 400);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpened, showFullLetter, letterLines.length]);

  const handleShowAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowFullLetter(true);
    setVisibleLines(letterLines.length);
  };

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFF2F6 0%, #FFF9F4 30%, #FFE4EC 60%, #FFF2F6 100%)",
      }}
    >
      {/* Ambient decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Flowers */}
        <div className="absolute top-20 left-8 opacity-15">
          <FlowerIcon size={55} />
        </div>
        <div className="absolute top-32 right-12 opacity-15">
          <FlowerIcon size={40} />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-10">
          <FlowerIcon size={35} />
        </div>

        {/* Sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 18}%`,
              top: `${8 + i * 15}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          >
            <SparkleIcon size={10} color="#FFA0B8" />
          </motion.div>
        ))}

        {/* Floating hearts */}
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={`h-${i}`}
            className="absolute text-love-coral/20"
            style={{
              left: `${20 + i * 15}%`,
              fontSize: `${8 + i * 2}px`,
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            ♡
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            <motion.div
              key="envelope"
              className="py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              {/* Heading */}
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-love-plum mb-8"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {loveConfig.finalLetterHeading}
              </motion.h2>

              {/* Animated envelope */}
              <motion.div
                className="relative mx-auto mb-8 w-48 h-32"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Envelope body */}
                <div className="absolute inset-0 bg-love-blush rounded-xl border-2 border-love-coral/30 shadow-lg shadow-love-pink/10" />
                {/* Flap */}
                <div
                  className="absolute top-0 left-0 right-0 h-0 border-l-[96px] border-r-[96px] border-t-[48px]
                             border-l-transparent border-r-transparent border-t-love-coral/20 rounded-t-xl"
                />
                {/* Heart seal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <HeartIcon size={30} color="#FF5C93" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Open button */}
              <motion.button
                id="final-letter-open-button"
                className="btn-glow px-10 py-4 rounded-full text-white font-bold text-lg cursor-pointer
                           bg-gradient-to-r from-love-pink to-love-deep
                           hover:scale-105 active:scale-95
                           transition-transform duration-200
                           shadow-xl shadow-love-pink/30"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
              >
                {loveConfig.finalLetterButton}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Letter paper */}
              <div
                className="bg-white/95 rounded-3xl p-6 sm:p-10 shadow-2xl border border-love-blush/40 text-left mb-8"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #FFF9F4 50%, #FFF2F6 100%)",
                }}
              >
                {/* Decorative header */}
                <div className="flex items-center justify-between mb-6">
                  <FlowerIcon size={24} />
                  <div className="flex gap-1">
                    <HeartIcon size={10} color="#FFA0B8" />
                    <HeartIcon size={14} color="#FF5C93" />
                    <HeartIcon size={10} color="#FFA0B8" />
                  </div>
                  <SparkleIcon size={16} color="#FFA0B8" />
                </div>

                {/* Letter content */}
                <div className="space-y-1 min-h-[200px]">
                  {letterLines.map((line, i) => {
                    const isVisible = i < visibleLines;
                    if (!isVisible && !showFullLetter) return null;

                    const isEmpty = line.trim() === "";
                    const isSignature =
                      line.includes("With all my love") ||
                      line.includes("Your favorite");

                    return (
                      <motion.p
                        key={i}
                        className={`${
                          isEmpty ? "h-4" : ""
                        } ${
                          isSignature
                            ? "text-love-pink font-semibold mt-4"
                            : "text-love-plum/80"
                        }`}
                        style={{
                          fontFamily: isSignature
                            ? "var(--font-handwritten)"
                            : "var(--font-serif)",
                          fontStyle: isSignature ? "normal" : "italic",
                          fontSize: isSignature ? "1.1rem" : "0.95rem",
                          lineHeight: "1.8",
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {line || "\u00A0"}
                      </motion.p>
                    );
                  })}
                </div>

                {/* Show all button */}
                {!showFullLetter && visibleLines < letterLines.length && (
                  <motion.button
                    className="mt-4 text-xs text-love-coral/60 underline cursor-pointer hover:text-love-coral transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    onClick={handleShowAll}
                  >
                    Show entire letter ♡
                  </motion.button>
                )}
              </div>

              {/* After letter content */}
              {(showFullLetter || visibleLines >= letterLines.length) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Quote */}
                  <motion.p
                    className="text-base sm:text-lg text-love-pink font-medium mb-6 max-w-md mx-auto"
                    style={{ fontFamily: "var(--font-handwritten)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {loveConfig.finalQuote}
                  </motion.p>

                  {/* Hugging characters */}
                  <motion.div
                    className="flex justify-center mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    <div className="gentle-bounce">
                      <HuggingCouple size={180} />
                    </div>
                  </motion.div>

                  {/* Signoff */}
                  <motion.p
                    className="text-xs text-love-plum/40 mb-8"
                    style={{ fontFamily: "var(--font-body)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {loveConfig.finalSignoff}
                  </motion.p>

                  {/* Replay button */}
                  <motion.button
                    id="replay-button"
                    className="px-8 py-3 rounded-full text-white font-semibold
                               bg-gradient-to-r from-love-pink to-love-coral
                               hover:scale-105 active:scale-95
                               transition-transform duration-200 cursor-pointer
                               shadow-lg shadow-love-pink/20"
                    style={{ fontFamily: "var(--font-display)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReplay}
                  >
                    {loveConfig.replayButton}
                  </motion.button>

                  {/* Hearts footer */}
                  <div
                    className="flex justify-center gap-2 mt-6"
                    aria-hidden="true"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      >
                        <HeartIcon
                          size={8 + i * 2}
                          color={
                            i % 2 === 0 ? "#FF5C93" : "#FFA0B8"
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
