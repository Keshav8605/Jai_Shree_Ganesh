import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { Panda, HeartIcon, SparkleIcon } from "./Illustrations";

interface ReasonsGridProps {
  onContinue: () => void;
}

export const ReasonsGrid: React.FC<ReasonsGridProps> = ({ onContinue }) => {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [bonusReasons, setBonusReasons] = useState<
    typeof loveConfig.bonusReasons
  >([]);
  const [bonusIndex, setBonusIndex] = useState(0);

  const allReasons = [...loveConfig.reasons, ...bonusReasons];

  const handleCardClick = (index: number) => {
    setRevealedCards((prev) => new Set(prev).add(index));
    setSelectedCard(index);
  };

  const handleBonusReason = () => {
    if (bonusIndex < loveConfig.bonusReasons.length) {
      setBonusReasons((prev) => [
        ...prev,
        loveConfig.bonusReasons[bonusIndex],
      ]);
      setBonusIndex((prev) => prev + 1);
    }
  };

  const cardColors = [
    "#FFE4EC",
    "#EBDDFB",
    "#FFF9F4",
    "#FFE4EC",
    "#FFF2F6",
    "#EBDDFB",
  ];

  const cardEmojis = ["💗", "🌸", "✨", "💕", "🦋", "🌺", "💖", "⭐", "🌷", "💝", "🎀", "🌟"];

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFF9F4 0%, #FFE4EC 30%, #FFF2F6 70%, #FFF9F4 100%)",
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          className="inline-block px-4 py-1 rounded-full bg-love-pink/10 border border-love-pink/20 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="text-xs tracking-[0.15em] text-love-pink"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A LIST. FOR U. ONLY U.
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span
            className="text-love-coral"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {loveConfig.reasonsHeading}
          </span>
        </motion.h2>

        <motion.h3
          className="text-3xl sm:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span
            className="text-love-plum/70"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            Why{" "}
          </span>
          <span
            className="text-love-pink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            I love{" "}
          </span>
          <span
            className="text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            YOU ♡
          </span>
        </motion.h3>

        {/* Character */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Panda size={110} />
        </motion.div>

        {/* Intro text */}
        <motion.p
          className="text-sm text-love-plum/60 mb-8 max-w-md mx-auto"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {loveConfig.reasonsIntro}
        </motion.p>

        {/* Reason cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {allReasons.map((reason, i) => (
            <motion.button
              key={`reason-${i}`}
              className="group relative p-4 rounded-2xl cursor-pointer border-2 border-transparent
                         hover:border-love-coral/30 hover:shadow-lg hover:shadow-love-pink/10
                         transition-all duration-300"
              style={{
                background: cardColors[i % cardColors.length],
                fontFamily: "var(--font-body)",
              }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + (i % 6) * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCardClick(i)}
              aria-label={`Reason: ${reason.short}. Click to read more.`}
            >
              {/* Emoji */}
              <span className="text-2xl mb-2 block">
                {cardEmojis[i % cardEmojis.length]}
              </span>
              {/* Short text */}
              <p className="text-sm font-semibold text-love-plum/80">
                {reason.short}
              </p>
              {/* Revealed indicator */}
              {revealedCards.has(i) && (
                <span className="absolute top-2 right-2 text-xs text-love-pink">
                  ♡
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Counter */}
        <motion.p
          className="text-xs text-love-coral/60 mb-4"
          style={{ fontFamily: "var(--font-handwritten)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {revealedCards.size} little reason{revealedCards.size !== 1 ? "s" : ""}{" "}
          discovered ♡
        </motion.p>

        {/* Bonus reason button */}
        {bonusIndex < loveConfig.bonusReasons.length && (
          <motion.button
            className="px-6 py-2.5 rounded-full text-love-pink font-medium text-sm cursor-pointer
                       bg-white border-2 border-love-blush
                       hover:bg-love-pale hover:border-love-coral/40
                       transition-all duration-200 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBonusReason}
          >
            Give me another reason ✨
          </motion.button>
        )}

        {/* Sparkle decorations */}
        <div className="flex justify-center gap-3 mb-6" aria-hidden="true">
          <SparkleIcon size={8} color="#FFA0B8" />
          <HeartIcon size={12} color="#FF5C93" />
          <SparkleIcon size={8} color="#FFA0B8" />
        </div>

        {/* Continue button */}
        <motion.button
          id="reasons-continue-button"
          className="px-8 py-3 rounded-full text-white font-semibold
                     bg-gradient-to-r from-love-pink to-love-coral
                     hover:scale-105 active:scale-95
                     transition-transform duration-200 cursor-pointer
                     shadow-lg shadow-love-pink/20"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onClick={() => {
            setSelectedCard(null);
            onContinue();
          }}
        >
          There's more... ♡
        </motion.button>
      </div>

      {/* Reason detail modal */}
      <AnimatePresence>
        {selectedCard !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-love-blush/50 text-center"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-4xl block mb-4">
                {cardEmojis[selectedCard % cardEmojis.length]}
              </span>
              <h3
                className="text-xl font-bold text-love-pink mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {allReasons[selectedCard]?.short}
              </h3>
              <p
                className="text-love-plum/75 leading-relaxed text-sm"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {allReasons[selectedCard]?.full}
              </p>
              <button
                className="mt-6 px-6 py-2 rounded-full bg-love-blush text-love-pink font-medium text-sm hover:bg-love-pale transition-colors cursor-pointer"
                onClick={() => setSelectedCard(null)}
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
