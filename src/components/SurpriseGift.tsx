import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { HeartIcon, SparkleIcon } from "./Illustrations";

interface SurpriseGiftProps {
  onContinue: () => void;
}

export const SurpriseGift: React.FC<SurpriseGiftProps> = ({ onContinue }) => {
  const [openedGifts, setOpenedGifts] = useState<Set<number>>(new Set());
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [showBurst, setShowBurst] = useState<number | null>(null);

  const handleOpen = (index: number) => {
    if (openedGifts.has(index)) {
      setSelectedGift(index);
      return;
    }
    setShowBurst(index);
    setOpenedGifts((prev) => new Set(prev).add(index));
    setTimeout(() => {
      setShowBurst(null);
      setSelectedGift(index);
    }, 800);
  };

  const giftIcons = ["✨", "🧸", "💌"];
  const giftColors = ["#FFE4EC", "#EBDDFB", "#FFF9F4"];
  const giftAccents = ["#FF5C93", "#B388EB", "#FFA0B8"];

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #FFF9F4 0%, #FFE4EC 40%, #EBDDFB 80%, #FFF2F6 100%)",
      }}
    >
      {/* Background sparkles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.5, 1.2, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
            }}
          >
            <SparkleIcon size={8 + i * 2} color="#FFA0B8" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-love-plum mb-3"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {loveConfig.giftsHeading}
        </motion.h2>

        <motion.p
          className="text-sm text-love-plum/60 mb-10"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {loveConfig.giftsSubtitle}
        </motion.p>

        {/* Gift boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {loveConfig.gifts.map((gift, i) => {
            const isOpened = openedGifts.has(i);
            const isBursting = showBurst === i;

            return (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                <motion.button
                  className="w-full cursor-pointer"
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOpen(i)}
                  aria-label={`${gift.label}. ${isOpened ? "Already opened. Click to read again." : "Click to open."}`}
                >
                  {/* Gift box visual */}
                  <div
                    className="rounded-3xl p-6 border-2 transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: giftColors[i],
                      borderColor: isOpened
                        ? giftAccents[i]
                        : `${giftAccents[i]}40`,
                    }}
                  >
                    {/* Ribbon */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full opacity-20"
                      style={{ background: giftAccents[i] }}
                    />
                    <div
                      className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 opacity-20"
                      style={{ background: giftAccents[i] }}
                    />

                    {/* Box content */}
                    <div className="relative z-10">
                      {/* Emoji / Icon */}
                      <motion.span
                        className="text-5xl block mb-3"
                        animate={
                          !isOpened
                            ? { y: [0, -5, 0] }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                      >
                        {isOpened ? giftIcons[i] : "🎁"}
                      </motion.span>

                      {/* Label */}
                      <p
                        className="text-sm font-semibold text-love-plum/80"
                        style={{ fontFamily: "var(--font-handwritten)" }}
                      >
                        {gift.label}
                      </p>

                      {/* Opened badge */}
                      {isOpened && (
                        <motion.div
                          className="absolute top-1 right-1"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring" }}
                        >
                          <HeartIcon size={14} color={giftAccents[i]} />
                        </motion.div>
                      )}
                    </div>

                    {/* Bow */}
                    {!isOpened && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">
                        🎀
                      </div>
                    )}
                  </div>
                </motion.button>

                {/* Burst animation */}
                {isBursting && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {[...Array(10)].map((_, j) => (
                      <motion.span
                        key={j}
                        className="absolute"
                        style={{ fontSize: `${10 + Math.random() * 10}px` }}
                        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        animate={{
                          opacity: 0,
                          scale: 0.5,
                          x: (Math.random() - 0.5) * 120,
                          y: (Math.random() - 0.5) * 120,
                        }}
                        transition={{
                          duration: 0.7,
                          delay: Math.random() * 0.2,
                          ease: "easeOut",
                        }}
                      >
                        {["💗", "✨", "⭐", "💕", "🌟"][Math.floor(Math.random() * 5)]}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* All opened message */}
        {openedGifts.size === loveConfig.gifts.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p
              className="text-sm text-love-plum/60 mb-6"
              style={{ fontFamily: "var(--font-handwritten)" }}
            >
              You opened all your surprises! 🎉
            </p>
            <motion.button
              id="gifts-continue-button"
              className="px-8 py-3 rounded-full text-white font-semibold
                         bg-gradient-to-r from-love-pink to-love-coral
                         hover:scale-105 active:scale-95
                         transition-transform duration-200 cursor-pointer
                         shadow-lg shadow-love-pink/20"
              style={{ fontFamily: "var(--font-display)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
            >
              Read my final letter 💌
            </motion.button>
          </motion.div>
        )}

        {/* Show continue even if not all opened */}
        {openedGifts.size > 0 &&
          openedGifts.size < loveConfig.gifts.length && (
            <motion.button
              className="mt-4 text-xs text-love-coral/50 underline cursor-pointer hover:text-love-coral/70 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onContinue}
            >
              skip to final letter →
            </motion.button>
          )}
      </div>

      {/* Gift content modal */}
      <AnimatePresence>
        {selectedGift !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGift(null)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-love-blush/50 text-center"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-5xl block mb-4">
                {loveConfig.gifts[selectedGift].emoji}
              </span>
              <h3
                className="text-xl font-bold text-love-pink mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {loveConfig.gifts[selectedGift].label}
              </h3>
              <p
                className="text-love-plum/75 leading-relaxed text-sm"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                {loveConfig.gifts[selectedGift].message}
              </p>
              <button
                className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-coral text-white font-medium text-sm
                           hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setSelectedGift(null)}
              >
                Close ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
