import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { HeartIcon, FlowerIcon, SparkleIcon } from "./Illustrations";

import type { ClassicGalleryPhoto } from "../types/romantic";

interface MemoryGalleryProps {
  onContinue: () => void;
  customPhotos?: ClassicGalleryPhoto[];
  galleryHeading?: string;
  gallerySubtitle?: string;
}

const placeholderGradients = [
  "linear-gradient(135deg, #FFE4EC 0%, #EBDDFB 100%)",
  "linear-gradient(135deg, #FFA0B8 0%, #FFE4EC 100%)",
  "linear-gradient(135deg, #EBDDFB 0%, #FFF9F4 100%)",
  "linear-gradient(135deg, #FFF9F4 0%, #FFE4EC 100%)",
  "linear-gradient(135deg, #FFA0B8 0%, #EBDDFB 100%)",
  "linear-gradient(135deg, #FFE4EC 0%, #FFA0B8 100%)",
];

const placeholderEmojis = ["📸", "🌸", "🌅", "🏖️", "☕", "🌿"];

interface LightboxProps {
  photos: { src?: string; caption: string; note?: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const photo = photos[currentIndex];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-lg w-full"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Polaroid frame */}
        <div className="bg-white rounded-lg p-3 pb-14 shadow-2xl">
          <div
            className="w-full aspect-[4/3] rounded-sm flex items-center justify-center"
            style={{
              background: photo.src
                ? `url(${photo.src}) center/cover`
                : placeholderGradients[currentIndex % 6],
            }}
          >
            {!photo.src && (
              <span className="text-6xl">
                {placeholderEmojis[currentIndex % 6]}
              </span>
            )}
          </div>
          <p
            className="absolute bottom-4 left-0 right-0 text-center text-love-plum/80 text-base"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            {photo.caption}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 rounded-full bg-white/90 text-love-plum text-sm font-medium
                       hover:bg-love-blush transition-colors cursor-pointer disabled:opacity-30"
            onClick={onPrev}
            disabled={currentIndex === 0}
            aria-label="Previous photo"
          >
            ← Previous
          </button>
          <span className="text-white/70 text-xs self-center">
            {currentIndex + 1} / {photos.length}
          </span>
          <button
            className="px-4 py-2 rounded-full bg-white/90 text-love-plum text-sm font-medium
                       hover:bg-love-blush transition-colors cursor-pointer disabled:opacity-30"
            onClick={onNext}
            disabled={currentIndex === photos.length - 1}
            aria-label="Next photo"
          >
            Next →
          </button>
        </div>

        {/* Close */}
        <button
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center
                     text-love-plum hover:bg-love-blush transition-colors cursor-pointer text-lg"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
};

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  onContinue,
  customPhotos,
  galleryHeading,
  gallerySubtitle,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos =
    customPhotos && customPhotos.length > 0
      ? customPhotos.map((p, idx) => ({
          src: p.src || "",
          caption: p.caption,
          note: p.note,
          rotation: p.rotation ?? (idx % 2 === 0 ? -2 : 3),
        }))
      : loveConfig.galleryPhotos;

  const heading = galleryHeading || loveConfig.galleryHeading;
  const subtitle = gallerySubtitle !== undefined ? gallerySubtitle : loveConfig.gallerySubtitle;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev !== null && prev > 0 ? prev - 1 : prev
      ),
    []
  );
  const nextPhoto = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev !== null && prev < photos.length - 1
          ? prev + 1
          : prev
      ),
    [photos.length]
  );

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FFE4EC 0%, #FFF2F6 40%, #EBDDFB 80%, #FFF2F6 100%)",
      }}
    >
      {/* Decorative doodles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-16 right-8 opacity-15">
          <FlowerIcon size={50} />
        </div>
        <div className="absolute bottom-24 left-6 opacity-15">
          <FlowerIcon size={40} />
        </div>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 18}%`,
            }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1, 0.5] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.2,
            }}
          >
            <SparkleIcon size={8} color="#FFA0B8" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-love-plum mb-3"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {heading}
        </motion.h2>

        {subtitle && (
          <motion.p
            className="text-sm text-love-plum/60 mb-10"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Photo grid - asymmetric */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className="polaroid rounded-sm cursor-pointer"
              style={{
                transform: `rotate(${photo.rotation}deg)`,
              }}
              initial={{ opacity: 0, y: 40, rotate: photo.rotation * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{
                rotate: 0,
                scale: 1.04,
                y: -6,
                transition: { duration: 0.3 },
              }}
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(i);
                }
              }}
              aria-label={`Photo: ${photo.caption}. Click to enlarge.`}
            >
              {/* Photo area */}
              <div
                className="w-full aspect-square rounded-sm flex items-center justify-center"
                style={{
                  background: photo.src
                    ? `url(${photo.src}) center/cover`
                    : placeholderGradients[i % 6],
                }}
              >
                {!photo.src && (
                  <span className="text-4xl sm:text-5xl">
                    {placeholderEmojis[i % 6]}
                  </span>
                )}
              </div>
              {/* Caption */}
              <p
                className="text-center text-xs sm:text-sm text-love-plum/70 mt-2 pb-1"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                {photo.caption}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Decorative hearts */}
        <div className="flex justify-center gap-2 mb-6" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <HeartIcon
              key={i}
              size={8 + i * 2}
              color={i % 2 === 0 ? "#FF5C93" : "#FFA0B8"}
            />
          ))}
        </div>

        {/* Continue button */}
        <motion.button
          id="gallery-continue-button"
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
          Almost there... ♡
        </motion.button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
