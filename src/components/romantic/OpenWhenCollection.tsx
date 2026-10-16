import React, { useState } from "react";
import type { OpenWhenLetter, RecipientResponse } from "../../types/romantic";
import {
  Mail,
  Sparkles,
  X,
  Check,
  Send,
  AlertCircle,
  Share2,
  RefreshCw,
} from "lucide-react";
import { EnvelopeIcon } from "../Illustrations";
import { submitRecipientResponse } from "../../data/momentStore";

interface OpenWhenCollectionProps {
  letters: OpenWhenLetter[];
  momentId?: string;
  partnerName?: string;
  creatorName?: string;
  onReply?: (letterId: string, replyText: string) => void;
  isRecipientMode?: boolean;
}

export const OpenWhenCollection: React.FC<OpenWhenCollectionProps> = ({
  letters,
  momentId,
  partnerName = "My Love",
  creatorName = "Someone who loves you",
  onReply,
  isRecipientMode: _isRecipientMode = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openedLetter, setOpenedLetter] = useState<OpenWhenLetter | null>(null);
  const [openedIds, setOpenedIds] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const filterOptions = [
    { id: "all", label: "All Envelopes" },
    { id: "love", label: "Love ♡" },
    { id: "motivation", label: "Motivation 🏆" },
    { id: "missing_you", label: "Missing You 💭" },
    { id: "exams", label: "Exams & Deadlines ☕" },
    { id: "bad_day", label: "Bad Day 🌙" },
  ];

  const filteredLetters = letters.filter((l) => {
    if (activeFilter === "all") return true;
    return l.category === activeFilter;
  });

  const handleOpenLetter = (letter: OpenWhenLetter) => {
    setOpenedLetter(letter);
    setOpenedIds((prev) => ({ ...prev, [letter.id]: true }));
    setReplyText("");
    setReplySuccess(false);
    setReplyError(null);
  };

  const handleCloseLetter = () => {
    setOpenedLetter(null);
    setReplyText("");
    setReplySuccess(false);
    setReplyError(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !openedLetter) return;

    setIsSendingReply(true);
    setReplyError(null);

    const payload: RecipientResponse = {
      id: `quick-${Date.now()}`,
      type: "quick-reply",
      momentId: momentId || "default",
      surpriseId: momentId || "default",
      partnerName,
      context: `Quick Reply to: "${openedLetter.title}"`,
      text: replyText.trim(),
      reaction: "💌",
      createdAt: new Date().toISOString(),
      savedToLore: false,
    };

    const res = await submitRecipientResponse(payload);
    setIsSendingReply(false);

    if (res.success) {
      setReplySuccess(true);
      if (onReply) {
        onReply(openedLetter.id, replyText);
      }
      setTimeout(() => {
        setReplySuccess(false);
        setReplyText("");
      }, 4000);
    } else {
      setReplyError(res.error || "Delivery failed. Please try again.");
    }
  };

  const handleWhatsAppManualShare = () => {
    if (!openedLetter) return;
    const msg = `Hey ${creatorName}! ♡ In reply to your letter "${openedLetter.title}":\n\n"${replyText.trim()}"\n\n— Sent from Our Little Universe ✨`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-blush text-love-deep text-xs font-bold tracking-wide">
          <Mail size={13} className="text-love-pink" />
          <span>OPEN WHEN... ENVELOPES</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-love-plum"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Letters for everyday moments.
        </h2>
        <p className="text-xs sm:text-sm text-love-plum/70">
          Messages prepared for you to open whenever you need comfort, a smile, or a reminder of how loved you are.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterOptions.map((opt) => {
          const isSelected = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? "bg-love-pink text-white border-love-pink shadow-xs"
                  : "bg-white text-love-plum/70 border-love-blush hover:bg-love-pale"
              }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLetters.map((letter) => {
          const isOpened = openedIds[letter.id];
          return (
            <button
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className="bg-white rounded-3xl p-6 border border-love-blush shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-between group cursor-pointer hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Envelope visual */}
              <div className="w-full flex justify-center py-4 relative">
                <EnvelopeIcon
                  size={100}
                  color={letter.color || "#FFE4EC"}
                  isOpen={isOpened}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
                  {letter.emoji}
                </span>
              </div>

              {/* Title & Tag */}
              <div className="space-y-1 w-full mt-2">
                <span className="text-[10px] font-bold text-love-deep bg-love-pale px-2.5 py-0.5 rounded-full inline-block">
                  {letter.categoryLabel}
                </span>
                <h3
                  className="text-base font-bold text-love-plum group-hover:text-love-deep transition-colors line-clamp-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {letter.title}
                </h3>
              </div>

              {/* Status pill */}
              <div className="mt-4 pt-3 border-t border-love-blush/60 w-full flex items-center justify-center gap-1.5 text-xs text-love-pink font-semibold">
                {isOpened ? (
                  <span className="text-love-plum/50 flex items-center gap-1">
                    <Check size={12} className="text-green-500" />
                    Opened • Click to re-read
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} />
                    Click to open letter ♡
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Letter Reading Modal */}
      {openedLetter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-love-blush relative animate-[fadeInLine_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseLetter}
              className="absolute top-5 right-5 text-love-plum/40 hover:text-love-plum p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Letter Header */}
            <div className="text-center pb-4 border-b border-love-blush/60 mb-4">
              <span className="text-3xl inline-block mb-1">
                {openedLetter.emoji}
              </span>
              <span className="text-[11px] font-bold text-love-deep uppercase tracking-wider block">
                {openedLetter.categoryLabel}
              </span>
              <h3
                className="text-xl font-bold text-love-plum mt-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {openedLetter.title}
              </h3>
            </div>

            {/* Letter Body (Handwritten paper style) */}
            <div className="bg-love-cream/60 rounded-2xl p-5 border border-love-blush shadow-2xs space-y-4 mb-5">
              <p className="text-xs font-bold text-love-plum/60 tracking-wider">
                DEAR {partnerName.toUpperCase()} ♡
              </p>
              <p
                className="text-base sm:text-lg text-love-plum leading-relaxed font-normal"
                style={{ fontFamily: "var(--font-handwritten)", fontSize: "22px" }}
              >
                {openedLetter.message}
              </p>
              <div className="pt-2 text-right">
                <p
                  className="text-sm font-semibold text-love-deep"
                  style={{ fontFamily: "var(--font-handwritten)", fontSize: "19px" }}
                >
                  Forever in your corner,
                  <br />
                  {creatorName} ♡
                </p>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-2">
              <label className="text-[11px] font-bold text-love-plum block">
                Send a quick reply to {creatorName}:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for this letter... 💗"
                  disabled={isSendingReply}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink"
                />
                <button
                  type="submit"
                  disabled={isSendingReply || !replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingReply ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  <span>{isSendingReply ? "Sending..." : "Send"}</span>
                </button>
              </div>

              {replySuccess && (
                <p className="text-xs text-green-600 font-semibold text-center pt-1 animate-[fadeInLine_0.2s_ease-out]">
                  Reply sent! Your partner will see this ♡
                </p>
              )}

              {replyError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5 animate-[fadeInLine_0.2s_ease-out]">
                  <p className="flex items-center gap-1 font-semibold">
                    <AlertCircle size={13} className="text-rose-600 shrink-0" />
                    <span>{replyError}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSendReply}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer"
                    >
                      Retry
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppManualShare}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
                    >
                      <Share2 size={11} />
                      <span>Send on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
