import React from "react";
import {
  Heart,
  Lock,
  RotateCcw,
  FolderHeart,
  Mail,
  Gift,
  Sparkles,
} from "lucide-react";
import type { ActiveView } from "../../types/romantic";

interface FeaturePanelsProps {
  onSelectFeature: (view: ActiveView, extraData?: any) => void;
  onOpenCreator: (defaultType?: string) => void;
}

export const FeaturePanels: React.FC<FeaturePanelsProps> = ({
  onSelectFeature,
  onOpenCreator,
}) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-blush text-love-deep text-xs font-bold tracking-wide">
            <Sparkles size={13} className="text-love-pink" />
            <span>THE 7 ROMANTIC EXPERIENCES</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need to make them feel loved.
          </h2>
          <p className="text-sm sm:text-base text-love-plum/70">
            Click any experience below to play the live interactive demo or personalize your own in under two minutes.
          </p>
        </div>

        {/* Feature Cards Grid (Inspired by reference board) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* FEATURE 1: I Noticed This About You */}
          <div className="bg-white rounded-3xl p-6 border border-love-blush shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-love-blush text-love-deep font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-bold text-love-pink bg-love-pale px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Heart size={12} className="fill-love-pink" />
                  Habit Cards
                </span>
              </div>
              <h3
                className="text-lg font-bold text-love-plum mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                I Noticed This About You 💗
              </h3>
              <p className="text-xs text-love-plum/70 mb-4">
                Cute, personalized cards about the tiny habits you secretly notice and love.
              </p>

              {/* Mini visual mockup */}
              <div className="bg-gradient-to-b from-love-pale to-white rounded-2xl p-4 border border-love-blush/60 relative overflow-hidden mb-4">
                <div className="flex items-center justify-between text-[11px] text-love-plum/60 font-semibold mb-2">
                  <span>I Noticed This About You</span>
                  <span className="bg-love-blush px-2 py-0.5 rounded-full text-love-deep">1/10</span>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-2.5">
                  <img
                    src="/assets/images/habit_card_cute.jpg"
                    alt="Cute couple under blanket"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-love-plum/60 via-transparent to-transparent flex items-end p-3">
                    <p className="text-white text-xs font-semibold drop-shadow-sm">
                      "The way you get all excited over the smallest things..."
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-love-plum/50 font-medium">
                  <span className="bg-white/80 px-2 py-1 rounded-md border border-love-blush">Your habits</span>
                  <span className="bg-white/80 px-2 py-1 rounded-md border border-love-blush">Your reactions</span>
                  <span className="bg-white/80 px-2 py-1 rounded-md border border-love-blush">Custom cards</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onSelectFeature("surprises", { type: "habits" })}
                className="flex-1 py-2 rounded-xl bg-love-pale text-love-deep text-xs font-bold hover:bg-love-blush transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Play Demo
              </button>
              <button
                onClick={() => onOpenCreator("habit_cards")}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Create Yours
              </button>
            </div>
          </div>

          {/* FEATURE 2: Only You Know This */}
          <div className="bg-white rounded-3xl p-6 border border-love-blush shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-love-lavender text-love-plum font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Lock size={12} />
                  Secret Code
                </span>
              </div>
              <h3
                className="text-lg font-bold text-love-plum mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Only You Know This 🔒
              </h3>
              <p className="text-xs text-love-plum/70 mb-4">
                A secret-code mini game to unlock a hidden letter, photo, or audio reward.
              </p>

              {/* Starry Night Mini Mockup */}
              <div className="bg-gradient-to-b from-[#221028] to-[#3B1C47] rounded-2xl p-4 text-white relative overflow-hidden mb-4 border border-purple-900/40">
                <p className="text-[11px] text-purple-200/80 text-center mb-1">
                  Enter the special code (only we know)
                </p>
                {/* 4 code dots/boxes */}
                <div className="flex justify-center gap-2 my-2.5">
                  <div className="w-7 h-8 rounded-lg bg-white/10 border border-purple-400/40 flex items-center justify-center text-xs font-bold">C</div>
                  <div className="w-7 h-8 rounded-lg bg-white/10 border border-purple-400/40 flex items-center justify-center text-xs font-bold">U</div>
                  <div className="w-7 h-8 rounded-lg bg-white/10 border border-purple-400/40 flex items-center justify-center text-xs font-bold">T</div>
                  <div className="w-7 h-8 rounded-lg bg-white/10 border border-purple-400/40 flex items-center justify-center text-xs font-bold">I</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2 text-[10px] text-purple-200 flex items-center gap-2">
                  <span>🥺</span>
                  <p className="truncate italic">"Aww... Itna bhi nahi pata mujhe? Try again na..."</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onSelectFeature("surprises", { type: "secret_code" })}
                className="flex-1 py-2 rounded-xl bg-love-pale text-love-deep text-xs font-bold hover:bg-love-blush transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Play Game
              </button>
              <button
                onClick={() => onOpenCreator("secret_code")}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-love-plum to-purple-800 text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Set Code
              </button>
            </div>
          </div>

          {/* FEATURE 3: Delulu Mode: Our Alternate Universe */}
          <div className="bg-white rounded-3xl p-6 border border-love-blush shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-love-pale text-love-deep font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} />
                  Fictional Romance
                </span>
              </div>
              <h3
                className="text-lg font-bold text-love-plum mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Delulu Mode ✨
              </h3>
              <p className="text-xs text-love-plum/70 mb-4">
                Become the protagonists in your own interactive romantic story with 6 tropes!
              </p>

              {/* Anime Story Mockup */}
              <div className="bg-gradient-to-b from-love-pale to-white rounded-2xl p-3 border border-love-blush/60 relative overflow-hidden mb-4">
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-2">
                  <img
                    src="/assets/images/delulu_story_anime.jpg"
                    alt="Delulu anime couple"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                    Academic Rivals
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="bg-white rounded-lg p-1.5 border border-love-blush text-[10px] text-love-plum/80 flex items-center justify-between">
                    <span>1. Tease him about it</span>
                    <span className="text-love-pink text-[9px]">Choice A</span>
                  </div>
                  <div className="bg-white rounded-lg p-1.5 border border-love-blush text-[10px] text-love-plum/80 flex items-center justify-between">
                    <span>2. Act annoyed but smile</span>
                    <span className="text-love-pink text-[9px]">Choice B</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onSelectFeature("delulu")}
                className="flex-1 py-2 rounded-xl bg-love-pale text-love-deep text-xs font-bold hover:bg-love-blush transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Read Story
              </button>
              <button
                onClick={() => onOpenCreator("delulu_story")}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Create Story
              </button>
            </div>
          </div>

          {/* FEATURE 4: Love Loop: Your Turn, My Love */}
          <div className="bg-white rounded-3xl p-6 border border-love-blush shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-love-blush text-love-deep font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <RotateCcw size={12} />
                  Two-Way Replies
                </span>
              </div>
              <h3
                className="text-lg font-bold text-love-plum mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Love Loop 🔄
              </h3>
              <p className="text-xs text-love-plum/70 mb-4">
                Let your partner reply, react, and share their own heartfelt messages.
              </p>

              {/* Chat Reply Mockup */}
              <div className="bg-love-pale/60 rounded-2xl p-3 border border-love-blush/60 mb-4 space-y-2">
                <div className="bg-white rounded-xl p-2.5 border border-love-blush shadow-2xs">
                  <p className="text-[10px] font-bold text-love-deep mb-0.5">Now tell me...</p>
                  <p className="text-[11px] text-love-plum font-medium">One tiny thing I do that makes you smile? 💗</p>
                </div>
                <div className="bg-love-blush/70 rounded-xl p-2.5 ml-3 border border-love-pink/30">
                  <p className="text-[11px] text-love-plum font-semibold">
                    "You always make me laugh even when I'm having the worst day. 🥰"
                  </p>
                  <span className="text-[9px] text-love-plum/50 mt-1 block">Audio note • 0:24</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onSelectFeature("inbox")}
                className="flex-1 py-2 rounded-xl bg-love-pale text-love-deep text-xs font-bold hover:bg-love-blush transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                View Replies
              </button>
              <button
                onClick={() => onOpenCreator("love_loop")}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Add Prompt
              </button>
            </div>
          </div>

          {/* FEATURE 5: Our Little Lore */}
          <div className="bg-white rounded-3xl p-6 border border-love-blush shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-love-lavender text-love-plum font-bold text-xs flex items-center justify-center">
                  5
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FolderHeart size={12} />
                  Private Scrapbook
                </span>
              </div>
              <h3
                className="text-lg font-bold text-love-plum mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Little Lore 🖼️
              </h3>
              <p className="text-xs text-love-plum/70 mb-4">
                A private space to save your memories, inside jokes, and special milestones.
              </p>

              {/* Scrapbook Grid Mockup */}
              <div className="bg-love-cream rounded-2xl p-3 border border-love-blush/60 mb-4">
                <div className="flex items-center gap-1.5 text-[9px] text-love-plum/60 font-bold mb-2">
                  <span className="bg-love-pink text-white px-2 py-0.5 rounded-full">All</span>
                  <span className="bg-white px-2 py-0.5 rounded-full">Memories</span>
                  <span className="bg-white px-2 py-0.5 rounded-full">Inside Jokes</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="bg-white p-2 rounded-xl border border-love-blush shadow-2xs">
                    <p className="text-[11px] font-bold text-love-plum truncate">Our first call</p>
                    <p className="text-[9px] text-love-coral">14 Jan 2024</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-love-blush shadow-2xs">
                    <p className="text-[11px] font-bold text-love-plum truncate">That cafe date</p>
                    <p className="text-[9px] text-love-coral">22 Feb 2024</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onSelectFeature("our-space")}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-love-deep text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Explore Scrapbook (6 Entries)
              </button>
            </div>
          </div>

          {/* FEATURE 6: Open When... Letters */}
          <div className="bg-white rounded-3xl p-6 border border-love-blush shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-love-blush text-love-deep font-bold text-xs flex items-center justify-center">
                  6
                </span>
                <span className="text-xs font-bold text-love-pink bg-love-pale px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Mail size={12} />
                  Envelopes
                </span>
              </div>
              <h3
                className="text-lg font-bold text-love-plum mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Open When... Letters ✉️
              </h3>
              <p className="text-xs text-love-plum/70 mb-4">
                Personalized letters for everyday moods: missing you, stressed by exams, or feeling down.
              </p>

              {/* Envelopes mini gallery */}
              <div className="bg-love-pale rounded-2xl p-3 border border-love-blush/60 mb-4 grid grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-xl border border-love-blush text-center hover:scale-102 transition-transform">
                  <span className="text-lg">💭</span>
                  <p className="text-[10px] font-bold text-love-plum mt-1">Open when you miss me</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-love-blush text-center hover:scale-102 transition-transform">
                  <span className="text-lg">☕</span>
                  <p className="text-[10px] font-bold text-love-plum mt-1">Open when stressed</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onSelectFeature("surprises", { type: "open_when" })}
                className="flex-1 py-2 rounded-xl bg-love-pale text-love-deep text-xs font-bold hover:bg-love-blush transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Open Letters
              </button>
              <button
                onClick={() => onOpenCreator("open_when")}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Write Letters
              </button>
            </div>
          </div>
        </div>

        {/* FEATURE 7 BANNER: The Final Reveal */}
        <div className="bg-gradient-to-r from-[#2F132E] via-[#481E3B] to-[#2B1028] rounded-3xl p-6 sm:p-10 border border-purple-800/40 shadow-xl text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-pink-300 text-xs font-bold">
              <span>7 • THE FINAL REVEAL</span>
              <Gift size={12} />
            </div>
            <h3
              className="text-2xl sm:text-3xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Emotional Climax & Forever Reveal 🎁
            </h3>
            <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed">
              Bring all your tiny moments together into a starry, magical envelope with music, sparkles, and a personal closing letter:
              <span className="italic block mt-1 text-pink-200">
                "Okay, our delulu universe ends here. But in this universe, I'm still choosing you. Every single day."
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={() => onSelectFeature("surprises", { type: "final_reveal" })}
              className="px-5 py-3 rounded-full bg-white text-love-plum font-bold text-xs sm:text-sm hover:bg-love-cream transition-colors cursor-pointer shadow-md"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Experience Final Reveal
            </button>
            <button
              onClick={() => onOpenCreator("complete_surprise")}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity cursor-pointer shadow-md btn-glow"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Build Complete Surprise
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
