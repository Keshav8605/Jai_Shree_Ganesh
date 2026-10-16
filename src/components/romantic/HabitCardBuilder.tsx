import React, { useState } from "react";
import type { HabitCard, CardTone } from "../../types/romantic";
import { HABIT_CATEGORIES } from "../../data/romanticTemplates";
import { ARTWORK_OPTIONS, ArtworkRenderer } from "./ArtworkRenderer";
import { optimizeImageFile } from "../../utils/imageOptimizer";
import {
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Check,
} from "lucide-react";

interface HabitCardBuilderProps {
  cards: HabitCard[];
  onChange: (updatedCards: HabitCard[]) => void;
  partnerName: string;
}

export const HabitCardBuilder: React.FC<HabitCardBuilderProps> = ({
  cards,
  onChange,
  partnerName,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(
    cards[0]?.id || ""
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const activeIndex = Math.max(
    0,
    cards.findIndex((c) => c.id === selectedCardId)
  );
  const activeCard = cards[activeIndex] || cards[0];

  const handleUpdateCard = (fields: Partial<HabitCard>) => {
    if (!activeCard) return;
    const updated = cards.map((c) =>
      c.id === activeCard.id ? { ...c, ...fields } : c
    );
    onChange(updated);
  };

  // 1. Add preset card
  const handleAddPresetCard = () => {
    const nextCategory =
      HABIT_CATEGORIES[cards.length % HABIT_CATEGORIES.length];
    const newCard: HabitCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: nextCategory.label,
      shortTitle: nextCategory.short,
      whatYouDo: "",
      habitText: nextCategory.defaultCopy,
      whyILoveIt: "",
      myMessage: "",
      tone: nextCategory.tone,
      reactionNote: "A tiny detail I love about you ♡",
      imageUrl: "",
    };
    const updated = [...cards, newCard];
    onChange(updated);
    setSelectedCardId(newCard.id);
  };

  // 2. Add blank / custom card (Genuinely blank, zero forced presets)
  const handleAddBlankCard = () => {
    const cardNum = cards.length + 1;
    const newCard: HabitCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: "Personal Detail",
      shortTitle: `Habit #${cardNum}`,
      whatYouDo: "",
      habitText: "",
      whyILoveIt: "",
      myMessage: "",
      tone: "cute",
      reactionNote: "",
      imageUrl: "",
    };
    const updated = [...cards, newCard];
    onChange(updated);
    setSelectedCardId(newCard.id);
  };

  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) return;
    const updated = cards.filter((c) => c.id !== id);
    onChange(updated);
    if (selectedCardId === id) {
      setSelectedCardId(updated[0]?.id || "");
    }
  };

  // Reordering cards
  const handleMoveCard = (fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= cards.length) return;
    const updated = [...cards];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  const handleApplyPreset = (preset: (typeof HABIT_CATEGORIES)[0]) => {
    handleUpdateCard({
      category: preset.label,
      shortTitle: preset.short,
      habitText: preset.defaultCopy,
      tone: preset.tone,
    });
  };

  // Handle local image file upload with automatic resizing and compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadNotice(null);
    setIsOptimizing(true);
    try {
      const result = await optimizeImageFile(file, 360, 0.65);
      handleUpdateCard({ imageUrl: result.dataUrl });
      setUploadNotice(
        `Optimized photo (${result.originalSizeKb}KB → ${result.compressedSizeKb}KB) for fast loading ♡`
      );
      setTimeout(() => setUploadNotice(null), 3500);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to process photo"
      );
      setTimeout(() => setUploadError(null), 4000);
    } finally {
      setIsOptimizing(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    handleUpdateCard({ imageUrl: "" });
    setUploadNotice("Custom photo removed. Reverted to lovely artwork preset!");
    setTimeout(() => setUploadNotice(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Deck Pill Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className="text-xs font-bold text-love-plum uppercase tracking-wider">
            Your Habit Cards Deck ({cards.length})
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddBlankCard}
              className="flex items-center gap-1 text-xs font-bold bg-white px-2.5 py-1 rounded-full border border-love-pink/50 text-love-deep hover:bg-love-pale cursor-pointer transition-colors shadow-2xs"
            >
              <FileText size={13} className="text-love-pink" />
              <span>+ Blank Card</span>
            </button>
            <button
              type="button"
              onClick={handleAddPresetCard}
              className="flex items-center gap-1 text-xs font-bold bg-love-pink text-white px-2.5 py-1 rounded-full hover:bg-love-deep cursor-pointer transition-colors shadow-2xs"
            >
              <Plus size={13} />
              <span>+ Preset Idea</span>
            </button>
          </div>
        </div>

        {/* Scrollable list of cards in deck */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {cards.map((card, idx) => {
            const isSelected = card.id === activeCard?.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCardId(card.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-love-pink text-white border-love-pink shadow-xs scale-102"
                    : "bg-white text-love-plum/70 border-love-blush hover:bg-love-pale hover:text-love-plum"
                }`}
              >
                <span>#{idx + 1}</span>
                <span className="text-love-blush/60 font-normal">—</span>
                <span className="truncate max-w-[120px]">
                  {card.shortTitle || `Card #${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Panel for Selected Card */}
      {activeCard && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-love-blush shadow-sm space-y-5">
          {/* Header & Reordering Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-love-blush/60">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-love-pale text-love-deep font-bold text-xs">
                #{activeIndex + 1}
              </span>
              <h4
                className="text-sm font-bold text-love-plum flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Edit3 size={15} className="text-love-pink" />
                <span className="truncate max-w-[160px] sm:max-w-xs">
                  {activeCard.shortTitle || `Card #${activeIndex + 1}`}
                </span>
              </h4>

              {/* Saved indicator */}
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check size={12} />
                <span>Saved</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Move Left / Right buttons */}
              <div className="flex items-center bg-love-pale/50 rounded-lg p-0.5 border border-love-blush">
                <button
                  type="button"
                  onClick={() => handleMoveCard(activeIndex, "left")}
                  disabled={activeIndex === 0}
                  className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Move card earlier"
                >
                  <ArrowLeft size={13} />
                </button>
                <span className="text-[10px] px-1 font-semibold text-love-plum/60">Reorder</span>
                <button
                  type="button"
                  onClick={() => handleMoveCard(activeIndex, "right")}
                  disabled={activeIndex === cards.length - 1}
                  className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  title="Move card later"
                >
                  <ArrowRight size={13} />
                </button>
              </div>

              {cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteCard(activeCard.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md hover:bg-rose-50"
                  title="Delete this card"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Presets Inspiration */}
          <div>
            <label className="text-[11px] font-semibold text-love-plum/60 block mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-love-pink" />
              <span>Inspiration Presets (click to autofill starter copy):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HABIT_CATEGORIES.map((cat) => {
                const isCurrent = activeCard.category === cat.label;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleApplyPreset(cat)}
                    className={`p-2 rounded-xl text-[11px] font-semibold text-left transition-all cursor-pointer border ${
                      isCurrent
                        ? "bg-love-blush text-love-deep border-love-pink"
                        : "bg-love-pale/40 text-love-plum/80 border-love-blush/60 hover:bg-love-blush/40"
                    }`}
                  >
                    <p className="truncate font-bold">{cat.short}</p>
                    <p className="text-[9px] text-love-plum/50 truncate">{cat.tone}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Artwork & Photo Section (Upload, Preview, Replace, Remove) */}
          <div className="p-4 bg-love-pale/30 rounded-2xl border border-love-blush/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-love-plum flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-love-pink" />
                  <span>Card Photo (Optional — displayed at top of card)</span>
                </label>
                <p className="text-[11px] text-love-plum/60 mt-0.5">
                  Upload your own photo or pick an illustration preset below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-white border border-love-pink/50 text-love-deep hover:bg-love-pale text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors">
                  {isOptimizing ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-love-pink" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={13} className="text-love-pink" />
                      <span>{activeCard.imageUrl ? "Replace Photo" : "Upload Custom Photo"}</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isOptimizing}
                    className="hidden"
                  />
                </label>

                {activeCard.imageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-2.5 py-1.5 rounded-xl text-xs text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer font-semibold flex items-center gap-1"
                  >
                    <X size={13} />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notifications */}
            {uploadNotice && (
              <p className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-medium">
                {uploadNotice}
              </p>
            )}
            {uploadError && (
              <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-medium">
                {uploadError}
              </p>
            )}

            {/* Photo Preview */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-love-blush/60">
              <div className="w-20 h-16 rounded-lg overflow-hidden border border-love-blush shrink-0 bg-love-pale/30">
                <ArtworkRenderer
                  artworkKey={activeCard.imageUrl}
                  fallbackIndex={activeIndex}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-love-plum">
                  {activeCard.imageUrl?.startsWith("data:")
                    ? "Custom Uploaded Photo ♡"
                    : activeCard.imageUrl
                    ? "Selected Artwork Preset"
                    : "No photo uploaded — Using romantic illustration"}
                </p>
                <p className="text-[11px] text-love-plum/60 mt-0.5">
                  {activeCard.imageUrl
                    ? "This photo will appear above your written habit statements in recipient playback."
                    : "Optional. You can upload a photo, pick an illustration preset below, or continue without one."}
                </p>
              </div>
            </div>

            {/* Artwork Presets Selector */}
            <div>
              <label className="text-[11px] font-semibold text-love-plum/70 block mb-1.5">
                Or pick an illustration preset:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {ARTWORK_OPTIONS.map((opt) => {
                  const isSelected = activeCard.imageUrl === opt.value;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleUpdateCard({ imageUrl: opt.value })}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-love-blush border-love-pink shadow-xs scale-102"
                          : "bg-white border-love-blush/70 hover:bg-love-pale/50"
                      }`}
                    >
                      <div className="text-xl mb-1">{opt.previewEmoji}</div>
                      <p className="text-[10px] font-bold text-love-plum truncate">{opt.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card Headers: Category & Short Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-love-plum block mb-1">
                Category Pill Label
              </label>
              <input
                type="text"
                value={activeCard.category}
                onChange={(e) => handleUpdateCard({ category: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                placeholder="e.g. A tiny habit I secretly love"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-love-plum block mb-1">
                Card Short Title
              </label>
              <input
                type="text"
                value={activeCard.shortTitle}
                onChange={(e) => handleUpdateCard({ shortTitle: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                placeholder="e.g. Your happy food dance"
              />
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              Tone & Vibe
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["cute", "funny", "soft", "dramatic"] as CardTone[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleUpdateCard({ tone: t })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border text-center ${
                    activeCard.tone === t
                      ? "bg-love-pink text-white border-love-pink shadow-xs"
                      : "bg-love-pale/40 text-love-plum/70 border-love-blush hover:bg-love-blush/60"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Main Habit Story */}
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              The Detail / Habit Story for {partnerName || "Your Partner"} *
            </label>
            <textarea
              rows={3}
              value={activeCard.habitText}
              onChange={(e) => handleUpdateCard({ habitText: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20 text-love-plum leading-relaxed"
              placeholder="Describe the sweet habit they have, what happens, and how it makes you smile..."
            />
          </div>

          {/* Freeform Creator Fields: What they do & Why I love it */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-love-plum block mb-1">
                What you do (Optional prompt)
              </label>
              <input
                type="text"
                value={activeCard.whatYouDo || ""}
                onChange={(e) => handleUpdateCard({ whatYouDo: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                placeholder="e.g. Taking my hoodie and never returning it"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-love-plum block mb-1">
                Why I secretly love it (Optional)
              </label>
              <input
                type="text"
                value={activeCard.whyILoveIt || ""}
                onChange={(e) => handleUpdateCard({ whyILoveIt: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                placeholder="e.g. Because you look so cozy in it"
              />
            </div>
          </div>

          {/* Personal Whisper Note & Reaction Whisper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-love-plum block mb-1">
                Personal Whisper Note (Optional)
              </label>
              <input
                type="text"
                value={activeCard.myMessage || ""}
                onChange={(e) => handleUpdateCard({ myMessage: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                placeholder="e.g. (You're never getting away with this)"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-love-plum block mb-1">
                Teasing Closing Note (Optional)
              </label>
              <input
                type="text"
                value={activeCard.reactionNote || ""}
                onChange={(e) => handleUpdateCard({ reactionNote: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                placeholder="e.g. Stop looking so closely! 😭"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
