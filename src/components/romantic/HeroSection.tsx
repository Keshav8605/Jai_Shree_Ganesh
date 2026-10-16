import React from "react";
import { Sparkles, Heart, Compass, Smartphone, ShieldCheck, Zap } from "lucide-react";

interface HeroSectionProps {
  onOpenCreator: () => void;
  onExploreDemos: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCreator,
  onExploreDemos,
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-love-pale via-white/40 to-love-pale/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner Card */}
        <div className="relative rounded-3xl overflow-hidden border border-love-blush/80 shadow-2xl shadow-love-plum/5 bg-white/70 backdrop-blur-md">
          {/* Background Illustration with gentle gradient overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/hero_couple_sunset.jpg"
              alt="Romantic anime couple enjoying sunset together"
              className="w-full h-full object-cover object-center opacity-30 sm:opacity-25 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-love-pale/95 via-white/85 to-transparent sm:w-2/3" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
          </div>

          {/* Banner Content Grid */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col justify-between min-h-[460px]">
            <div className="max-w-2xl space-y-4 sm:space-y-6">
              {/* Emotional Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-love-blush/90 border border-love-pink/30 text-love-deep text-xs font-semibold tracking-wide shadow-xs">
                <Heart size={13} className="fill-love-deep animate-pulse" />
                <span>YOU & ME • Romantic Experiences for Gen Z</span>
                <span className="text-love-coral">♡</span>
              </div>

              {/* Main Headline from User Prompt */}
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-love-plum leading-[1.12]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Turn your little moments into a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-love-pink via-love-deep to-love-plum underline decoration-love-coral/40 decoration-wavy">
                  big love story.
                </span>
              </h1>

              {/* Supporting Line */}
              <p className="text-base sm:text-lg text-love-plum/80 leading-relaxed font-medium">
                A little world, made just for you two. Create cute habit cards, unlock starry secret codes, star in personalized alternate universe stories, and keep your memories in <span className="font-semibold text-love-deep">Our Little Lore</span>.
              </p>

              {/* CTA Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenCreator}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-love-pink via-love-deep to-love-plum text-white font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-love-pink/35 hover:shadow-xl hover:shadow-love-pink/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer btn-glow"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Sparkles size={18} className="animate-spin-slow" />
                  <span>Create a Surprise</span>
                </button>

                <button
                  onClick={onExploreDemos}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/90 hover:bg-white text-love-plum font-semibold text-sm border border-love-blush shadow-sm hover:shadow-md hover:border-love-coral transition-all cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Compass size={17} className="text-love-pink" />
                  <span>Experience Demo Surprise</span>
                </button>
              </div>

              {/* Trust & Ease Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-love-plum/70">
                <div className="flex items-center gap-1.5">
                  <Smartphone size={14} className="text-love-pink" />
                  <span>Opens on any phone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-love-pink" />
                  <span>100% Private to you two</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-love-pink" />
                  <span>Under 2 mins to create</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
