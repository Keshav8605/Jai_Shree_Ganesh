import React, { useState } from "react";
import type { Surprise } from "../../types/romantic";
import { OpeningChapter } from "./OpeningChapter";
import { HabitCardPlayer } from "./HabitCardPlayer";
import { SecretCodeUnlock } from "./SecretCodeUnlock";
import { DeluluStoryPlayer } from "./DeluluStoryPlayer";
import { OpenWhenCollection } from "./OpenWhenCollection";
import { LoveLoopComposer } from "./LoveLoopComposer";
import { ClassicJourneyView } from "./ClassicJourneyView";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Share2,
  Check,
  Eye,
  BookOpen,
} from "lucide-react";

interface SurprisePlayerProps {
  surprise: Surprise;
  isPreview?: boolean;
  onExitPreview?: () => void;
  onFinish?: () => void;
}

// Chapter titles with icons instead of emojis
const CHAPTER_TITLES: Record<string, { label: string; icon: typeof Heart }> = {
  welcome: { label: "Our Little World", icon: Heart },
  habit_cards: { label: "I Noticed This About You", icon: Sparkles },
  secret_code: { label: "Only You Know This", icon: Eye },
  delulu_story: { label: "Delulu Mode", icon: Sparkles },
  our_lore: { label: "Our Little Lore", icon: Heart },
  open_when: { label: "Open When…", icon: Heart },
  love_loop: { label: "Your Turn, My Love", icon: Heart },
  "classic-journey": { label: "Classic Journey", icon: BookOpen },
  classic_journey: { label: "Classic Journey", icon: BookOpen },
};

