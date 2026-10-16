import React, { useState } from "react";
import type { SecretCodePayload } from "../../types/romantic";
import {
  Lock,
  Unlock,
  KeyRound,
  HelpCircle,
  Sparkles,
  Heart,
  RefreshCw,
} from "lucide-react";

interface SecretCodeUnlockProps {
  payload: SecretCodePayload;
  partnerName?: string;
  creatorName?: string;
  onUnlocked?: () => void;
  isRecipientMode?: boolean;
}

export const SecretCodeUnlock: React.FC<SecretCodeUnlockProps> = ({
  payload,
  partnerName = "My Love",
  creatorName = "Your Favorite Person",
  onUnlocked,
  isRecipientMode: _isRecipientMode = false,
}) => {
  const [inputCode, setInputCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);

  const cleanTargetCode = payload.code.trim().toLowerCase();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const guess = inputCode.trim().toLowerCase();
    if (guess === cleanTargetCode) {
      setIsUnlocked(true);
      setErrorMessage(null);
      if (onUnlocked) onUnlocked();
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      // Pick humorous/affectionate wrong answer banter
      const banterList = payload.wrongBanter?.length
        ? payload.wrongBanter
        : [
            "Aww... Itna bhi nahi pata mujhe? 🥺 Try again na...",
            "Galat hai! 😭 Ek aur chance... Main itni jaldi nahi khulne wali!",
            "Nice try cutie! 🙈 But that's not our secret code.",
            "Are you sure you're my person? 👀 Think harder!",
          ];
      const randomBanter =
        banterList[(nextAttempts - 1) % banterList.length];
      setErrorMessage(randomBanter);

      // Auto-suggest hint after configured attempts
      if (nextAttempts >= payload.attemptsAllowed) {
        setShowHint(true);
      }
    }
  };

  const handleRevealDirectly = () => {
    setIsUnlocked(true);
    if (onUnlocked) onUnlocked();
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Container with Starry/Enchanted Aesthetic */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-900/40 shadow-2xl bg-gradient-to-b from-[#1C0E28] via-[#2E143B] to-[#1F0A27] text-white p-6 sm:p-8">
        {/* Starry particles backdrop overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-black/60 pointer-events-none" />

        {/* Ambient header illustration */}
        <div className="relative z-10 text-center mb-6">
          <div className="relative w-36 h-36 mx-auto mb-3 rounded-2xl overflow-hidden border border-purple-400/30 shadow-lg shadow-purple-950/60">
            <img
              src="/assets/images/starry_secret_box.jpg"
              alt="Enchanted starry locked envelope"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C0E28] via-transparent to-transparent" />
            <div className="absolute top-2 right-2">
              <span className="p-1.5 rounded-full bg-black/50 backdrop-blur-xs text-purple-200 inline-flex">
                {isUnlocked ? <Unlock size={14} className="text-pink-300" /> : <Lock size={14} className="text-amber-300" />}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs font-semibold mb-2">
            <Sparkles size={12} className="text-pink-300" />
            <span>Only You Know This 🔒</span>
          </div>

          <h3
            className="text-xl sm:text-2xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isUnlocked
              ? payload.rewardTitle || "Secret Surprise Unlocked!"
              : "Unlock Your Secret Surprise"}
          </h3>
          <p className="text-xs text-purple-200/70 mt-1">
            {isUnlocked
              ? payload.unlockedSubtitle || `A private message from ${creatorName} for ${partnerName} ♡`
              : `Enter the code that only ${partnerName} and ${creatorName} would know.`}
          </p>
        </div>

        {/* LOCKED STATE */}
        {!isUnlocked && (
          <div className="relative z-10 space-y-5">
            {/* Clue Panel */}
            <div className="bg-purple-950/60 border border-purple-500/30 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block mb-1">
                Your Clue
              </span>
              <p
                className="text-sm sm:text-base text-pink-100 font-medium"
                style={{ fontFamily: "var(--font-handwritten)", fontSize: "19px" }}
              >
                "{payload.clue}"
              </p>
            </div>

            {/* Code Input Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className={`space-y-2 ${shake ? "animate-[wiggle_0.4s_ease-in-out]" : ""}`}>
                <label className="block text-xs font-semibold text-purple-200/80 text-center">
                  Type the secret word, date, or nickname:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter secret answer..."
                    className="w-full py-3.5 px-4 text-center font-bold tracking-widest text-lg rounded-2xl bg-white/10 border border-purple-400/40 text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-400 focus:bg-white/15 transition-all"
                    autoComplete="off"
                    autoFocus
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300/50">
                    <KeyRound size={18} />
                  </div>
                </div>
              </div>

              {/* Error banter alert */}
              {errorMessage && (
                <div className="bg-pink-950/80 border border-pink-500/40 rounded-2xl p-3 text-center animate-[fadeInLine_0.3s_ease-out]">
                  <p className="text-xs font-semibold text-pink-200">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Unlock Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-love-pink via-pink-500 to-purple-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-950/50 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 btn-glow"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Unlock size={16} />
                <span>Unlock the Secret ♡</span>
              </button>
            </form>

            {/* Hint & Fail-Safe Path (Never block recipient!) */}
            <div className="text-center pt-2 space-y-2">
              {showHint ? (
                <div className="bg-purple-900/40 border border-purple-400/30 rounded-xl p-3 text-xs text-purple-200">
                  <span className="font-bold text-pink-300">💡 Hint: </span>
                  <span>{payload.hint}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-purple-300 hover:text-pink-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <HelpCircle size={13} />
                  <span>Need a gentle hint?</span>
                </button>
              )}

              {/* If stuck, compassionate unlock button */}
              {attempts >= 3 && (
                <div>
                  <button
                    type="button"
                    onClick={handleRevealDirectly}
                    className="text-[11px] text-pink-300/80 hover:text-pink-200 underline cursor-pointer"
                  >
                    It's okay if you forgot! Click here to open your surprise anyway ♡
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* UNLOCKED REWARD STATE */}
        {isUnlocked && (
          <div className="relative z-10 space-y-5 animate-[fadeInLine_0.6s_ease-out]">
            <div className="text-center space-y-1">
              <span className="text-3xl animate-bounce inline-block">💖</span>
              <h4
                className="text-xl sm:text-2xl font-extrabold text-pink-200 mt-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {payload.rewardTitle || "Secret Surprise Unlocked!"}
              </h4>
              {payload.unlockedSubtitle?.trim() && (
                <p className="text-xs text-purple-200/80 max-w-sm mx-auto">
                  {payload.unlockedSubtitle}
                </p>
              )}
              {payload.decorativeCaption?.trim() && (
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-pink-900/60 border border-pink-400/30 text-[10px] font-bold text-pink-200 tracking-wider uppercase">
                  {payload.decorativeCaption}
                </div>
              )}
            </div>

            {/* Reward Card */}
            <div className="bg-white/95 rounded-2xl p-5 text-love-plum border border-pink-200 shadow-xl space-y-3">
              {payload.rewardImageUrl?.trim() && (
                <div className="rounded-xl overflow-hidden aspect-[16/10] border border-love-blush shadow-xs">
                  <img
                    src={payload.rewardImageUrl}
                    alt="Unlocked surprise reward"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {payload.rewardMessage?.trim() && (
                <p
                  className="text-sm sm:text-base leading-relaxed font-medium text-love-plum/90"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  "{payload.rewardMessage}"
                </p>
              )}

              <div className="pt-2 border-t border-love-blush flex items-center justify-between text-xs text-love-plum/70">
                <span
                  style={{ fontFamily: "var(--font-handwritten)", fontSize: "16px" }}
                  className="text-love-deep font-semibold"
                >
                  {payload.closingLine?.trim() || `Forever yours, ${creatorName} ♡`}
                </span>
                <Heart size={14} className="fill-love-pink text-love-pink" />
              </div>
            </div>

            {/* Reset Game button for replaying */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setInputCode("");
                  setAttempts(0);
                  setErrorMessage(null);
                }}
                className="text-xs text-purple-300 hover:text-pink-200 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw size={12} />
                <span>Lock again & replay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
