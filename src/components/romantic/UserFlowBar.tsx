import React from "react";
import {
  Sparkles,
  LayoutGrid,
  Edit3,
  Eye,
  Share2,
  HeartHandshake,
  FolderHeart,
  ArrowRight,
} from "lucide-react";

export const UserFlowBar: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: "Land on Website",
      desc: "Beautiful, emotional homepage",
      icon: Sparkles,
      color: "#FFE4EC",
    },
    {
      num: 2,
      title: "Choose a Feature",
      desc: "Habits, Secret Code, or Delulu",
      icon: LayoutGrid,
      color: "#EBDDFB",
    },
    {
      num: 3,
      title: "Personalize",
      desc: "Names, habits, and inside jokes",
      icon: Edit3,
      color: "#FFF9F4",
    },
    {
      num: 4,
      title: "Create & Preview",
      desc: "Instant live mobile preview",
      icon: Eye,
      color: "#FFE4EC",
    },
    {
      num: 5,
      title: "Share with Partner",
      desc: "Send instant zero-install link",
      icon: Share2,
      color: "#EBDDFB",
    },
    {
      num: 6,
      title: "Partner Experiences",
      desc: "Unlocks, reads, reacts, & replies",
      icon: HeartHandshake,
      color: "#FFF9F4",
    },
    {
      num: 7,
      title: "Save & Keep Lore",
      desc: "Both save memories in Our Space",
      icon: FolderHeart,
      color: "#FFE4EC",
    },
  ];

  return (
    <section className="py-10 bg-white/60 border-y border-love-blush/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-blush text-love-deep text-xs font-bold tracking-wider uppercase mb-2">
            <span>User Flow • How it all comes together</span>
            <span>♡</span>
          </div>
          <p
            className="text-xs sm:text-sm text-love-plum/70 font-medium"
            style={{ fontFamily: "var(--font-handwritten)", fontSize: "17px" }}
          >
            A complete emotional journey from creating → surprising → experiencing → replying → saving your love story.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-2xl p-3.5 border border-love-blush/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-love-pale border border-love-coral/40 text-love-deep font-bold text-xs flex items-center justify-center">
                      {step.num}
                    </span>
                    <Icon size={14} className="text-love-coral" />
                  </div>
                  <h4
                    className="text-xs font-bold text-love-plum mb-0.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-love-plum/60 leading-tight">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-love-coral/50">
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
