import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { HeartIcon, FlowerIcon } from "./Illustrations";

interface LoveEnvelopeProps {
  onContinue: () => void;
}

interface LetterModalProps {
  letter: (typeof loveConfig.letters)[0];
  onClose: () => void;
}

const LetterModal: React.FC<LetterModalProps> = ({ letter, onClose }) => (
  <motion.div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="relative max-w-md w-full"
      initial={{ y: 60, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Letter paper */}
      <div
        className="bg-white rounded-2xl p-8 shadow-2xl border border-love-blush/40"
        style={{
          background:
            "linear-gradient(135deg, #FFFFFF 0%, #FFF9F4 50%, #FFF2F6 100%)",
        }}
      >
        {/* Decorative stamp */}
        <div className="flex justify-between items-start mb-6">
          <FlowerIcon size={28} />
          <div className="px-3 py-1 rounded-full bg-love-blush/50 text-love-pink text-xs font-medium">
            {letter.emoji} with love
          </div>
        </div>

        {/* Letter label */}
        <h3
          className="text-lg font-bold text-love-plum mb-4"
          style={{ fontFamily: "var(--font-handwritten)" }}
        >
          {letter.label}
        </h3>

        {/* Letter content */}
        <div
          className="text-love-plum/80 leading-relaxed whitespace-pre-wrap text-sm"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          {letter.message}
        </div>

        {/* Signature */}
        <div className="mt-6 flex items-center justify-between">
          <p
            className="text-love-pink text-sm"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            — with all my heart ♡
          </p>
          <HeartIcon size={16} color="#FF5C93" />
        </div>

        {/* Close */}
        <button
          className="mt-6 w-full py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-coral text-white font-medium text-sm
                     hover:opacity-90 transition-opacity cursor-pointer"
          style={{ fontFamily: "var(--font-display)" }}
          onClick={onClose}
        >
          Close letter ♡
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export const LoveEnvelope: React.FC<LoveEnvelopeProps> = ({ onContinue }) => {
  const [openedLetters, setOpenedLetters] = useState<Set<number>>(new Set());
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  const handleOpen = (index: number) => {
    setOpenedLetters((prev) => new Set(prev).add(index));
    setSelectedLetter(index);
  };

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFF2F6 0%, #EBDDFB 40%, #FFF9F4 80%, #FFF2F6 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-10 opacity-20">
          <FlowerIcon size={60} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <FlowerIcon size={45} />
        </div>
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
          {loveConfig.lettersHeading}
        </motion.h2>

        <motion.p
          className="text-sm text-love-plum/60 mb-12"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {loveConfig.lettersSubtitle}
        </motion.p>

        {/* Envelope grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {loveConfig.letters.map((letter, i) => {
            const isOpened = openedLetters.has(i);
            return (
              <motion.button
                key={i}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpen(i)}
                aria-label={`${letter.label}. ${isOpened ? "Already opened." : "Click to open."}`}
              >
                {/* Envelope card */}
                <div
                  className="relative rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden"
                  style={{
                    background: letter.color,
                    borderColor: isOpened
                      ? "rgba(255, 92, 147, 0.3)"
                      : "rgba(255, 160, 184, 0.2)",
                  }}
                >
                  {/* Envelope flap effect */}
                  <div
                    className="absolute top-0 left-0 right-0 h-12 transition-transform duration-500"
                    style={{
                      background: `linear-gradient(180deg, ${letter.color}dd, transparent)`,
                      transformOrigin: "top",
                      transform: isOpened ? "scaleY(0.3)" : "scaleY(1)",
                    }}
                  />

                  {/* Emoji */}
                  <motion.span
                    className="text-4xl mb-3 block relative z-10"
                    animate={
                      isOpened
                        ? {}
                        : { y: [0, -3, 0] }
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    {letter.emoji}
                  </motion.span>

                  {/* Label */}
                  <p
                    className="text-sm font-semibold text-love-plum/80 relative z-10"
                    style={{ fontFamily: "var(--font-handwritten)" }}
                  >
                    {letter.label}
                  </p>

                  {/* Opened indicator */}
                  {isOpened && (
                    <motion.div
                      className="absolute top-2 right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <HeartIcon size={14} color="#FF5C93" />
                    </motion.div>
                  )}

                  {/* Seal */}
                  {!isOpened && (
                    <div className="absolute bottom-3 right-3 opacity-40">
                      <HeartIcon size={18} color="#FF5C93" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Counter */}
        <motion.p
          className="text-xs text-love-coral/60 mb-6"
          style={{ fontFamily: "var(--font-handwritten)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {openedLetters.size} of {loveConfig.letters.length} letters opened 💌
        </motion.p>

        {/* Continue button */}
        <motion.button
          id="letters-continue-button"
          className="px-8 py-3 rounded-full text-white font-semibold
                     bg-gradient-to-r from-love-pink to-love-coral
                     hover:scale-105 active:scale-95
                     transition-transform duration-200 cursor-pointer
                     shadow-lg shadow-love-pink/20"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={onContinue}
        >
          Keep going ♡
        </motion.button>
      </div>

      {/* Letter modal */}
      <AnimatePresence>
        {selectedLetter !== null && (
          <LetterModal
            letter={loveConfig.letters[selectedLetter]}
            onClose={() => setSelectedLetter(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
