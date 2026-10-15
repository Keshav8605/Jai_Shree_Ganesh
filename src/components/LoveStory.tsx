import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { CoupleHolding, HeartIcon, SparkleIcon } from "./Illustrations";

interface LoveStoryProps {
  onContinue: () => void;
}

// Placeholder gradient images for when no src is provided
const placeholderGradients = [
  "linear-gradient(135deg, #FFA0B8 0%, #EBDDFB 100%)",
  "linear-gradient(135deg, #FFE4EC 0%, #FFA0B8 100%)",
  "linear-gradient(135deg, #EBDDFB 0%, #FFE4EC 100%)",
  "linear-gradient(135deg, #FFF9F4 0%, #FFA0B8 100%)",
];

const placeholderEmojis = ["🌸", "🌅", "🏖️", "🌿"];

interface PhotoModalProps {
  photo: (typeof loveConfig.storyPhotos)[0];
  index: number;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, index, onClose }) => (
  <motion.div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Photo */}
      <div
        className="w-full aspect-[4/3] rounded-lg mb-4 flex items-center justify-center"
        style={{
          background: photo.src
            ? `url(${photo.src}) center/cover`
            : placeholderGradients[index % 4],
        }}
      >
        {!photo.src && (
          <span className="text-5xl">{placeholderEmojis[index % 4]}</span>
        )}
      </div>
      {/* Caption */}
      <p
        className="text-lg font-semibold text-love-plum text-center mb-2"
        style={{ fontFamily: "var(--font-handwritten)" }}
      >
        {photo.caption}
      </p>
      {/* Note */}
      <p
        className="text-sm text-love-plum/70 text-center italic"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {photo.note}
      </p>
      {/* Close */}
      <button
        className="mt-4 w-full py-2 rounded-full bg-love-blush text-love-pink font-medium text-sm hover:bg-love-pale transition-colors cursor-pointer"
        onClick={onClose}
      >
        Close ♡
      </button>
    </motion.div>
  </motion.div>
);

export const LoveStory: React.FC<LoveStoryProps> = ({ onContinue }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [timeTogether, setTimeTogether] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!loveConfig.relationshipDate) return;

    const calcTime = () => {
      const start = new Date(loveConfig.relationshipDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const positions = [
    { top: "5%", left: "3%", rotation: -8 },
    { top: "2%", right: "3%", rotation: 5 },
    { bottom: "18%", left: "2%", rotation: -4 },
    { bottom: "15%", right: "2%", rotation: 6 },
  ];

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFF2F6 0%, #FFE4EC 30%, #EBDDFB 60%, #FFF2F6 100%)",
      }}
    >
      {/* Decorative sparkles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${15 + i * 15}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          >
            <SparkleIcon size={10} color="#FFA0B8" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Characters */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <CoupleHolding size={240} />
        </motion.div>

        {/* Chapter label */}
        <motion.p
          className="text-xs tracking-[0.2em] text-love-pink/70 mb-3"
          style={{ fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {loveConfig.storyChapterLabel}
        </motion.p>

        {/* Main heading */}
        <motion.h2
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span
            className="text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            YOU{" "}
          </span>
          <span
            className="text-love-pink"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            &
          </span>
          <span
            className="text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {" "}
            ME
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base text-love-plum/65 max-w-md mx-auto mb-6"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {loveConfig.storySubtitle}
        </motion.p>

        {/* Live Relationship Counter */}
        {timeTogether && (
          <motion.div
            className="inline-flex items-center gap-2.5 sm:gap-3 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-love-blush shadow-md shadow-love-pink/5 mb-10 max-w-full flex-wrap justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <HeartIcon size={14} color="#FF5C93" />
            <span
              className="text-xs sm:text-sm font-medium text-love-plum tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Loving you for{" "}
              <span className="text-love-pink font-bold">{timeTogether.days}</span> days •{" "}
              <span className="text-love-pink font-bold">{timeTogether.hours}</span>h{" "}
              <span className="text-love-pink font-bold">{timeTogether.minutes}</span>m{" "}
              <span className="text-love-pink font-bold">{timeTogether.seconds}</span>s ♡
            </span>
            <HeartIcon size={14} color="#FFA0B8" />
          </motion.div>
        )}

        {/* Polaroid grid - responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 max-w-3xl mx-auto">
          {loveConfig.storyPhotos.map((photo, i) => (
            <motion.div
              key={i}
              className="polaroid rounded-sm cursor-pointer mx-auto"
              style={{
                transform: `rotate(${photo.rotation}deg)`,
                maxWidth: "200px",
              }}
              initial={{ opacity: 0, y: 40, rotate: photo.rotation * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
              whileHover={{
                rotate: 0,
                scale: 1.05,
                y: -4,
                transition: { duration: 0.3 },
              }}
              onClick={() => setSelectedPhoto(i)}
            >
              {/* Photo area */}
              <div
                className="w-full aspect-square rounded-sm flex items-center justify-center"
                style={{
                  background: photo.src
                    ? `url(${photo.src}) center/cover`
                    : placeholderGradients[i % 4],
                }}
              >
                {!photo.src && (
                  <span className="text-4xl">
                    {placeholderEmojis[i % 4]}
                  </span>
                )}
              </div>
              {/* Caption */}
              <p
                className="text-center text-sm text-love-plum/80 mt-2 pb-1"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                {photo.caption}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop positioned polaroids (hidden on mobile) */}
        <div className="hidden xl:block">
          {loveConfig.storyPhotos.map((photo, i) => {
            const pos = positions[i];
            return (
              <motion.div
                key={`desktop-${i}`}
                className="absolute polaroid rounded-sm cursor-pointer w-36"
                style={{
                  ...pos,
                  transform: `rotate(${photo.rotation}deg)`,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.08, y: -6 }}
                onClick={() => setSelectedPhoto(i)}
              >
                <div
                  className="w-full aspect-square rounded-sm flex items-center justify-center"
                  style={{
                    background: photo.src
                      ? `url(${photo.src}) center/cover`
                      : placeholderGradients[i % 4],
                  }}
                >
                  {!photo.src && (
                    <span className="text-3xl">
                      {placeholderEmojis[i % 4]}
                    </span>
                  )}
                </div>
                <p
                  className="text-center text-xs text-love-plum/70 mt-1 pb-1"
                  style={{ fontFamily: "var(--font-handwritten)" }}
                >
                  {photo.caption}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* End note */}
        <motion.p
          className="text-love-plum/60 text-sm italic mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {loveConfig.storyEndNote}
        </motion.p>

        {/* Continue button */}
        <motion.button
          id="story-continue-button"
          className="px-8 py-3 rounded-full text-white font-semibold
                     bg-gradient-to-r from-love-pink to-love-coral
                     hover:scale-105 active:scale-95
                     transition-transform duration-200 cursor-pointer
                     shadow-lg shadow-love-pink/20"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          onClick={onContinue}
        >
          Let's continue ♡
        </motion.button>

        {/* Small decorative hearts */}
        <div className="flex justify-center gap-2 mt-4" aria-hidden="true">
          {[...Array(3)].map((_, i) => (
            <HeartIcon key={i} size={10} color="#FFA0B8" />
          ))}
        </div>
      </div>

      {/* Photo modal */}
      {selectedPhoto !== null && (
        <PhotoModal
          photo={loveConfig.storyPhotos[selectedPhoto]}
          index={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </section>
  );
};
