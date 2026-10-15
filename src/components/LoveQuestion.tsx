import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { PandaWithPhone, HuggingCouple, HeartIcon } from "./Illustrations";

interface LoveQuestionProps {
  onContinue: () => void;
}

export const LoveQuestion: React.FC<LoveQuestionProps> = ({ onContinue }) => {
  const [noAttempts, setNoAttempts] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const dodgeNo = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const btnWidth = 140;
    const btnHeight = 50;
    const maxX = container.width - btnWidth - 20;
    const maxY = container.height - btnHeight - 20;

    const minY = Math.min(320, Math.max(150, maxY - 80));
    const newX = 16 + Math.random() * Math.max(10, maxX - 16);
    const newY = minY + Math.random() * Math.max(10, maxY - minY);

    setNoPos({ x: newX, y: newY });

    const attemptNum = noAttempts + 1;
    setNoAttempts(attemptNum);

    const messages = loveConfig.noAttemptMessages;
    if (attemptNum <= messages.length) {
      setShowMessage(messages[attemptNum - 1]);
      setTimeout(() => setShowMessage(null), 2000);
    }
  }, [noAttempts]);

  const handleYes = useCallback(() => {
    setAnswered(true);
  }, []);

  const handleNoInteraction = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (noAttempts >= loveConfig.noAttemptMessages.length) {
        // Give up and let them click
        setAnswered(true);
        return;
      }
      dodgeNo();
    },
    [dodgeNo, noAttempts]
  );

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #FFE4EC 0%, #FFF2F6 40%, #FFE4EC 100%)",
      }}
    >
      {/* Background hearts */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <HeartIcon
              size={16 + i * 4}
              color={i % 2 === 0 ? "#FFA0B8" : "#FFE4EC"}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              ref={containerRef}
              className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 pb-48 shadow-xl border border-love-blush/50 min-h-[480px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              {/* Heading */}
              <motion.p
                className="text-sm text-love-pink/70 text-center mb-2"
                style={{ fontFamily: "var(--font-body)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Okay, I have a VERY important question...
              </motion.p>

              {/* Character */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="gentle-bounce">
                  <PandaWithPhone size={130} />
                </div>
              </motion.div>

              {/* Question */}
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-love-plum text-center mb-8"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {loveConfig.loveQuestion}
              </motion.h2>

              {/* YES button */}
              <motion.button
                id="yes-button"
                className="w-full py-4 rounded-full text-white font-bold text-lg cursor-pointer
                           bg-gradient-to-r from-love-pink to-love-coral
                           hover:scale-105 active:scale-95
                           transition-transform duration-200
                           shadow-lg shadow-love-pink/30 mb-4 relative z-10"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={handleYes}
                aria-label="Yes, of course I love you"
              >
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full border-2 border-love-pink animate-[pulse-ring_2s_ease-out_infinite]" />
                {loveConfig.yesText}
              </motion.button>

              {/* NO button - dodging */}
              <motion.button
                ref={noButtonRef}
                id="no-button"
                className="py-3 px-8 rounded-full font-semibold text-love-plum/70 cursor-pointer
                           bg-white border-2 border-love-blush
                           hover:border-love-coral
                           transition-colors duration-200 z-[5]"
                style={{
                  fontFamily: "var(--font-display)",
                  position: noPos ? "absolute" : "relative",
                  left: noPos ? `${noPos.x}px` : "auto",
                  top: noPos ? `${noPos.y}px` : "auto",
                  width: noPos ? "auto" : "100%",
                  transition: noPos ? "left 0.3s ease, top 0.3s ease" : undefined,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: noPos ? 0 : 0 }}
                transition={{ delay: 0.9 }}
                onPointerEnter={handleNoInteraction}
                onPointerDown={handleNoInteraction}
                aria-label="No button - this button playfully dodges your click"
              >
                {loveConfig.noText}
              </motion.button>

              {/* Attempt message */}
              <AnimatePresence>
                {showMessage && (
                  <motion.p
                    className="absolute bottom-4 left-0 right-0 text-center text-sm text-love-pink font-medium px-4"
                    style={{ fontFamily: "var(--font-handwritten)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {showMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Skip link for accessibility */}
              <button
                className="mt-6 text-xs text-love-coral/40 underline cursor-pointer hover:text-love-coral/60 transition-colors block mx-auto"
                onClick={() => setAnswered(true)}
                aria-label="Skip this interaction"
              >
                skip this part →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-love-blush/50 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              {/* Heart explosion */}
              <div className="relative mb-4">
                {[...Array(12)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 text-love-pink pointer-events-none"
                    style={{ fontSize: `${12 + Math.random() * 14}px` }}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{
                      opacity: 0,
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                      scale: 0.5,
                    }}
                    transition={{
                      duration: 1 + Math.random() * 0.5,
                      delay: Math.random() * 0.3,
                      ease: "easeOut",
                    }}
                  >
                    {["💗", "💕", "💖", "♡", "✨"][Math.floor(Math.random() * 5)]}
                  </motion.span>
                ))}
              </div>

              {/* Response */}
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-love-pink mb-4"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {loveConfig.yesResponse}
              </motion.h2>

              <motion.p
                className="text-love-plum/70 mb-6"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {loveConfig.yesSubResponse}
              </motion.p>

              {/* Hugging characters */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <div className="gentle-bounce">
                  <HuggingCouple size={200} />
                </div>
              </motion.div>

              <motion.p
                className="text-sm text-love-plum/60 mb-6"
                style={{ fontFamily: "var(--font-handwritten)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Officially the cutest couple in my little universe. 💗
              </motion.p>

              {/* Continue button */}
              <motion.button
                id="love-continue-button"
                className="px-8 py-3 rounded-full text-white font-semibold
                           bg-gradient-to-r from-love-pink to-love-coral
                           hover:scale-105 active:scale-95
                           transition-transform duration-200 cursor-pointer
                           shadow-lg shadow-love-pink/20"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={onContinue}
              >
                Tell me more, baby ♡
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
