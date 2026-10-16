import React from "react";
import { Check, Heart, Sparkles, Gift } from "lucide-react";

interface PricingModalProps {
  onClose?: () => void;
  onOpenCreator: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  onClose,
  onOpenCreator,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-blush text-love-deep text-xs font-bold tracking-wide">
          <Sparkles size={13} className="text-love-pink" />
          <span>TRANSPARENT & HONEST LOVE</span>
        </div>
        <h2
          className="text-2xl sm:text-4xl font-extrabold text-love-plum"
          style={{ fontFamily: "var(--font-display)" }}
        >
          No paywalls on real feelings.
        </h2>
        <p className="text-xs sm:text-sm text-love-plum/70">
          We believe celebrating your person shouldn't come with subscriptions or hidden paywalls.
        </p>
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Tier 1: Free Forever */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-love-pink shadow-xl shadow-love-pink/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-love-blush text-love-deep text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            CURRENT PLAN • ACTIVE
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-xl bg-love-blush text-love-pink">
                <Heart size={16} className="fill-love-pink" />
              </span>
              <h3
                className="text-lg font-bold text-love-plum"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tiny Moments Core
              </h3>
            </div>

            <div className="my-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-love-plum">$0</span>
              <span className="text-xs text-love-plum/60 font-semibold"> / 100% Free Forever</span>
            </div>

            <p className="text-xs text-love-plum/70 mb-5">
              Everything you need to build, preview, and share unlimited romantic surprises with your partner.
            </p>

            <ul className="space-y-2.5 text-xs text-love-plum/80 font-medium mb-6">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-love-pink flex-shrink-0" />
                <span>Unlimited personalized Habit Cards decks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-love-pink flex-shrink-0" />
                <span>Secret-Code game with custom clues & hints</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-love-pink flex-shrink-0" />
                <span>All 6 Delulu Mode alternate universe tropes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-love-pink flex-shrink-0" />
                <span>Love Loop 2-way replies & voice simulations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-love-pink flex-shrink-0" />
                <span>Private local "Our Little Lore" scrapbook</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-love-pink flex-shrink-0" />
                <span>Instant links (no app install for recipient)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              if (onClose) onClose();
              onOpenCreator();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-love-pink to-love-deep text-white font-bold text-xs tracking-wide shadow-md shadow-love-pink/25 hover:shadow-lg transition-all cursor-pointer btn-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Create Your Surprise Now ♡
          </button>
        </div>

        {/* Tier 2: Keepsake Club (Future / Preview) */}
        <div className="bg-love-cream/60 rounded-3xl p-6 sm:p-7 border border-love-blush shadow-sm flex flex-col justify-between opacity-90">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
                <Gift size={16} />
              </span>
              <h3
                className="text-lg font-bold text-love-plum"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Forever Keepsakes
              </h3>
            </div>

            <div className="my-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-love-plum">Optional</span>
              <span className="text-xs text-love-plum/60 font-semibold"> / Future Club</span>
            </div>

            <p className="text-xs text-love-plum/70 mb-5">
              Physical keepsakes and high-resolution downloadable mementos (coming soon in future updates).
            </p>

            <ul className="space-y-2.5 text-xs text-love-plum/70 font-medium mb-6">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-600 flex-shrink-0" />
                <span>Printable High-Res Couple Zine PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-600 flex-shrink-0" />
                <span>Offline MP3 chime music-box download</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-600 flex-shrink-0" />
                <span>Custom physical photobook generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-600 flex-shrink-0" />
                <span>Early access to upcoming delulu tropes</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-100/70 p-3 rounded-2xl text-[11px] text-purple-800 text-center font-semibold">
            ✨ Core features remain 100% free with no fake paywalls.
          </div>
        </div>
      </div>
    </div>
  );
};
