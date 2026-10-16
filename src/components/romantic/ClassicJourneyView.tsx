import React, { useState, useCallback, useRef, useEffect } from "react";
import { WelcomeScreen } from "../WelcomeScreen";
import { LoveStory } from "../LoveStory";
import { LoveQuestion } from "../LoveQuestion";
import { ReasonsGrid } from "../ReasonsGrid";
import { LoveEnvelope } from "../LoveEnvelope";
import { MemoryGallery } from "../MemoryGallery";
import { CoupleQuiz } from "../CoupleQuiz";
import { SurpriseGift } from "../SurpriseGift";
import { FinalLetter } from "../FinalLetter";
import { ChapterProgress } from "../ChapterProgress";
import { HeartIcon } from "../Illustrations";
import { ArrowLeft } from "lucide-react";

import type { ClassicGalleryPhoto } from "../../types/romantic";

interface ClassicJourneyViewProps {
  onBackToHome?: () => void;
  nested?: boolean;
  onComplete?: () => void;
  customPhotos?: ClassicGalleryPhoto[];
  galleryHeading?: string;
  gallerySubtitle?: string;
  finalLetterMessage?: string;
  finalLetterQuote?: string;
  finalLetterImageUrl?: string;
  partnerName?: string;
  creatorName?: string;
}

export const ClassicJourneyView: React.FC<ClassicJourneyViewProps> = ({
  onBackToHome,
  nested = false,
  onComplete,
  customPhotos,
  galleryHeading,
  gallerySubtitle,
  finalLetterMessage,
  finalLetterQuote,
  finalLetterImageUrl,
  partnerName,
  creatorName,
}) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [secretFound, setSecretFound] = useState(false);
  const [secretMessage, setSecretMessage] = useState(false);

  // Refs for scrolling
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync active chapter on natural scrolling
  useEffect(() => {
    if (!hasEntered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute("data-chapter-index");
            if (indexStr) {
              const idx = parseInt(indexStr, 10);
              setCurrentChapter(idx);
            }
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hasEntered]);

  const scrollToChapter = useCallback((index: number) => {
    setCurrentChapter(index);
    setTimeout(() => {
      chapterRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

  const handleEnter = useCallback(() => {
    setHasEntered(true);
    setCurrentChapter(1);
  }, []);

  const handleReplay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setHasEntered(false);
      setCurrentChapter(0);
    }, 500);
  }, []);

  const handleSecretClick = useCallback(() => {
    if (!secretFound) {
      setSecretFound(true);
      setSecretMessage(true);
      setTimeout(() => setSecretMessage(false), 4000);
    }
  }, [secretFound]);

  return (
    <div className="relative">
      {/* Floating Exit Banner (Only when standalone, not nested) */}
      {!nested && onBackToHome && (
        <div className="fixed top-4 left-4 z-[99]">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-love-plum font-bold text-xs shadow-md border border-love-blush transition-all cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft size={14} />
            <span>Exit to Main Hub</span>
          </button>
        </div>
      )}

      {/* Welcome Screen */}
      {!hasEntered && <WelcomeScreen onEnter={handleEnter} />}

      {/* Main Content */}
      {hasEntered && (
        <>
          {/* Progress Indicator */}
          <ChapterProgress currentChapter={currentChapter} />

          {/* Chapter 1: Love Story */}
          <div
            ref={(el) => {
              chapterRefs.current[1] = el;
            }}
            data-chapter-index="1"
          >
            <LoveStory onContinue={() => scrollToChapter(2)} />
          </div>

          {/* Chapter 2: Do You Love Me */}
          <div
            ref={(el) => {
              chapterRefs.current[2] = el;
            }}
            data-chapter-index="2"
          >
            <LoveQuestion onContinue={() => scrollToChapter(3)} />
          </div>

          {/* Chapter 3: Reasons */}
          <div
            ref={(el) => {
              chapterRefs.current[3] = el;
            }}
            data-chapter-index="3"
            className="relative"
          >
            <ReasonsGrid onContinue={() => scrollToChapter(4)} />
            {/* SECRET HEART - hidden in reasons */}
            <button
              className="absolute bottom-8 right-8 opacity-20 hover:opacity-80 transition-opacity cursor-pointer z-20"
              onClick={handleSecretClick}
              aria-label="A hidden surprise"
            >
              <HeartIcon size={16} color="#FF5C93" />
            </button>
          </div>

          {/* Chapter 4: Love Letters */}
          <div
            ref={(el) => {
              chapterRefs.current[4] = el;
            }}
            data-chapter-index="4"
          >
            <LoveEnvelope onContinue={() => scrollToChapter(5)} />
          </div>

          {/* Chapter 5: Memory Gallery */}
          <div
            ref={(el) => {
              chapterRefs.current[5] = el;
            }}
            data-chapter-index="5"
          >
            <MemoryGallery
              onContinue={() => scrollToChapter(6)}
              customPhotos={customPhotos}
              galleryHeading={galleryHeading}
              gallerySubtitle={gallerySubtitle}
            />
          </div>

          {/* Chapter 6: Quiz */}
          <div
            ref={(el) => {
              chapterRefs.current[6] = el;
            }}
            data-chapter-index="6"
          >
            <CoupleQuiz onContinue={() => scrollToChapter(7)} />
          </div>

          {/* Chapter 7: Surprises */}
          <div
            ref={(el) => {
              chapterRefs.current[7] = el;
            }}
            data-chapter-index="7"
          >
            <SurpriseGift onContinue={() => scrollToChapter(8)} />
          </div>

          {/* Chapter 8: Final Letter */}
          <div
            ref={(el) => {
              chapterRefs.current[8] = el;
            }}
            data-chapter-index="8"
          >
            <FinalLetter
              onReplay={handleReplay}
              customLetterMessage={finalLetterMessage}
              customQuote={finalLetterQuote}
              customImageUrl={finalLetterImageUrl}
              partnerName={partnerName}
              creatorName={creatorName}
            />
            {nested && onComplete && (
              <div className="text-center py-8 pb-16 bg-gradient-to-b from-transparent to-love-pale/50">
                <button
                  type="button"
                  onClick={onComplete}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white font-bold text-sm shadow-lg shadow-love-pink/30 hover:scale-102 transition-all cursor-pointer btn-glow"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Continue Surprise Journey ♡
                </button>
              </div>
            )}
          </div>

          {/* Secret message toast */}
          {secretMessage && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-love-blush/50 text-center animate-[fadeInLine_0.5s_ease-out]">
                <p
                  className="text-sm text-love-pink font-medium"
                  style={{ fontFamily: "var(--font-handwritten)" }}
                >
                  Psst... one more thing. You're really, really special to me. 💗
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
