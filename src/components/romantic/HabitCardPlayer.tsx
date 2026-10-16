import React, { useState } from "react";
import type { HabitCard } from "../../types/romantic";
import { ArtworkRenderer } from "./ArtworkRenderer";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface HabitCardPlayerProps {
  cards: HabitCard[];
  partnerName?: string;
  creatorName?: string;
  onReact?: (cardId: string, reaction: string) => void;
  onFinish?: () => void;
  isRecipientMode?: boolean;
}

export const HabitCardPlayer: React.FC<HabitCardPlayerProps> = ({
  cards,
  partnerName = "My Love",
  creatorName: _creatorName = "Someone who loves you",
  onReact,
  onFinish,
  isRecipientMode: _isRecipientMode = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [customReply, setCustomReply] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [repliedNotice, setRepliedNotice] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl p-6 border border-love-blush">
        <p className="text-love-plum/70">No habit cards available.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelectReaction = (emoji: string) => {
    setReactions((prev) => ({ ...prev, [currentCard.id]: emoji }));
    if (onReact) {
      onReact(currentCard.id, emoji);
    }
  };

  const handleSendCustomReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReply.trim()) return;
    setRepliedNotice(true);
    setTimeout(() => {
      setRepliedNotice(false);
      setShowReplyInput(false);
      setCustomReply("");
    }, 2000);
  };

  // Tone styling
  const toneBadge = {
    cute: { bg: "bg-pink-100", text: "text-pink-700", label: "Cute" },
    funny: { bg: "bg-amber-100", text: "text-amber-800", label: "Teasing & Funny" },
    soft: { bg: "bg-purple-100", text: "text-purple-700", label: "Soft & Emotional" },
    dramatic: { bg: "bg-rose-100", text: "text-rose-800", label: "Dramatic" },
  }[currentCard.tone] || { bg: "bg-love-blush", text: "text-love-deep", label: "Cute" };

  return (
    <div className="max-w-md mx-auto">
      {/* Top Bar with Counter */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold text-love-deep uppercase tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            I Noticed This About You
          </span>
          <Heart size={14} className="fill-love-pink text-love-pink animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-love-blush shadow-2xs">
          <span className="text-xs font-bold text-love-plum">
            {currentIndex + 1}
          </span>
          <span className="text-xs text-love-plum/40">/</span>
          <span className="text-xs font-medium text-love-plum/60">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-love-blush/60 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-love-pink to-love-deep h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Habit Card */}
      <div
        className="relative bg-white rounded-3xl p-5 sm:p-6 border border-love-blush shadow-xl shadow-love-plum/5 overflow-hidden transition-all duration-300"
        key={currentCard.id}
      >
        {/* Soft background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-love-blush/50 rounded-full blur-2xl pointer-events-none" />

        {/* Category & Tone pills */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-love-deep bg-love-pale px-3 py-1 rounded-full border border-love-blush">
            {currentCard.category}
          </span>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${toneBadge.bg} ${toneBadge.text}`}
          >
            {toneBadge.label}
          </span>
        </div>

        {/* Dynamic Artwork Frame (no hardcoded repeated image!) */}
        <div className="mb-4">
          <ArtworkRenderer
            artworkKey={currentCard.imageUrl}
            fallbackIndex={currentIndex}
            alt={currentCard.shortTitle}
            className="w-full aspect-[4/3]"
            badgeText={`For ${partnerName} ♡`}
          />
        </div>

        {/* Card Title & Content */}
        <div className="space-y-3 mb-5">
          {currentCard.shortTitle?.trim() && (
            <h4
              className="text-lg sm:text-xl font-bold text-love-plum"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {currentCard.shortTitle}
            </h4>
          )}

          {/* What they do (freeform field) */}
          {currentCard.whatYouDo?.trim() && (
            <div className="p-3 bg-love-pale/40 rounded-xl border border-love-blush/50 text-xs">
              <span className="font-bold text-love-deep block mb-0.5">What you do:</span>
              <p className="text-love-plum/85 leading-relaxed">{currentCard.whatYouDo}</p>
            </div>
          )}

          {/* Main Habit Observation Text */}
          {currentCard.habitText?.trim() && (
            <p
              className="text-sm sm:text-base text-love-plum/90 leading-relaxed font-medium"
              style={{ fontFamily: "var(--font-body)" }}
            >
              "{currentCard.habitText}"
            </p>
          )}

          {/* Why I love it (freeform field) */}
          {currentCard.whyILoveIt?.trim() && (
            <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-100 text-xs">
              <span className="font-bold text-pink-700 block mb-0.5 flex items-center gap-1">
                <Sparkles size={12} />
                <span>Why it melts my heart:</span>
              </span>
              <p className="text-love-plum/85 leading-relaxed">{currentCard.whyILoveIt}</p>
            </div>
          )}

          {/* Personal message note */}
          {currentCard.myMessage?.trim() && (
            <p className="text-xs text-love-plum/75 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/70">
              💌 "{currentCard.myMessage}"
            </p>
          )}

          {/* Reaction Note */}
          {currentCard.reactionNote?.trim() && (
            <p
              className="text-xs text-love-coral font-bold italic pt-1"
              style={{ fontFamily: "var(--font-handwritten)", fontSize: "16px" }}
            >
              — {currentCard.reactionNote}
            </p>
          )}
        </div>

        {/* Partner Reaction Selector */}
        <div className="border-t border-love-blush/60 pt-3 mb-4">
          <p className="text-[11px] font-semibold text-love-plum/60 mb-2 text-center">
            How does this make you feel?
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {[
              { emoji: "🙈", label: "You caught me!" },
              { emoji: "🥺", label: "Melts my heart" },
              { emoji: "😭", label: "Stop looking!" },
              { emoji: "💗", label: "Love this" },
              { emoji: "😌", label: "Always" },
            ].map((btn) => {
              const isSelected = reactions[currentCard.id] === btn.emoji;
              return (
                <button
                  key={btn.emoji}
                  onClick={() => handleSelectReaction(btn.emoji)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-love-pink text-white scale-105 shadow-xs"
                      : "bg-love-pale hover:bg-love-blush text-love-plum/80"
                  }`}
                  title={btn.label}
                >
                  <span className="text-sm">{btn.emoji}</span>
                  {isSelected && <span className="text-[10px] font-bold">Selected</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Custom Reply Accordion */}
        {showReplyInput ? (
          <form onSubmit={handleSendCustomReply} className="mb-4 space-y-2">
            <input
              type="text"
              value={customReply}
              onChange={(e) => setCustomReply(e.target.value)}
              placeholder="Write a sweet reply to this card..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-pink/40 bg-love-pale/30 focus:outline-love-pink text-love-plum"
              maxLength={200}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReplyInput(false)}
                className="text-[11px] px-3 py-1 text-love-plum/60 hover:text-love-plum cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-[11px] px-3.5 py-1 rounded-lg bg-love-pink text-white font-bold cursor-pointer"
              >
                Send Reply
              </button>
            </div>
            {repliedNotice && (
              <p className="text-[11px] text-green-600 font-semibold text-center">
                Reply saved! Your partner will see this ♡
              </p>
            )}
          </form>
        ) : (
          <div className="text-center mb-3">
            <button
              onClick={() => setShowReplyInput(true)}
              className="text-[11px] text-love-deep hover:underline cursor-pointer inline-flex items-center gap-1 font-semibold"
            >
              <MessageCircle size={12} />
              <span>Reply to this specific card</span>
            </button>
          </div>
        )}

        {/* Card Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentIndex === 0
                ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-love-pale text-love-deep hover:bg-love-blush"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold shadow-md shadow-love-pink/25 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>{currentIndex === cards.length - 1 ? "Finish Habit Deck" : "Next Card"}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
