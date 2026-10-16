import React, { useState } from "react";
import {
  Gift,
  Heart,
  Sparkles,
  FolderHeart,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { EnvelopeIcon } from "../Illustrations";

interface FinalRevealProps {
  partnerName?: string;
  creatorName?: string;
  closingMessage?: string;
  closingQuote?: string;
  imageUrl?: string;
  onSaveToLore?: () => void;
  onReplay?: () => void;
  onOpenReply?: () => void;
}

export const FinalReveal: React.FC<FinalRevealProps> = ({
  partnerName = "My Favorite Person",
  creatorName = "Someone who loves you",
  closingMessage,
  closingQuote = "You're my favorite notification, my favorite hello, and my favorite kind of forever. ♡",
  imageUrl,
  onSaveToLore,
  onReplay,
  onOpenReply,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const defaultMessage = `Hey ${partnerName},

I made this little world just for you, because sometimes a standard text or message doesn't even come close to expressing what you mean to me.

I hope every little habit card, every silly question, every secret code, and every alternate universe scene reminds you of one simple truth:

You are appreciated. You are deeply loved. And in all the ordinary, messy, beautiful moments in between, I will always choose you.

Thank you for being you. Always.`;

  const finalMessageText = closingMessage || defaultMessage;

  const handleSaveToLore = () => {
    setSavedNotice(true);
    if (onSaveToLore) onSaveToLore();
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Starry Night Envelope Reveal Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-900/40 shadow-2xl bg-gradient-to-b from-[#2B1028] via-[#3E1636] to-[#240A22] text-white p-6 sm:p-10 text-center">
        {/* Glow behind envelope */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-love-pink/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-pink-300 text-xs font-bold">
            <Sparkles size={12} />
            <span>THE FINAL REVEAL • OUR LITTLE UNIVERSE</span>
            <Sparkles size={12} />
          </div>

          <h2
            className="text-2xl sm:text-3xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A Little World, Made Just for You.
          </h2>

          {/* Interactive Envelope / Box button */}
          {!isOpen ? (
            <div className="py-6 space-y-4">
              <div className="w-28 h-28 mx-auto flex items-center justify-center relative cursor-pointer group" onClick={() => setIsOpen(true)}>
                <EnvelopeIcon size={120} color="#FFE4EC" isOpen={false} className="group-hover:scale-105 transition-transform" />
                <span className="absolute text-2xl animate-pulse">💗</span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white font-bold text-sm shadow-lg shadow-pink-950/50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer btn-glow inline-flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Gift size={16} />
                  <span>Open My Heart 💗</span>
                </button>
                <p className="text-xs text-pink-200/60 mt-2">
                  Click to reveal your personal ending letter
                </p>
              </div>
            </div>
          ) : (
            /* Opened Letter Presentation */
            <div className="space-y-6 animate-[fadeInLine_0.6s_ease-out]">
              <div className="bg-white/95 text-love-plum rounded-3xl p-6 sm:p-8 text-left shadow-xl border border-pink-200/70 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-love-blush">
                  <span className="text-xs font-bold text-love-deep tracking-wider uppercase">
                    TO MY FAVORITE PERSON ♡
                  </span>
                  <Heart size={16} className="fill-love-pink text-love-pink" />
                </div>

                <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-love-plum/90 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  {finalMessageText}
                </div>

                {imageUrl && (
                  <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-love-blush my-3 shadow-sm">
                    <img src={imageUrl} alt="Final reveal memory" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Highlight Quote */}
                <div className="bg-love-pale/80 p-4 rounded-2xl border border-love-blush text-center my-4">
                  <p
                    className="text-base sm:text-lg text-love-deep font-bold italic"
                    style={{ fontFamily: "var(--font-handwritten)", fontSize: "22px" }}
                  >
                    "{closingQuote}"
                  </p>
                </div>

                <div className="text-right pt-2 border-t border-love-blush">
                  <p
                    className="text-sm font-semibold text-love-plum"
                    style={{ fontFamily: "var(--font-handwritten)", fontSize: "19px" }}
                  >
                    With all my love,
                    <br />
                    {creatorName} ♡
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {onOpenReply && (
                  <button
                    onClick={onOpenReply}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold shadow-md hover:scale-102 transition-all cursor-pointer flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <MessageCircle size={14} />
                    <span>Send a Reply</span>
                  </button>
                )}

                <button
                  onClick={handleSaveToLore}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 text-xs font-bold border border-pink-400/30 transition-all cursor-pointer flex items-center gap-1.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <FolderHeart size={14} />
                  <span>{savedNotice ? "Saved to Lore! ♡" : "Save this Moment"}</span>
                </button>

                {onReplay && (
                  <button
                    onClick={onReplay}
                    className="px-4 py-2.5 rounded-full text-xs font-bold text-pink-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <RefreshCw size={13} />
                    <span>Revisit from Start</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
