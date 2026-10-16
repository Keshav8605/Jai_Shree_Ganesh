import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Compass,
  FolderHeart,
  CreditCard,
  Menu,
  X,
  PlusCircle,
  Inbox,
  Music,
} from "lucide-react";
import type { ActiveView } from "../../types/romantic";
import { getStoredResponses } from "../../data/momentStore";

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenCreator: () => void;
  onToggleMusic?: () => void;
  isMusicPlaying?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  onOpenCreator,
  onToggleMusic,
  isMusicPlaying,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadResponses, setUnreadResponses] = useState(0);

  useEffect(() => {
    const checkResponses = () => {
      const resps = getStoredResponses();
      let openedMap: Record<string, boolean> = {};
      try {
        openedMap = JSON.parse(localStorage.getItem("you_and_me_opened_responses") || "{}");
      } catch {
        openedMap = {};
      }
      const unread = resps.filter((r) => !openedMap[r.id]).length;
      setUnreadResponses(unread);
    };
    checkResponses();

    const handleUpdate = () => checkResponses();
    window.addEventListener("you_and_me_responses_changed", handleUpdate);
    return () =>
      window.removeEventListener("you_and_me_responses_changed", handleUpdate);
  }, []);

  const navItems = [
    { id: "home" as ActiveView, label: "My Surprises", icon: Compass },
    { id: "our-space" as ActiveView, label: "Our Space", icon: FolderHeart },
    { id: "pricing" as ActiveView, label: "Pricing", icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-love-blush/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            onNavigate("home");
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-love-pink to-love-coral flex items-center justify-center text-white shadow-md shadow-love-pink/25 group-hover:scale-105 transition-transform">
            <Heart size={20} className="fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xl font-bold tracking-tight text-love-plum"
                style={{ fontFamily: "var(--font-display)" }}
              >
                YOU & ME
              </span>
              <span className="text-love-pink text-xs font-semibold">♡</span>
            </div>
            <p
              className="text-[11px] text-love-plum/60 hidden sm:block -mt-0.5 tracking-wide"
              style={{ fontFamily: "var(--font-handwritten)", fontSize: "14px" }}
            >
              A little world, made just for you two
            </p>
          </div>
        </button>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-love-blush/80 text-love-deep shadow-xs"
                    : "text-love-plum/70 hover:text-love-pink hover:bg-love-pale/60"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Icon size={14} className={isActive ? "text-love-deep" : "text-love-coral"} />
                {item.label}
              </button>
            );
          })}

          {/* Inbox / Replies link */}
          <button
            onClick={() => onNavigate("inbox")}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === "inbox"
                ? "bg-love-blush/80 text-love-deep"
                : "text-love-plum/70 hover:text-love-pink hover:bg-love-pale/60"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
            title="Partner replies"
          >
            <Inbox size={14} className="text-love-coral" />
            <span>Replies</span>
            {unreadResponses > 0 && (
              <span className="bg-love-pink text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                {unreadResponses}
              </span>
            )}
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Ambient Music Button */}
          {onToggleMusic && (
            <button
              onClick={onToggleMusic}
              className={`p-2 rounded-full transition-all cursor-pointer hidden sm:flex items-center justify-center border ${
                isMusicPlaying
                  ? "bg-love-blush text-love-deep border-love-pink/40 animate-pulse"
                  : "bg-white/80 text-love-plum/60 border-love-blush hover:text-love-pink"
              }`}
              title={isMusicPlaying ? "Pause music box" : "Play music box"}
              aria-label="Toggle romantic music"
            >
              <Music size={15} />
            </button>
          )}

          {/* Primary CTA: Create a Surprise */}
          <button
            onClick={onOpenCreator}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-love-pink/30 hover:shadow-lg hover:shadow-love-pink/45 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer btn-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Sparkles size={15} className="animate-spin-slow" />
            <span>Create a Surprise</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-love-plum/70 hover:text-love-pink hover:bg-love-pale/80 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-love-blush px-4 pt-3 pb-5 space-y-1 animate-[fadeInLine_0.2s_ease-out]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-love-blush text-love-deep"
                    : "text-love-plum/80 hover:bg-love-pale"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Icon size={18} className="text-love-pink" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              onNavigate("inbox");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-love-plum/80 hover:bg-love-pale cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <div className="flex items-center gap-3">
              <Inbox size={18} className="text-love-pink" />
              <span>Partner Replies</span>
            </div>
            {unreadResponses > 0 && (
              <span className="bg-love-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadResponses}
              </span>
            )}
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenCreator();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-love-pink to-love-deep text-white font-semibold text-sm shadow-md shadow-love-pink/30 flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <PlusCircle size={18} />
              <span>Create a Tiny Moment Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
