import React, { useState } from "react";
import type { MomentRecord } from "../../types/romantic";
import { HabitCardPlayer } from "./HabitCardPlayer";
import { SecretCodeUnlock } from "./SecretCodeUnlock";
import { DeluluStoryPlayer } from "./DeluluStoryPlayer";
import { OpenWhenCollection } from "./OpenWhenCollection";
import { FinalReveal } from "./FinalReveal";
import { LoveLoopComposer } from "./LoveLoopComposer";
import { Heart, ArrowLeft, Share2, Check } from "lucide-react";

interface RecipientViewProps {
  moment: MomentRecord;
  onExit?: () => void;
  onSaveToLore?: () => void;
}

export const RecipientView: React.FC<RecipientViewProps> = ({
  moment,
  onExit,
  onSaveToLore,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-love-pale via-love-cream to-love-pale py-6 sm:py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Recipient Top Floating Banner */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-love-blush shadow-xs">
          {onExit && (
            <button
              onClick={onExit}
              className="text-xs font-semibold text-love-plum/70 hover:text-love-plum flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Universe</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs font-bold text-love-deep">
            <Heart size={14} className="fill-love-pink text-love-pink animate-pulse" />
            <span>A surprise from {moment.creatorName} for {moment.partnerName} ♡</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="text-xs text-love-deep hover:text-love-pink font-semibold flex items-center gap-1 cursor-pointer"
            title="Save or copy link"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            <span>{copied ? "Link Copied!" : "Save Link"}</span>
          </button>
        </div>

        {/* Title Card */}
        <div className="text-center space-y-1.5">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {moment.title}
          </h1>
          {moment.subtitle && (
            <p className="text-xs sm:text-sm text-love-plum/70">
              {moment.subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Content Based on Moment Type */}
        <div className="animate-[fadeInLine_0.4s_ease-out]">
          {moment.type === "habit_cards" && (
            <HabitCardPlayer
              cards={moment.payload.cards}
              partnerName={moment.partnerName}
              creatorName={moment.creatorName}
              isRecipientMode={true}
            />
          )}

          {moment.type === "secret_code" && (
            <SecretCodeUnlock
              payload={moment.payload}
              partnerName={moment.partnerName}
              creatorName={moment.creatorName}
              isRecipientMode={true}
            />
          )}

          {moment.type === "delulu_story" && (
            <DeluluStoryPlayer
              payload={moment.payload}
              onSaveToLore={onSaveToLore}
              isRecipientMode={true}
            />
          )}

          {moment.type === "open_when" && (
            <OpenWhenCollection
              letters={moment.payload.letters}
              partnerName={moment.partnerName}
              creatorName={moment.creatorName}
              isRecipientMode={true}
            />
          )}

          {moment.type === "complete_surprise" && (
            <div className="space-y-10">
              {moment.payload.habitCards && (
                <HabitCardPlayer
                  cards={moment.payload.habitCards.cards}
                  partnerName={moment.partnerName}
                  creatorName={moment.creatorName}
                  isRecipientMode={true}
                />
              )}
              {moment.payload.secretCode && (
                <SecretCodeUnlock
                  payload={moment.payload.secretCode}
                  partnerName={moment.partnerName}
                  creatorName={moment.creatorName}
                  isRecipientMode={true}
                />
              )}
              {moment.payload.deluluStory && (
                <DeluluStoryPlayer
                  payload={moment.payload.deluluStory}
                  onSaveToLore={onSaveToLore}
                  isRecipientMode={true}
                />
              )}
              <FinalReveal
                partnerName={moment.partnerName}
                creatorName={moment.creatorName}
                closingMessage={moment.payload.finalRevealMessage}
                onSaveToLore={onSaveToLore}
              />
            </div>
          )}
        </div>

        {/* Love Loop Reply Station at Bottom (if enabled) */}
        {moment.hasLoveLoop && (
          <div className="pt-6 border-t border-love-blush/60">
            <LoveLoopComposer
              momentId={moment.id}
              partnerName={moment.partnerName}
              creatorName={moment.creatorName}
              promptQuestion={moment.loveLoopPrompt}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 text-xs text-love-plum/40 font-medium">
          <p>YOU & ME • A little world, made just for you two ♡</p>
        </footer>
      </div>
    </div>
  );
};