export const SurprisePlayer: React.FC<SurprisePlayerProps> = ({
  surprise,
  isPreview = false,
  onExitPreview,
  onFinish,
}) => {
  // Build active chapter list from enabled chapters in exact configured order
  const activeChapters = (surprise.chapterOrder || []).filter(
    (ch) =>
      surprise.enabledChapters[ch] !== false &&
      ch !== ("final_reveal" as any) &&
      ch !== ("chapter-8" as any)
  );
  const totalChapters = activeChapters.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentChapterId = activeChapters[currentIndex] || "welcome";
  const progressPercent = totalChapters > 0
    ? Math.round(((currentIndex + 1) / totalChapters) * 100)
    : 0;

  const chapterMeta = CHAPTER_TITLES[currentChapterId] || { label: "Your Surprise", icon: Heart };
  const ChapterIcon = chapterMeta.icon;

  const handleNext = () => {
    if (currentIndex < totalChapters - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onFinish) {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-love-pale via-white to-love-pale text-love-plum relative flex flex-col justify-between selection:bg-love-blush">
      {/* Top Banner: Preview mode indicator */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-love-blush/50 transition-all">
        {isPreview ? (
          <div className="bg-gradient-to-r from-love-plum to-love-deep text-white px-4 py-2 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <Eye size={14} className="text-love-coral" />
              <span>
                Preview Mode — Viewing as {surprise.recipientName || "Recipient"}
              </span>
            </div>
            {onExitPreview && (
              <button
                onClick={onExitPreview}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-colors cursor-pointer"
              >
                Exit Preview
              </button>
            )}
          </div>
        ) : null}

        {/* Chapter Navigation Bar */}
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Chapter indicator */}
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-love-pale text-love-deep font-bold text-xs flex items-center justify-center border border-love-blush">
              <ChapterIcon size={14} />
            </span>
            <div>
              <p
                className="text-xs font-bold text-love-plum leading-tight truncate max-w-[200px] sm:max-w-xs"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {chapterMeta.label}
              </p>
              <p className="text-[10px] text-love-plum/50">
                Chapter {currentIndex + 1} of {totalChapters}
              </p>
            </div>
          </div>

          {/* Share button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="text-xs text-love-deep hover:text-love-pink font-semibold flex items-center gap-1 px-3 py-1 rounded-full bg-love-pale/60 hover:bg-love-blush transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Save Link"}</span>
            </button>
          </div>
        </div>

        {/* Progress track */}
        <div className="w-full bg-love-blush/30 h-0.5">
          <div
            className="bg-gradient-to-r from-love-pink to-love-deep h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Chapter Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10">
        {/* CHAPTER 1: THE OPENING — Original Base Experience */}
        {currentChapterId === "welcome" && (
          <div className="animate-[fadeInLine_0.4s_ease-out]">
            <OpeningChapter
              config={surprise.openingChapter || {
                greeting: `Hey ${surprise.recipientName}, my favorite person...`,
                subtitle: `I made a little something just for you.`,
                ctaLabel: "Open Your Surprise ♡",
                tinyNote: "Psst... this is only for you.",
              }}
              recipientName={surprise.recipientName}
              senderName={surprise.senderName}
              onContinue={handleNext}
            />
          </div>
        )}

        {/* CHAPTER: I NOTICED THIS ABOUT YOU — Habit Cards */}
        {currentChapterId === "habit_cards" && (
          <div className="animate-[fadeInLine_0.4s_ease-out]">
            <HabitCardPlayer
              cards={surprise.habitCards}
              partnerName={surprise.recipientName}
              creatorName={surprise.senderName}
              isRecipientMode={true}
              onFinish={handleNext}
            />
          </div>
        )}

        {/* CHAPTER: ONLY YOU KNOW THIS — Secret Code */}
        {currentChapterId === "secret_code" && (
          <div className="animate-[fadeInLine_0.4s_ease-out]">
            <SecretCodeUnlock
              payload={{
                code: surprise.secretUnlock.code,
                clue: surprise.secretUnlock.clue,
                hint: surprise.secretUnlock.hint || "",
                attemptsAllowed: surprise.secretUnlock.maxAttempts,
                wrongBanter: surprise.secretUnlock.wrongBanter,
                rewardType: "letter",
                rewardTitle: surprise.secretUnlock.rewardTitle,
                unlockedSubtitle: surprise.secretUnlock.unlockedSubtitle,
                rewardMessage: surprise.secretUnlock.rewardMessage,
                rewardImageUrl: surprise.secretUnlock.rewardImageUrl,
                closingLine: surprise.secretUnlock.closingLine,
                decorativeCaption: surprise.secretUnlock.decorativeCaption,
              }}
              partnerName={surprise.recipientName}
              creatorName={surprise.senderName}
              isRecipientMode={true}
            />
          </div>
        )}

        {/* CHAPTER: DELULU MODE — Our Alternate Universe */}
        {currentChapterId === "delulu_story" && (
          <div className="animate-[fadeInLine_0.4s_ease-out]">
            <DeluluStoryPlayer
              payload={{
                ...surprise.deluluStory,
                partnerA: surprise.senderName,
                partnerB: surprise.recipientName,
              }}
              onComplete={handleNext}
              isRecipientMode={true}
            />
          </div>
        )}

        {/* CHAPTER: OUR LITTLE LORE — Memories & Inside Jokes */}
        {currentChapterId === "our_lore" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-[fadeInLine_0.4s_ease-out]">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Our Little Lore
              </span>
              <h2
                className="text-xl sm:text-2xl font-bold text-love-plum"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Memories & Inside Jokes
              </h2>
              <p className="text-xs text-love-plum/60">
                Curated with love by {surprise.senderName}
              </p>
            </div>

            {surprise.littleLore.length === 0 ? (
              <div className="text-center py-12 text-love-plum/50 text-sm">
                No memories added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {surprise.littleLore.map((mem) => (
                  <div
                    key={mem.id}
                    className="bg-white rounded-2xl p-5 border border-love-blush/60 shadow-sm hover:shadow-md transition-shadow space-y-3"
                  >
                    {mem.imageUrl && (
                      <div className="rounded-xl overflow-hidden aspect-[16/10] border border-love-blush/40">
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-love-coral">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} />
                        {mem.date}
                      </span>
                      <span className="text-[10px] font-bold bg-love-pale text-love-deep px-2 py-0.5 rounded-full">
                        {mem.category}
                      </span>
                    </div>
                    <h3
                      className="text-base font-bold text-love-plum"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {mem.title}
                    </h3>
                    <p className="text-xs text-love-plum/80 leading-relaxed">
                      {mem.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHAPTER: OPEN WHEN… LETTERS */}
        {currentChapterId === "open_when" && (
          <div className="animate-[fadeInLine_0.4s_ease-out]">
            <OpenWhenCollection
              letters={surprise.openWhenLetters}
              partnerName={surprise.recipientName}
              creatorName={surprise.senderName}
              isRecipientMode={true}
            />
          </div>
        )}

        {/* CHAPTER: LOVE LOOP — Recipient Reply */}
        {currentChapterId === "love_loop" && (
          <div className="animate-[fadeInLine_0.4s_ease-out]">
            <LoveLoopComposer
              momentId={surprise.id}
              partnerName={surprise.recipientName}
              creatorName={surprise.senderName}
              promptQuestion={surprise.loveLoop.promptQuestion}
              questions={surprise.loveLoop.questions}
            />
          </div>
        )}

        {/* CHAPTER: CLASSIC JOURNEY (NESTED CHAPTER) */}
        {(currentChapterId === "classic-journey" || currentChapterId === "classic_journey") && (
          <div className="animate-[fadeInLine_0.4s_ease-out]">
            <ClassicJourneyView
              nested={true}
              onBackToHome={handleNext}
              onComplete={handleNext}
              customPhotos={surprise.classicJourney?.galleryPhotos}
              galleryHeading={surprise.classicJourney?.galleryHeading}
              gallerySubtitle={surprise.classicJourney?.gallerySubtitle}
              finalLetterMessage={
                surprise.classicJourney?.finalLetterMessage || surprise.finalReveal?.message
              }
              finalLetterQuote={
                surprise.classicJourney?.finalLetterQuote || surprise.finalReveal?.quote
              }
              finalLetterImageUrl={
                surprise.classicJourney?.finalLetterImageUrl || surprise.finalReveal?.imageUrl
              }
              partnerName={surprise.recipientName}
              creatorName={surprise.senderName}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-love-blush/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentIndex === 0
                ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-love-pale text-love-deep hover:bg-love-blush"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span className="text-xs font-semibold text-love-plum/50">
            {currentIndex + 1} / {totalChapters}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold shadow-md shadow-love-pink/20 hover:shadow-lg hover:scale-102 transition-all cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>
              {currentIndex === totalChapters - 1
                ? "Finish Story ♡"
                : "Continue"}
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
};
