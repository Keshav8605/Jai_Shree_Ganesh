import React, { useState, useCallback, useRef, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LoveStory } from "./components/LoveStory";
import { LoveQuestion } from "./components/LoveQuestion";
import { ReasonsGrid } from "./components/ReasonsGrid";
import { LoveEnvelope } from "./components/LoveEnvelope";
import { MemoryGallery } from "./components/MemoryGallery";
import { CoupleQuiz } from "./components/CoupleQuiz";
import { SurpriseGift } from "./components/SurpriseGift";
import { FinalLetter } from "./components/FinalLetter";
import { FloatingHearts } from "./components/FloatingHearts";
import { ChapterProgress } from "./components/ChapterProgress";
import { CursorTrail } from "./components/CursorTrail";
import { MusicPlayer } from "./components/MusicPlayer";
import { loveConfig } from "./data/loveConfig";
import { HeartIcon } from "./components/Illustrations";

const App: React.FC = () => {
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
    // Smooth scroll to the chapter
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
      {/* Welcome Screen */}
      {!hasEntered && <WelcomeScreen onEnter={handleEnter} />}

      {/* Main Content */}
      {hasEntered && (
        <>
          {/* Floating Hearts (ambient background) */}
          <FloatingHearts count={10} />

          {/* Cursor Trail */}
          {loveConfig.enableCursorTrail && <CursorTrail />}

          {/* Progress */}
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
            {/* SECRET HEART - hidden in the reasons section */}
            <button
              className="absolute bottom-8 right-8 opacity-20 hover:opacity-80 transition-opacity cursor-pointer z-20"
              onClick={handleSecretClick}
              aria-label="A hidden surprise"
              title=""
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
            <MemoryGallery onContinue={() => scrollToChapter(6)} />
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
            <FinalLetter onReplay={handleReplay} />
          </div>

          {/* Romantic Music Player */}
          <MusicPlayer autoStartTrigger={hasEntered} />

          {/* Footer */}
          <footer className="bg-love-pale py-8 text-center">
            <p
              className="text-xs text-love-plum/30"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Made with 💗 • Our Little Universe ♡
            </p>
          </footer>

          {/* Secret message toast */}
          {secretMessage && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-love-blush/50 text-center animate-[fadeInLine_0.5s_ease-out]">
                <p
                  className="text-sm text-love-pink font-medium"
                  style={{ fontFamily: "var(--font-handwritten)" }}
                >
                  Psst... one more thing. You're really, really special to me.
                  💗
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
