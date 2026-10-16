import React, { useState } from "react";
import {
  DEFAULT_DEMO_HABIT_MOMENT,
  DEFAULT_DEMO_SECRET_CODE,
  DEFAULT_DEMO_DELULU_STORY,
  DEFAULT_DEMO_OPEN_WHEN,
} from "../../data/momentStore";
import { HabitCardPlayer } from "./HabitCardPlayer";
import { SecretCodeUnlock } from "./SecretCodeUnlock";
import { DeluluStoryPlayer } from "./DeluluStoryPlayer";
import { OpenWhenCollection } from "./OpenWhenCollection";
import { FinalReveal } from "./FinalReveal";
import { LoveLoopComposer } from "./LoveLoopComposer";
import {
  Heart,
  Lock,
  BookOpen,
  Mail,
  Gift,
  RotateCcw,
  Sparkles,
  Compass,
} from "lucide-react";

interface SurprisesShowcaseProps {
  initialType?: string;
  onOpenCreator: (type?: string) => void;
  onOpenClassicJourney?: () => void;
  onOpenOurSpace: () => void;
}

export const SurprisesShowcase: React.FC<SurprisesShowcaseProps> = ({
  initialType = "habits",
  onOpenCreator,
  onOpenOurSpace,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialType);

  const tabs = [
    { id: "habits", label: "Habit Cards 💗", icon: Heart },
    { id: "secret_code", label: "Secret Code 🔒", icon: Lock },
    { id: "delulu", label: "Delulu Mode ✨", icon: BookOpen },
    { id: "open_when", label: "Open When... ✉️", icon: Mail },
    { id: "love_loop", label: "Love Loop 🔄", icon: RotateCcw },
    { id: "final_reveal", label: "Final Reveal 🎁", icon: Gift },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-blush text-love-deep text-xs font-bold tracking-wide">
          <Compass size={13} className="text-love-pink" />
          <span>INTERACTIVE DEMO GALLERY</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-love-plum"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Explore All 7 Playable Surprises
        </h2>
        <p className="text-xs sm:text-sm text-love-plum/70">
          Try the recipient experience firsthand. When you're ready, click "Personalize This Surprise" to make one with your own names and inside jokes!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-love-pink text-white border-love-pink shadow-md scale-102"
                  : "bg-white text-love-plum/70 border-love-blush hover:bg-love-pale"
              }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Demo Container */}
      <div className="bg-love-pale/40 rounded-3xl p-4 sm:p-8 border border-love-blush/80 min-h-[500px]">
        {/* Floating Top Banner for Creator CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-love-blush shadow-xs">
          <div className="flex items-center gap-2 text-xs text-love-plum/80 font-medium">
            <Sparkles size={14} className="text-love-pink animate-spin-slow" />
            <span>Currently previewing: <strong>{tabs.find(t => t.id === activeTab)?.label}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCreator(activeTab === "habits" ? "habit_cards" : activeTab)}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold hover:shadow-md cursor-pointer"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Personalize Yours ♡
            </button>
          </div>
        </div>

        {/* Tab 1: Habit Cards */}
        {activeTab === "habits" && (
          <div className="space-y-6">
            <HabitCardPlayer
              cards={DEFAULT_DEMO_HABIT_MOMENT.payload.cards}
              partnerName={DEFAULT_DEMO_HABIT_MOMENT.partnerName}
              creatorName={DEFAULT_DEMO_HABIT_MOMENT.creatorName}
            />
          </div>
        )}

        {/* Tab 2: Secret Code */}
        {activeTab === "secret_code" && (
          <div className="space-y-6">
            <SecretCodeUnlock
              payload={DEFAULT_DEMO_SECRET_CODE.payload}
              partnerName={DEFAULT_DEMO_SECRET_CODE.partnerName}
              creatorName={DEFAULT_DEMO_SECRET_CODE.creatorName}
            />
          </div>
        )}

        {/* Tab 3: Delulu Mode */}
        {activeTab === "delulu" && (
          <div className="space-y-6">
            <DeluluStoryPlayer
              payload={DEFAULT_DEMO_DELULU_STORY.payload}
              onSaveToLore={onOpenOurSpace}
            />
          </div>
        )}

        {/* Tab 4: Open When... */}
        {activeTab === "open_when" && (
          <div className="space-y-6">
            <OpenWhenCollection
              letters={DEFAULT_DEMO_OPEN_WHEN.payload.letters}
              partnerName={DEFAULT_DEMO_OPEN_WHEN.partnerName}
              creatorName={DEFAULT_DEMO_OPEN_WHEN.creatorName}
            />
          </div>
        )}

        {/* Tab 5: Love Loop */}
        {activeTab === "love_loop" && (
          <div className="space-y-6">
            <LoveLoopComposer
              momentId="demo-love-loop"
              partnerName="Ananya"
              creatorName="Aaryan"
              promptQuestion="Now tell me... What's one tiny thing I do that makes your day better? 💗"
            />
          </div>
        )}

        {/* Tab 6: Final Reveal */}
        {activeTab === "final_reveal" && (
          <div className="space-y-6">
            <FinalReveal
              partnerName="Ananya"
              creatorName="Aaryan"
              onSaveToLore={onOpenOurSpace}
            />
          </div>
        )}
      </div>
    </div>
  );
};
