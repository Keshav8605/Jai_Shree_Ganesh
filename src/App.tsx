import React, { useState, useEffect, useCallback } from "react";
import type { ActiveView, Surprise, MemoryEntry } from "./types/romantic";
import { Navbar } from "./components/romantic/Navbar";
import { HeroSection } from "./components/romantic/HeroSection";
import { MySurprisesList } from "./components/romantic/MySurprisesList";
import { FeaturePanels } from "./components/romantic/FeaturePanels";
import { UserFlowBar } from "./components/romantic/UserFlowBar";
import { SurprisePlayer } from "./components/romantic/SurprisePlayer";
import { UnifiedCreatorSetup } from "./components/romantic/UnifiedCreatorSetup";
import { OurLittleLore } from "./components/romantic/OurLittleLore";
import { PricingModal } from "./components/romantic/PricingModal";
import { PrivateResponsesInbox } from "./components/romantic/PrivateResponsesInbox";
import { ClassicJourneyView } from "./components/romantic/ClassicJourneyView";
import { FloatingHearts } from "./components/FloatingHearts";
import { CursorTrail } from "./components/CursorTrail";
import { MusicPlayer } from "./components/MusicPlayer";
import { loveConfig } from "./data/loveConfig";
import {
  decodeSurprisePayload,
  getSurpriseById,
  createDefaultSurprise,
  getDraftSurprise,
  DEMO_SURPRISE,
} from "./data/momentStore";
import { fetchSurpriseFromCloud } from "./services/apiService";
import { Heart, Loader2 } from "lucide-react";

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>("home");

  // State for Surprise Player (Recipient / Preview)
  const [surpriseInPlayer, setSurpriseInPlayer] = useState<Surprise | null>(null);
  const [isPlayerPreview, setIsPlayerPreview] = useState(false);
  const [isLoadingSurprise, setIsLoadingSurprise] = useState(false);
  const [surpriseLoadError, setSurpriseLoadError] = useState<string | null>(null);

  // State for Unified Creator Setup
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [creatorSurprise, setCreatorSurprise] = useState<Surprise>(() =>
    getDraftSurprise()
  );

  // Sync with URL Hash for instant zero-install recipient playback & deep-links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // 1. Full portable payload playback
      if (hash.startsWith("#play=")) {
        const encoded = hash.replace("#play=", "");
        const decoded = decodeSurprisePayload(encoded);
        if (decoded) {
          setSurpriseInPlayer(decoded);
          setIsPlayerPreview(false);
          setActiveView("recipient-player");
          return;
        }
      }

      // 2. Share ID lookup (Local cache or Cloud Backend)
      if (hash.startsWith("#surprise=")) {
        const id = hash.replace("#surprise=", "");
        const found = getSurpriseById(id);
        if (found) {
          setSurpriseInPlayer(found);
          setIsPlayerPreview(false);
          setActiveView("recipient-player");
          return;
        }

        // Fetch from shared backend across separate devices
        setIsLoadingSurprise(true);
        setSurpriseLoadError(null);
        fetchSurpriseFromCloud(id)
          .then((cloudSurprise) => {
            if (cloudSurprise) {
              setSurpriseInPlayer(cloudSurprise);
              setIsPlayerPreview(false);
              setActiveView("recipient-player");
            } else {
              setSurpriseLoadError(
                "We couldn't find this surprise universe. Please check the link or ask your favorite person to resend it ♡"
              );
            }
          })
          .catch(() => {
            setSurpriseLoadError(
              "Network error while opening surprise. Please check your connection and refresh."
            );
          })
          .finally(() => {
            setIsLoadingSurprise(false);
          });
        return;
      }

      // 3. Backwards compatibility for #share=
      if (hash.startsWith("#share=")) {
        const encoded = hash.replace("#share=", "");
        const decoded = decodeSurprisePayload(encoded);
        if (decoded) {
          setSurpriseInPlayer(decoded);
          setIsPlayerPreview(false);
          setActiveView("recipient-player");
          return;
        }
      }

      // 4. Standalone Creator navigation routes
      if (hash === "#preview") {
        const draft = getDraftSurprise();
        setSurpriseInPlayer(draft);
        setIsPlayerPreview(true);
        setActiveView("recipient-player");
      } else if (hash === "#our-space") {
        setActiveView("our-space");
      } else if (hash === "#pricing") {
        setActiveView("pricing");
      } else if (hash === "#inbox") {
        setActiveView("inbox");
      } else if (hash === "#classic-journey") {
        setActiveView("classic-journey");
      } else if (hash === "" || hash === "#home") {
        setActiveView("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = useCallback((view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (view === "home") {
      window.location.hash = "";
    } else if (view !== "recipient-player") {
      window.location.hash = view;
    }
  }, []);

  // Creator Actions
  const handleOpenCreator = useCallback((existingSurprise?: Surprise) => {
    if (existingSurprise) {
      setCreatorSurprise(existingSurprise);
    } else {
      setCreatorSurprise(getDraftSurprise());
    }
    setIsCreatorOpen(true);
  }, []);

  const handlePreviewSurprise = useCallback((surpriseToPreview: Surprise) => {
    setSurpriseInPlayer(surpriseToPreview);
    setIsPlayerPreview(true);
    setActiveView("recipient-player");
    setIsCreatorOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleExitPreview = useCallback(() => {
    setActiveView("home");
    setIsCreatorOpen(true);
  }, []);

  const handlePlaySurprise = useCallback((surpriseToPlay: Surprise) => {
    setSurpriseInPlayer(surpriseToPlay);
    setIsPlayerPreview(false);
    setActiveView("recipient-player");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleUseLoreInStory = useCallback((_mem: MemoryEntry) => {
    handleOpenCreator();
  }, [handleOpenCreator]);

  return (
    <div className="min-h-screen bg-[#FFF2F6] text-love-plum font-sans selection:bg-love-blush selection:text-love-plum relative">
      {/* Ambient Floating Hearts */}
      <FloatingHearts count={8} />

      {/* Sparkly Heart Cursor Trail */}
      {loveConfig.enableCursorTrail && <CursorTrail />}

      {/* Ambient Procedural Music Box */}
      <MusicPlayer autoStartTrigger={true} />

      {/* NAVBAR: ONLY rendered in Creator Hub mode. NEVER in Recipient Play Mode! */}
      {activeView !== "recipient-player" && activeView !== "classic-journey" && (
        <Navbar
          activeView={activeView}
          onNavigate={handleNavigate}
          onOpenCreator={() => handleOpenCreator()}
        />
      )}

      {/* MAIN VIEW ROUTING */}
      <main>
        {/* Loading state for cloud / short link lookup */}
        {isLoadingSurprise && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-[fadeInLine_0.3s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 text-love-pink flex items-center justify-center mx-auto mb-4 animate-bounce shadow-md">
              <Heart size={32} className="fill-love-pink" />
            </div>
            <h3
              className="text-lg sm:text-xl font-bold text-love-plum mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Opening Your Surprise Universe... ♡
            </h3>
            <p className="text-xs text-love-plum/60 flex items-center justify-center gap-1.5">
              <Loader2 size={13} className="animate-spin text-love-pink" />
              <span>Fetching your personalized story</span>
            </p>
          </div>
        )}

        {/* Error state if surprise link not found */}
        {surpriseLoadError && !isLoadingSurprise && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-[fadeInLine_0.3s_ease-out]">
            <div className="max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-md space-y-4">
              <span className="text-3xl block">💌</span>
              <h3 className="text-base font-bold text-love-plum" style={{ fontFamily: "var(--font-display)" }}>
                Surprise Link Notice
              </h3>
              <p className="text-xs text-love-plum/70 leading-relaxed">
                {surpriseLoadError}
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "";
                  handleNavigate("home");
                }}
                className="px-5 py-2.5 rounded-full bg-love-pink text-white text-xs font-bold cursor-pointer hover:bg-love-deep transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}

        {/* VIEW 1: CREATOR HOME HUB */}
        {activeView === "home" && !isLoadingSurprise && !surpriseLoadError && (
          <div className="animate-[fadeInLine_0.3s_ease-out]">
            <HeroSection
              onOpenCreator={() => handleOpenCreator()}
              onExploreDemos={() => handlePlaySurprise(DEMO_SURPRISE)}
            />

            {/* Persistent Surprises List (Edit, Play Linear Experience, Copy Link) */}
            <MySurprisesList
              onPlaySurprise={handlePlaySurprise}
              onEditSurprise={(s) => handleOpenCreator(s)}
              onCreateNew={() => handleOpenCreator(createDefaultSurprise("You", "My Love"))}
            />

            {/* Feature Showcase Grid (clicking opens creator setup) */}
            <FeaturePanels
              onSelectFeature={(_view) => handlePlaySurprise(DEMO_SURPRISE)}
              onOpenCreator={(_type) => handleOpenCreator()}
            />

            {/* 7-Step User Flow Bar */}
            <UserFlowBar />
          </div>
        )}

        {/* VIEW 2: RECIPIENT LINEAR STORY PLAYER (NO NAVBAR, SCREEN BY SCREEN) */}
        {activeView === "recipient-player" && surpriseInPlayer && !isLoadingSurprise && (
          <SurprisePlayer
            surprise={surpriseInPlayer}
            isPreview={isPlayerPreview}
            onExitPreview={isPlayerPreview ? handleExitPreview : undefined}
            onFinish={() => {
              if (isPlayerPreview) {
                handleExitPreview();
              } else {
                handleNavigate("home");
              }
            }}
          />
        )}

        {/* VIEW 3: OUR LITTLE LORE (CREATOR SCRAPBOOK) */}
        {activeView === "our-space" && (
          <div className="animate-[fadeInLine_0.3s_ease-out]">
            <OurLittleLore
              onUseInStory={handleUseLoreInStory}
              onOpenCreator={() => handleOpenCreator()}
            />
          </div>
        )}

        {/* VIEW 4: TRANSPARENT PRICING & PLEDGE */}
        {activeView === "pricing" && (
          <div className="animate-[fadeInLine_0.3s_ease-out]">
            <PricingModal
              onClose={() => handleNavigate("home")}
              onOpenCreator={() => handleOpenCreator()}
            />
          </div>
        )}

        {/* VIEW 5: PARTNER REPLIES INBOX */}
        {activeView === "inbox" && (
          <div className="animate-[fadeInLine_0.3s_ease-out]">
            <PrivateResponsesInbox />
          </div>
        )}

        {/* VIEW 6: PRESERVED CLASSIC 8-CHAPTER JOURNEY */}
        {activeView === "classic-journey" && (
          <div className="animate-[fadeInLine_0.3s_ease-out]">
            <ClassicJourneyView onBackToHome={() => handleNavigate("home")} />
          </div>
        )}
      </main>

      {/* UNIFIED CREATOR SETUP MODAL */}
      {isCreatorOpen && (
        <UnifiedCreatorSetup
          initialSurprise={creatorSurprise}
          onClose={() => setIsCreatorOpen(false)}
          onPreview={handlePreviewSurprise}
          onPublished={(_saved) => {}}
        />
      )}

      {/* FOOTER: Only rendered in Creator Hub mode. NEVER in Recipient Play Mode! */}
      {activeView !== "recipient-player" && activeView !== "classic-journey" && (
        <footer className="border-t border-love-blush/70 bg-white/70 backdrop-blur-md py-10 mt-16 text-center text-xs text-love-plum/70 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-base font-bold text-love-plum"
              style={{ fontFamily: "var(--font-display)" }}
            >
              YOU & ME
            </span>
            <Heart size={14} className="fill-love-pink text-love-pink" />
          </div>
          <p
            className="text-sm text-love-plum/60"
            style={{ fontFamily: "var(--font-handwritten)", fontSize: "16px" }}
          >
            A little world, made just for you two. Turn tiny moments into a big love story.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-love-plum/50 pt-2">
            <button
              onClick={() => handleNavigate("home")}
              className="hover:text-love-pink cursor-pointer font-semibold"
            >
              My Surprises Hub
            </button>
            <span>•</span>
            <button
              onClick={() => handlePlaySurprise(DEMO_SURPRISE)}
              className="hover:text-love-pink cursor-pointer"
            >
              Experience Demo Surprise
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavigate("our-space")}
              className="hover:text-love-pink cursor-pointer"
            >
              Our Little Lore
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavigate("pricing")}
              className="hover:text-love-pink cursor-pointer"
            >
              Pricing & Privacy
            </button>
          </div>
          <p className="text-[10px] text-love-plum/40 pt-1">
            Made with all our love ♡ Zero ads, 100% private to you two.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
