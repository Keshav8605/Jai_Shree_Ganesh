import React, { useState } from "react";
import type { DeluluStoryPayload, DeluluChapter, DeluluChoice } from "../../types/romantic";
import {
  BookOpen,
  ArrowRight,
  RefreshCw,
  FolderHeart,
} from "lucide-react";

interface DeluluStoryPlayerProps {
  payload: DeluluStoryPayload;
  onSaveToLore?: () => void;
  onReply?: () => void;
  onComplete?: () => void;
  isRecipientMode?: boolean;
}

export const DeluluStoryPlayer: React.FC<DeluluStoryPlayerProps> = ({
  payload,
  onSaveToLore,
  onReply: _onReply,
  onComplete,
  isRecipientMode: _isRecipientMode = false,
}) => {
  const [currentChapterId, setCurrentChapterId] = useState(
    payload.initialChapterId || "ch1"
  );
  const [history, setHistory] = useState<string[]>([payload.initialChapterId || "ch1"]);
  const [selectedVibeReaction, setSelectedVibeReaction] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const currentChapter: DeluluChapter =
    payload.chapters[currentChapterId] ||
    Object.values(payload.chapters)[0] || {
      id: "ch1",
      chapterNumber: 1,
      title: "The Beginning",
      sceneText: "Our alternate universe awaits...",
      isEnding: true,
    };

  const handleChoose = (choice: DeluluChoice) => {
    if (choice.vibeReaction) {
      setSelectedVibeReaction(choice.vibeReaction);
      setTimeout(() => setSelectedVibeReaction(null), 2500);
    }
    setCurrentChapterId(choice.nextChapterId);
    setHistory((prev) => [...prev, choice.nextChapterId]);
  };

  const handleRestart = () => {
    setCurrentChapterId(payload.initialChapterId || "ch1");
    setHistory([payload.initialChapterId || "ch1"]);
  };

  const handleSaveLoreClick = () => {
    setSavedNotice(true);
    if (onSaveToLore) onSaveToLore();
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Phone Screen Mockup Frame */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-love-blush shadow-2xl bg-white text-love-plum">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-love-pale via-white to-love-pale px-5 py-4 border-b border-love-blush flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-love-blush text-love-deep">
              <BookOpen size={14} />
            </span>
            <div>
              <h3
                className="text-xs font-bold text-love-plum tracking-wide uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Delulu Mode • {payload.tropeTitle}
              </h3>
              <p className="text-[10px] text-love-plum/60">
                Starring {payload.partnerB} & {payload.partnerA}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-love-blush text-love-deep px-2.5 py-0.5 rounded-full">
            {currentChapter.isEnding ? "Ending" : `Scene ${currentChapter.chapterNumber || history.length}`}
          </span>
        </div>

        {/* Anime Chapter Visual */}
        <div className="relative aspect-[16/10] overflow-hidden bg-love-pale">
          <img
            src={
              currentChapter.imageUrl ||
              (currentChapter.isEnding
                ? "/assets/images/hero_couple_sunset.jpg"
                : "/assets/images/delulu_story_anime.jpg")
            }
            alt="Delulu Alternate Universe Scene"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              {currentChapter.title}
            </span>
            {payload.tone && (
              <span className="bg-love-pink/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                {payload.tone} Vibe
              </span>
            )}
          </div>
        </div>

        {/* Story Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Reaction toast */}
          {selectedVibeReaction && (
            <div className="bg-love-blush border border-love-pink/40 rounded-xl px-3 py-1.5 text-center animate-[fadeInLine_0.3s_ease-out]">
              <span className="text-xs font-bold text-love-deep">
                {selectedVibeReaction}
              </span>
            </div>
          )}

          {/* Chapter Text */}
          <div className="bg-love-pale/40 rounded-2xl p-4 border border-love-blush/60">
            <p
              className="text-sm sm:text-base text-love-plum/90 leading-relaxed font-medium"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {currentChapter.sceneText}
            </p>
          </div>

          {/* Branching Choices (if not ending) */}
          {!currentChapter.isEnding && currentChapter.choices && (
            <div className="space-y-2 pt-2">
              <p
                className="text-xs font-bold text-love-plum uppercase tracking-wider text-center mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What do you do next?
              </p>
              {currentChapter.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoose(choice)}
                  className="w-full text-left p-3.5 rounded-2xl border border-love-blush bg-white hover:bg-love-pale hover:border-love-pink transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-between group"
                >
                  <span className="text-xs sm:text-sm font-semibold text-love-plum group-hover:text-love-deep">
                    {choice.label}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-love-coral group-hover:translate-x-1 group-hover:text-love-deep transition-all"
                  />
                </button>
              ))}
            </div>
          )}

          {/* ENDING SCREEN & REAL WORLD CLIMAX TRANSITION */}
          {currentChapter.isEnding && (
            <div className="space-y-4 pt-2 animate-[fadeInLine_0.5s_ease-out]">
              <div className="text-center">
                <span className="text-2xl">✨</span>
                <h4
                  className="text-base font-bold text-love-deep"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {currentChapter.endingTitle || "The End of this Chapter"}
                </h4>
              </div>

              {/* The Real Message Reveal Envelope (Required by Prompt) */}
              <div className="relative rounded-2xl bg-gradient-to-br from-love-blush via-white to-love-pale p-5 border border-love-pink/40 shadow-sm text-center space-y-2">
                <span className="text-xs font-bold text-love-pink tracking-wider uppercase block">
                  Back to Reality ♡
                </span>
                <p
                  className="text-sm sm:text-base text-love-plum font-bold leading-relaxed"
                  style={{ fontFamily: "var(--font-handwritten)", fontSize: "20px" }}
                >
                  "{payload.realWorldClosingNote ||
                    `Okay, our delulu universe ends here. But in this universe, I'm still choosing you. 💗`}"
                </p>
                <p className="text-[11px] text-love-plum/60 pt-1">
                  — Always yours, {payload.partnerA}
                </p>
              </div>

              {/* Actions */}
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs sm:text-sm font-bold shadow-md shadow-love-pink/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer btn-glow"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span>Continue Surprise Journey ♡</span>
                  <ArrowRight size={15} />
                </button>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-2.5 rounded-xl border border-love-blush text-love-plum text-xs font-bold hover:bg-love-pale transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <RefreshCw size={13} />
                  <span>Try Other Choices</span>
                </button>

                <button
                  onClick={handleSaveLoreClick}
                  className="flex-1 py-2.5 rounded-xl bg-love-pale text-love-deep hover:bg-love-blush text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <FolderHeart size={13} />
                  <span>{savedNotice ? "Saved to Lore! ♡" : "Save Story"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
