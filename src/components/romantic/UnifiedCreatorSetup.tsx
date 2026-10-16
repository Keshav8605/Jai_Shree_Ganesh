import React, { useState, useEffect } from "react";
import type {
  Surprise,
  ChapterId,
  MemoryEntry,
  OpenWhenLetter,
  ClassicGalleryPhoto,
  LoveLoopQuestion,
} from "../../types/romantic";
import { HabitCardBuilder } from "./HabitCardBuilder";
import { DeluluStoryBuilder } from "./DeluluStoryBuilder";
import {
  saveSurprise,
  saveDraftSurprise,
  encodeSurprisePayload,
  DEFAULT_CLASSIC_GALLERY_PHOTOS,
} from "../../data/momentStore";
import { publishSurpriseToCloud } from "../../services/apiService";
import {
  Sparkles,
  Heart,
  ArrowRight,
  ArrowLeft,
  Share2,
  Check,
  Eye,
  X,
  Copy,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  Loader2,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { optimizeImageFile } from "../../utils/imageOptimizer";

interface UnifiedCreatorSetupProps {
  initialSurprise: Surprise;
  onClose: () => void;
  onPreview: (surprise: Surprise) => void;
  onPublished: (surprise: Surprise) => void;
}

export const UnifiedCreatorSetup: React.FC<UnifiedCreatorSetupProps> = ({
  initialSurprise,
  onClose,
  onPreview,
  onPublished,
}) => {
  const [surprise, setSurprise] = useState<Surprise>(() => {
    const rawOrder = initialSurprise.chapterOrder || [];
    const cleanOrder = rawOrder
      .map((id) => (id === "classic_journey" ? "classic-journey" : id))
      .filter((id) => id !== "final_reveal" && (id as string) !== "chapter-8");
    if (!cleanOrder.includes("classic-journey")) {
      cleanOrder.push("classic-journey");
    }
    return {
      ...initialSurprise,
      chapterOrder: cleanOrder,
      enabledChapters: {
        ...initialSurprise.enabledChapters,
        "classic-journey":
          initialSurprise.enabledChapters["classic-journey"] ??
          initialSurprise.enabledChapters["classic_journey"] ??
          true,
      },
      classicJourney: {
        galleryPhotos:
          initialSurprise.classicJourney?.galleryPhotos || DEFAULT_CLASSIC_GALLERY_PHOTOS,
        galleryHeading:
          initialSurprise.classicJourney?.galleryHeading || "Little moments, big feelings",
        gallerySubtitle:
          initialSurprise.classicJourney?.gallerySubtitle || "every second with you is my favorite memory",
        finalLetterMessage:
          initialSurprise.classicJourney?.finalLetterMessage || initialSurprise.finalReveal?.message || "",
        finalLetterQuote:
          initialSurprise.classicJourney?.finalLetterQuote || initialSurprise.finalReveal?.quote || "",
        finalLetterImageUrl:
          initialSurprise.classicJourney?.finalLetterImageUrl || initialSurprise.finalReveal?.imageUrl || "",
      },
    };
  });
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMode, setPublishMode] = useState<"backend" | "supabase" | "hash_fallback">("backend");
  const [urlWarning, setUrlWarning] = useState<string | null>(null);
  const [urlLength, setUrlLength] = useState(0);

  // New lore item inputs
  const [newLoreTitle, setNewLoreTitle] = useState("");
  const [newLoreDate, setNewLoreDate] = useState("");
  const [newLoreContent, setNewLoreContent] = useState("");

  // New letter inputs
  const [newLetterTitle, setNewLetterTitle] = useState("");
  const [newLetterCategory, setNewLetterCategory] = useState<OpenWhenLetter["category"]>("love");
  const [newLetterMessage, setNewLetterMessage] = useState("");

  // Auto-save draft on every change
  useEffect(() => {
    saveDraftSurprise(surprise);
  }, [surprise]);

  const updateSurprise = (fields: Partial<Surprise>) => {
    setSurprise((prev) => {
      const next = { ...prev, ...fields };
      // Keep recipient and sender names synced across all relevant nested configs
      if (fields.senderName || fields.recipientName) {
        const rName = fields.recipientName || prev.recipientName;
        const sName = fields.senderName || prev.senderName;
        next.deluluStory = {
          ...next.deluluStory,
          partnerA: sName,
          partnerB: rName,
          realWorldClosingNote: `Okay, our delulu universe ends here. But in this universe, I'm still choosing you, ${rName}. Every single day. 💗`,
        };
        next.loveLoop = {
          ...next.loveLoop,
          promptQuestion: `Now tell me ${rName}... What's one tiny thing I do that makes you smile? 💗`,
        };
        next.finalReveal = {
          ...next.finalReveal,
          heading: `To My Favorite Person, ${rName}`,
        };
        if (next.openingChapter) {
          next.openingChapter = {
            ...next.openingChapter,
            greeting: `Hey ${rName}, my favorite person...`,
          };
        }
      }
      return next;
    });
  };

  const toggleChapter = (id: ChapterId) => {
    setSurprise((prev) => ({
      ...prev,
      enabledChapters: {
        ...prev.enabledChapters,
        [id]: !prev.enabledChapters[id],
      },
    }));
  };

  const handleMoveChapter = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= surprise.chapterOrder.length) return;
    const newOrder = [...surprise.chapterOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    setSurprise((prev) => ({ ...prev, chapterOrder: newOrder }));
  };

  const handleAddLoreMemory = () => {
    if (!newLoreTitle.trim() || !newLoreContent.trim()) return;
    const newEntry: MemoryEntry = {
      id: `lore-${Date.now()}`,
      title: newLoreTitle.trim(),
      date: newLoreDate.trim() || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      content: newLoreContent.trim(),
      category: "Memories",
      tags: ["Special", "Us"],
    };
    updateSurprise({ littleLore: [...surprise.littleLore, newEntry] });
    setNewLoreTitle("");
    setNewLoreDate("");
    setNewLoreContent("");
  };

  const handleDeleteLoreMemory = (id: string) => {
    updateSurprise({ littleLore: surprise.littleLore.filter((m) => m.id !== id) });
  };

  const handleAddOpenWhenLetter = () => {
    if (!newLetterTitle.trim() || !newLetterMessage.trim()) return;
    const newLetter: OpenWhenLetter = {
      id: `letter-${Date.now()}`,
      title: newLetterTitle.trim(),
      category: newLetterCategory,
      previewTrigger: `Open when ${newLetterTitle.trim().toLowerCase()}...`,
      letterContent: newLetterMessage.trim(),
      envelopeColor: "pink",
      waxSealEmoji: "💌",
    };
    updateSurprise({ openWhenLetters: [...surprise.openWhenLetters, newLetter] });
    setNewLetterTitle("");
    setNewLetterMessage("");
  };

  const handleDeleteOpenWhenLetter = (id: string) => {
    updateSurprise({ openWhenLetters: surprise.openWhenLetters.filter((l) => l.id !== id) });
  };

  // Love Loop Multi-Question Helpers
  const loveLoopQuestions: LoveLoopQuestion[] =
    surprise.loveLoop?.questions && surprise.loveLoop.questions.length > 0
      ? surprise.loveLoop.questions
      : [
          {
            id: "q-1",
            question:
              surprise.loveLoop?.promptQuestion ||
              `Now tell me ${surprise.recipientName}... What's one tiny thing I do that makes you smile? 💗`,
          },
        ];

  const handleAddLoveLoopQuestion = () => {
    const newQ: LoveLoopQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question: "",
    };
    const updated = [...loveLoopQuestions, newQ];
    updateSurprise({
      loveLoop: {
        ...surprise.loveLoop,
        questions: updated,
        promptQuestion: updated[0]?.question || surprise.loveLoop.promptQuestion,
      },
    });
  };

  const handleUpdateLoveLoopQuestion = (id: string, text: string) => {
    const updated = loveLoopQuestions.map((q) =>
      q.id === id ? { ...q, question: text } : q
    );
    updateSurprise({
      loveLoop: {
        ...surprise.loveLoop,
        questions: updated,
        promptQuestion: updated[0]?.question || surprise.loveLoop.promptQuestion,
      },
    });
  };

  const handleDeleteLoveLoopQuestion = (id: string) => {
    if (loveLoopQuestions.length <= 1) return;
    const updated = loveLoopQuestions.filter((q) => q.id !== id);
    updateSurprise({
      loveLoop: {
        ...surprise.loveLoop,
        questions: updated,
        promptQuestion: updated[0]?.question || "",
      },
    });
  };

  const handleMoveLoveLoopQuestion = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= loveLoopQuestions.length) return;
    const list = [...loveLoopQuestions];
    const [moved] = list.splice(index, 1);
    list.splice(target, 0, moved);
    updateSurprise({
      loveLoop: {
        ...surprise.loveLoop,
        questions: list,
        promptQuestion: list[0]?.question || "",
      },
    });
  };

  // Classic Journey Scrapbook Helpers
  const classicPhotos: ClassicGalleryPhoto[] =
    surprise.classicJourney?.galleryPhotos || DEFAULT_CLASSIC_GALLERY_PHOTOS;

  const handleAddClassicPhoto = () => {
    const newPhoto: ClassicGalleryPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: "A Sweet Memory",
      caption: "",
      imageUrl: "",
      order: classicPhotos.length + 1,
    };
    updateSurprise({
      classicJourney: {
        ...surprise.classicJourney,
        galleryPhotos: [...classicPhotos, newPhoto],
      },
    });
  };

  const handleUpdateClassicPhoto = (id: string, fields: Partial<ClassicGalleryPhoto>) => {
    const updated = classicPhotos.map((p) => (p.id === id ? { ...p, ...fields } : p));
    updateSurprise({
      classicJourney: {
        ...surprise.classicJourney,
        galleryPhotos: updated,
      },
    });
  };

  const handleDeleteClassicPhoto = (id: string) => {
    const updated = classicPhotos.filter((p) => p.id !== id);
    updateSurprise({
      classicJourney: {
        ...surprise.classicJourney,
        galleryPhotos: updated,
      },
    });
  };

  const handleMoveClassicPhoto = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= classicPhotos.length) return;
    const list = [...classicPhotos];
    const [moved] = list.splice(index, 1);
    list.splice(target, 0, moved);
    updateSurprise({
      classicJourney: {
        ...surprise.classicJourney,
        galleryPhotos: list.map((item, idx) => ({ ...item, order: idx + 1 })),
      },
    });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const publishedRecord: Surprise = {
      ...surprise,
      status: "published",
      updatedAt: new Date().toISOString(),
    };
    saveSurprise(publishedRecord);

    try {
      const result = await publishSurpriseToCloud(publishedRecord);
      setShareUrl(result.url);
      setPublishMode(result.mode);
      setUrlLength(result.urlLength);
      setUrlWarning(result.warning || null);
      setPublishedSuccess(true);
      onPublished(publishedRecord);
    } catch (err) {
      console.error("Publishing surprise failed:", err);
      const encoded = encodeSurprisePayload(publishedRecord);
      const origin = window.location.origin + window.location.pathname;
      const url = `${origin}#play=${encoded}`;
      setShareUrl(url);
      setPublishMode("hash_fallback");
      setUrlLength(url.length);
      setPublishedSuccess(true);
      onPublished(publishedRecord);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const chapterMeta: Record<string, { title: string; desc: string; emoji: string }> = {
    welcome: {
      title: "Welcome Screen",
      desc: "Warm emotional intro welcoming them with animated illustration",
      emoji: "🌸",
    },
    habit_cards: {
      title: "I Noticed This About You",
      desc: "Deck of tiny habits you secretly notice & love",
      emoji: "💗",
    },
    secret_code: {
      title: "Secret-Code Unlock",
      desc: "Starry mini-game with inside joke clue & reward",
      emoji: "🔒",
    },
    delulu_story: {
      title: "Delulu Mode Story",
      desc: "Interactive branching story with real-world reveal",
      emoji: "✨",
    },
    our_lore: {
      title: "Our Little Lore",
      desc: "Shared memories, inside jokes, and date polaroids",
      emoji: "🖼️",
    },
    open_when: {
      title: "Open When... Letters",
      desc: "Envelopes for missing you, exams, or bad days",
      emoji: "✉️",
    },
    love_loop: {
      title: "Love Loop Reply",
      desc: "Question for them to reply & react back to you",
      emoji: "🔄",
    },
    "classic-journey": {
      title: "Classic Journey",
      desc: "The complete classic love-story experience with your personal photo scrapbook, reasons, playful Yes/No, and climax letter.",
      emoji: "📖",
    },
    classic_journey: {
      title: "Classic Journey",
      desc: "The complete classic love-story experience with your personal photo scrapbook, reasons, playful Yes/No, and climax letter.",
      emoji: "📖",
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-love-blush flex flex-col max-h-[92vh] overflow-hidden animate-[fadeInLine_0.2s_ease-out]">
        {/* Creator Modal Header */}
        <header className="px-5 py-4 border-b border-love-blush flex items-center justify-between bg-gradient-to-r from-love-pale via-white to-love-pale">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-love-pink text-white shadow-xs">
              <Sparkles size={16} />
            </span>
            <div>
              <h3
                className="text-sm sm:text-base font-bold text-love-plum"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Let's Make Your Surprise • Unified Setup
              </h3>
              <p className="text-[11px] text-love-plum/60 font-medium">
                Step {activeStep} of 4:{" "}
                {activeStep === 1 && "Couple Details (Entered Once)"}
                {activeStep === 2 && "Choose & Order Chapters"}
                {activeStep === 3 && "Customize Every Chapter"}
                {activeStep === 4 && "Review, Preview & Publish"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-love-plum/50 hover:text-love-plum p-1.5 rounded-full hover:bg-love-pale cursor-pointer"
          >
            <X size={18} />
          </button>
        </header>

        {/* Wizard Body Scrollable */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* PUBLISHED SUCCESS SCREEN */}
          {publishedSuccess ? (
            <div className="text-center py-6 space-y-6 animate-[fadeInLine_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 text-love-pink flex items-center justify-center mx-auto text-3xl shadow-md shadow-pink-100">
                <Heart size={36} className="fill-love-pink animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4
                  className="text-xl sm:text-2xl font-extrabold text-love-plum"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Your surprise for {surprise.recipientName} is live! ♡
                </h4>
                <p className="text-xs sm:text-sm text-love-plum/70 max-w-md mx-auto">
                  Copy the link below and send it on WhatsApp, iMessage, or Instagram. They will experience the entire story screen-by-screen with zero login needed!
                </p>
              </div>

              {/* Status & Portability Badge */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {publishMode === "backend" || publishMode === "supabase" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Sparkles size={13} className="text-emerald-500" />
                    Portable Short Link • {urlLength} chars • Multi-Device Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    🔗 Standalone Portable URL • {urlLength.toLocaleString()} chars
                  </span>
                )}
              </div>

              {/* Warning if payload is large */}
              {urlWarning && (
                <div className="max-w-lg mx-auto bg-amber-50 border border-amber-200 rounded-xl p-3 text-left flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold block">Messaging App Notice:</span>
                    <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">{urlWarning}</p>
                  </div>
                </div>
              )}

              {/* Share URL Box */}
              <div className="max-w-lg mx-auto bg-love-pale/50 p-4 rounded-2xl border border-love-blush space-y-3">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-love-blush">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full text-xs font-mono text-love-plum/80 bg-transparent outline-none select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="shrink-0 px-3.5 py-1.5 rounded-lg bg-love-pink text-white text-xs font-bold hover:bg-love-deep transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-love-plum/60">
                  <span>🔒 Safe & private link for {surprise.recipientName}</span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`I made a little universe for you ♡ open it here: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                  >
                    <MessageCircle size={14} />
                    <span>Send via WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onPreview(surprise)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs sm:text-sm font-bold shadow-md shadow-love-pink/25 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 btn-glow"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ExternalLink size={15} />
                  <span>Launch Recipient Experience</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-full bg-love-pale text-love-plum text-xs font-bold hover:bg-love-blush transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Back to Hub
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: COUPLE BASICS (ENTERED ONCE) */}
              {activeStep === 1 && (
                <div className="space-y-5">
                  <div className="bg-love-blush/60 rounded-2xl p-4 border border-love-pink/30 text-center space-y-1">
                    <span className="text-xs font-bold text-love-deep uppercase tracking-wider">
                      One-Time Couple Setup
                    </span>
                    <p className="text-xs text-love-plum/70">
                      Enter these details once here. They will automatically personalize every habit card, story chapter, and envelope.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-love-plum block mb-1">
                        Your Name (Sender)
                      </label>
                      <input
                        type="text"
                        value={surprise.senderName}
                        onChange={(e) => updateSurprise({ senderName: e.target.value })}
                        placeholder="e.g. Aaryan"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-love-plum block mb-1">
                        Partner's Name (Recipient)
                      </label>
                      <input
                        type="text"
                        value={surprise.recipientName}
                        onChange={(e) => updateSurprise({ recipientName: e.target.value })}
                        placeholder="e.g. Ananya"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-love-plum block mb-1">
                        Surprise Title
                      </label>
                      <input
                        type="text"
                        value={surprise.title}
                        onChange={(e) => updateSurprise({ title: e.target.value })}
                        placeholder="e.g. A Little World for Ananya ♡"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-love-plum block mb-1">
                        Overall Vibe / Tone
                      </label>
                      <select
                        value={surprise.tone}
                        onChange={(e) => updateSurprise({ tone: e.target.value as Surprise["tone"] })}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20 text-love-plum"
                      >
                        <option value="cute">Cute & Heartwarming ♡</option>
                        <option value="soft">Soft & Emotional 🥺</option>
                        <option value="teasing">Playful & Teasing 😏</option>
                        <option value="dramatic">Dramatic & Romantic 🌹</option>
                        <option value="chaotic">Chaotic & Delulu ✨</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CHOOSE & ORDER CHAPTERS */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center max-w-md mx-auto space-y-1 mb-4">
                    <h4
                      className="text-base font-bold text-love-plum"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Choose which chapters to include & arrange order:
                    </h4>
                    <p className="text-xs text-love-plum/70">
                      Your recipient will experience these screens sequentially. Use the up/down arrows to reorder!
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {surprise.chapterOrder.map((chId, idx) => {
                      const meta = chapterMeta[chId] || { title: chId, desc: "", emoji: "✨" };
                      const isEnabled = surprise.enabledChapters[chId] !== false;
                      return (
                        <div
                          key={chId}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                            isEnabled
                              ? "bg-white border-love-pink shadow-xs"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-love-pale text-love-deep font-bold text-xs flex items-center justify-center border border-love-blush">
                              {idx + 1}
                            </span>
                            <span className="text-xl">{meta.emoji}</span>
                            <div>
                              <p
                                className="text-xs font-bold text-love-plum"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {meta.title}
                              </p>
                              <p className="text-[11px] text-love-plum/60">{meta.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Reorder Buttons */}
                            <div className="flex items-center bg-love-pale/60 rounded-lg p-0.5 border border-love-blush">
                              <button
                                type="button"
                                onClick={() => handleMoveChapter(idx, "up")}
                                disabled={idx === 0}
                                className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move earlier"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveChapter(idx, "down")}
                                disabled={idx === surprise.chapterOrder.length - 1}
                                className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move later"
                              >
                                <ChevronDown size={14} />
                              </button>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <span className="text-[11px] font-bold text-love-plum/70">
                                {isEnabled ? "Included" : "Skipped"}
                              </span>
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() => toggleChapter(chId)}
                                className="w-5 h-5 accent-love-pink cursor-pointer rounded"
                              />
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: CUSTOMIZE ALL CHAPTERS IN ONE PLACE */}
              {activeStep === 3 && (
                <div className="space-y-8">
                  <div className="bg-love-blush/40 rounded-2xl p-3 text-center text-xs text-love-deep font-medium">
                    ✨ Customize any chapter content below. Chapters are arranged in your exact Step 2 order!
                  </div>

                  {surprise.chapterOrder
                    .filter(
                      (id) =>
                        surprise.enabledChapters[id] !== false &&
                        id !== "final_reveal" &&
                        (id as string) !== "chapter-8"
                    )
                    .map((chId, displayIdx) => {
                      const meta = chapterMeta[chId] || { title: chId, desc: "", emoji: "✨" };
                      const chapterHeader = `Chapter ${displayIdx + 1}: ${meta.title}`;

                      if (chId === "welcome") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-4"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🌸</span>
                              <h4
                                className="text-sm font-bold text-love-plum"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {chapterHeader}
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-semibold text-love-plum block mb-1">
                                  Greeting Heading
                                </label>
                                <input
                                  type="text"
                                  value={
                                    surprise.openingChapter?.greeting ||
                                    `Hey ${surprise.recipientName}, my favorite person...`
                                  }
                                  onChange={(e) =>
                                    updateSurprise({
                                      openingChapter: {
                                        ...(surprise.openingChapter || {}),
                                        greeting: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-love-plum block mb-1">
                                  CTA Button Label
                                </label>
                                <input
                                  type="text"
                                  value={surprise.openingChapter?.ctaLabel || "Open Your Surprise ♡"}
                                  onChange={(e) =>
                                    updateSurprise({
                                      openingChapter: {
                                        ...(surprise.openingChapter || {}),
                                        ctaLabel: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-love-plum block mb-1">
                                Subtitle Message
                              </label>
                              <input
                                type="text"
                                value={
                                  surprise.openingChapter?.subtitle ||
                                  "I made a little something just for you."
                                }
                                onChange={(e) =>
                                  updateSurprise({
                                    openingChapter: {
                                      ...(surprise.openingChapter || {}),
                                      subtitle: e.target.value,
                                    },
                                  })
                                }
                                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-semibold text-love-plum">
                                  Hero Cover Photo (Optional — defaults to Cuddling Couple)
                                </label>
                                <label className="text-[11px] font-bold text-love-deep flex items-center gap-1 cursor-pointer hover:underline">
                                  <Upload size={12} />
                                  <span>Upload Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      try {
                                        const res = await optimizeImageFile(file, 400, 0.65);
                                        updateSurprise({
                                          openingChapter: {
                                            ...(surprise.openingChapter || {}),
                                            heroImageUrl: res.dataUrl,
                                          },
                                        });
                                      } catch (err) {
                                        alert(err instanceof Error ? err.message : "Upload failed");
                                      } finally {
                                        e.target.value = "";
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Or paste an image URL (https://...)"
                                  value={surprise.openingChapter?.heroImageUrl || ""}
                                  onChange={(e) =>
                                    updateSurprise({
                                      openingChapter: {
                                        ...(surprise.openingChapter || {}),
                                        heroImageUrl: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                                />
                                {surprise.openingChapter?.heroImageUrl ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSurprise({
                                        openingChapter: {
                                          ...(surprise.openingChapter || {}),
                                          heroImageUrl: "",
                                        },
                                      })
                                    }
                                    className="px-2.5 py-2 rounded-xl text-xs text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer shrink-0 font-semibold"
                                  >
                                    Remove
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (chId === "habit_cards") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">💗</span>
                              <h4
                                className="text-sm font-bold text-love-plum"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {chapterHeader} ({surprise.habitCards.length} Cards)
                              </h4>
                            </div>
                            <HabitCardBuilder
                              cards={surprise.habitCards}
                              onChange={(updatedCards) => updateSurprise({ habitCards: updatedCards })}
                              partnerName={surprise.recipientName}
                            />
                          </div>
                        );
                      }

                      if (chId === "secret_code") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🔒</span>
                                <h4
                                  className="text-sm font-bold text-love-plum"
                                  style={{ fontFamily: "var(--font-display)" }}
                                >
                                  {chapterHeader}
                                </h4>
                              </div>
                              <span className="text-[11px] font-semibold text-love-deep bg-love-pale px-2.5 py-1 rounded-full border border-love-blush">
                                Fully Customizable Screen
                              </span>
                            </div>

                            {/* Part 1: Secret Code, Clue & Hint */}
                            <div className="bg-white rounded-2xl p-4 border border-love-blush/70 space-y-3">
                              <span className="text-xs font-bold text-love-plum block uppercase tracking-wider">
                                1. Secret Key & Hints
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-love-plum block mb-1">
                                    Secret Code / Word (case-insensitive) *
                                  </label>
                                  <input
                                    type="text"
                                    value={surprise.secretUnlock.code}
                                    onChange={(e) =>
                                      updateSurprise({
                                        secretUnlock: {
                                          ...surprise.secretUnlock,
                                          code: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="e.g. COFFEE or OURSPOT"
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10 font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-love-plum block mb-1">
                                    Fail-Safe Gentle Hint
                                  </label>
                                  <input
                                    type="text"
                                    value={surprise.secretUnlock.hint || ""}
                                    onChange={(e) =>
                                      updateSurprise({
                                        secretUnlock: {
                                          ...surprise.secretUnlock,
                                          hint: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="e.g. Think about our first coffee date..."
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-semibold text-love-plum block mb-1">
                                  Playful Clue for {surprise.recipientName} *
                                </label>
                                <input
                                  type="text"
                                  value={surprise.secretUnlock.clue}
                                  onChange={(e) =>
                                    updateSurprise({
                                      secretUnlock: {
                                        ...surprise.secretUnlock,
                                        clue: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="e.g. The place where we talked until 2 AM and forgot about dinner..."
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                />
                              </div>
                            </div>

                            {/* Part 2: Secret Surprise Unlocked Screen Customization */}
                            <div className="bg-white rounded-2xl p-4 border border-love-blush/70 space-y-4">
                              <div>
                                <span className="text-xs font-bold text-love-plum block uppercase tracking-wider">
                                  2. Secret Surprise Unlocked Screen (Custom Photo & Words)
                                </span>
                                <p className="text-[11px] text-love-plum/60 mt-0.5">
                                  Customize the exact screen your partner sees immediately upon entering the correct code.
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-love-plum block mb-1">
                                    Unlocked Screen Heading
                                  </label>
                                  <input
                                    type="text"
                                    value={surprise.secretUnlock.rewardTitle}
                                    onChange={(e) =>
                                      updateSurprise({
                                        secretUnlock: {
                                          ...surprise.secretUnlock,
                                          rewardTitle: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="e.g. Secret Surprise Unlocked! 💖"
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10 font-bold"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-semibold text-love-plum block mb-1">
                                    Subtitle Message
                                  </label>
                                  <input
                                    type="text"
                                    value={surprise.secretUnlock.unlockedSubtitle || ""}
                                    onChange={(e) =>
                                      updateSurprise({
                                        secretUnlock: {
                                          ...surprise.secretUnlock,
                                          unlockedSubtitle: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder={`e.g. A private moment just for ${surprise.recipientName} ♡`}
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-semibold text-love-plum block mb-1">
                                  Decorative Badge / Caption (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={surprise.secretUnlock.decorativeCaption || ""}
                                  onChange={(e) =>
                                    updateSurprise({
                                      secretUnlock: {
                                        ...surprise.secretUnlock,
                                        decorativeCaption: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="e.g. Top Secret • For Your Eyes Only"
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                />
                              </div>

                              <div className="p-3.5 bg-love-pale/20 rounded-xl border border-love-blush/60 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <label className="text-xs font-bold text-love-plum flex items-center gap-1.5">
                                      <Sparkles size={13} className="text-love-pink" />
                                      <span>Unlocked Surprise Photo (Optional)</span>
                                    </label>
                                    <p className="text-[11px] text-love-plum/60 mt-0.5">
                                      Add a personal photo that reveals when they crack the code.
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <label className="px-3 py-1.5 rounded-xl bg-white border border-love-pink/50 text-love-deep hover:bg-love-pale text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors">
                                      <Upload size={13} className="text-love-pink" />
                                      <span>
                                        {surprise.secretUnlock.rewardImageUrl
                                          ? "Replace Photo"
                                          : "Upload Custom Photo"}
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          try {
                                            const res = await optimizeImageFile(file, 480, 0.65);
                                            updateSurprise({
                                              secretUnlock: {
                                                ...surprise.secretUnlock,
                                                rewardImageUrl: res.dataUrl,
                                              },
                                            });
                                          } catch (err) {
                                            alert(err instanceof Error ? err.message : "Upload failed");
                                          } finally {
                                            e.target.value = "";
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </label>

                                    {surprise.secretUnlock.rewardImageUrl && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateSurprise({
                                            secretUnlock: {
                                              ...surprise.secretUnlock,
                                              rewardImageUrl: "",
                                            },
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded-xl text-xs text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer font-semibold flex items-center gap-1"
                                      >
                                        <X size={13} />
                                        <span>Remove Photo</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <input
                                  type="text"
                                  placeholder="Or paste an image URL (https://...)"
                                  value={surprise.secretUnlock.rewardImageUrl || ""}
                                  onChange={(e) =>
                                    updateSurprise({
                                      secretUnlock: {
                                        ...surprise.secretUnlock,
                                        rewardImageUrl: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full text-xs px-3 py-2 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                                />

                                {surprise.secretUnlock.rewardImageUrl && (
                                  <div className="flex items-center gap-3 pt-1">
                                    <div className="w-24 h-16 rounded-xl overflow-hidden border border-love-blush shadow-2xs shrink-0">
                                      <img
                                        src={surprise.secretUnlock.rewardImageUrl}
                                        alt="Unlocked surprise preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-[11px] text-love-plum/70 font-medium">
                                      Photo attached to the unlocked card ♡
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <label className="text-xs font-semibold text-love-plum block mb-1">
                                  Main Personalized Message (Write your own words freely) *
                                </label>
                                <textarea
                                  rows={3}
                                  value={surprise.secretUnlock.rewardMessage}
                                  onChange={(e) =>
                                    updateSurprise({
                                      secretUnlock: {
                                        ...surprise.secretUnlock,
                                        rewardMessage: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Write whatever is in your heart. This private message is revealed only to them..."
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10 leading-relaxed"
                                />
                              </div>

                              <div>
                                <label className="text-xs font-semibold text-love-plum block mb-1">
                                  Closing Line / Signature (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={surprise.secretUnlock.closingLine || ""}
                                  onChange={(e) =>
                                    updateSurprise({
                                      secretUnlock: {
                                        ...surprise.secretUnlock,
                                        closingLine: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder={`e.g. Forever and always yours, ${surprise.senderName} ♡`}
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                />
                              </div>

                              {/* Live Miniature Preview of the Unlocked Screen */}
                              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1C0E28] via-[#2E143B] to-[#1F0A27] text-white border border-purple-900/50 shadow-md space-y-3">
                                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                                  <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1">
                                    <Eye size={12} />
                                    <span>Live Preview of Recipient's Unlocked Screen</span>
                                  </span>
                                  <span className="text-[10px] text-purple-200/60 font-mono">
                                    Code: {surprise.secretUnlock.code || "???"}
                                  </span>
                                </div>

                                <div className="text-center space-y-1 py-1">
                                  <span className="text-2xl animate-bounce inline-block">💖</span>
                                  <h5
                                    className="text-base font-extrabold text-pink-200"
                                    style={{ fontFamily: "var(--font-display)" }}
                                  >
                                    {surprise.secretUnlock.rewardTitle || "Secret Surprise Unlocked! 💖"}
                                  </h5>
                                  {surprise.secretUnlock.unlockedSubtitle && (
                                    <p className="text-[11px] text-purple-200/80">
                                      {surprise.secretUnlock.unlockedSubtitle}
                                    </p>
                                  )}
                                  {surprise.secretUnlock.decorativeCaption && (
                                    <div className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-pink-900/60 border border-pink-400/30 text-[9px] font-bold text-pink-200 tracking-wider uppercase">
                                      {surprise.secretUnlock.decorativeCaption}
                                    </div>
                                  )}
                                </div>

                                <div className="bg-white/95 rounded-xl p-3.5 text-love-plum border border-pink-200 shadow-md space-y-2.5">
                                  {surprise.secretUnlock.rewardImageUrl && (
                                    <div className="rounded-lg overflow-hidden aspect-[16/10] border border-love-blush">
                                      <img
                                        src={surprise.secretUnlock.rewardImageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <p className="text-xs text-love-plum/90 leading-relaxed font-medium">
                                    "{surprise.secretUnlock.rewardMessage || "Your custom message will appear here..."}"
                                  </p>
                                  <div className="pt-2 border-t border-love-blush flex items-center justify-between text-[11px] text-love-plum/70">
                                    <span
                                      style={{ fontFamily: "var(--font-handwritten)", fontSize: "15px" }}
                                      className="text-love-deep font-semibold"
                                    >
                                      {surprise.secretUnlock.closingLine || `Forever yours, ${surprise.senderName} ♡`}
                                    </span>
                                    <Heart size={12} className="fill-love-pink text-love-pink" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (chId === "delulu_story") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">✨</span>
                              <h4
                                className="text-sm font-bold text-love-plum"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {chapterHeader}
                              </h4>
                            </div>
                            <DeluluStoryBuilder
                              story={{
                                ...surprise.deluluStory,
                                partnerA: surprise.senderName,
                                partnerB: surprise.recipientName,
                              }}
                              onChange={(updatedStory) =>
                                updateSurprise({ deluluStory: updatedStory })
                              }
                            />
                          </div>
                        );
                      }

                      if (chId === "our_lore") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🖼️</span>
                                <h4
                                  className="text-sm font-bold text-love-plum"
                                  style={{ fontFamily: "var(--font-display)" }}
                                >
                                  {chapterHeader} ({surprise.littleLore.length} Memories)
                                </h4>
                              </div>
                            </div>

                            {/* Existing memories list */}
                            <div className="space-y-2">
                              {surprise.littleLore.map((mem) => (
                                <div
                                  key={mem.id}
                                  className="bg-white p-3 rounded-xl border border-love-blush flex items-center justify-between gap-3"
                                >
                                  <div>
                                    <p className="text-xs font-bold text-love-plum">{mem.title}</p>
                                    <p className="text-[10px] text-love-plum/60">{mem.date} • {mem.content}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLoreMemory(mem.id)}
                                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                                    title="Remove memory"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Add Memory Form */}
                            <div className="p-3 bg-white/70 rounded-2xl border border-love-blush/80 space-y-2">
                              <span className="text-[11px] font-bold text-love-plum block">
                                + Add a Shared Memory or Inside Joke:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Title (e.g. That rainy cafe date)"
                                  value={newLoreTitle}
                                  onChange={(e) => setNewLoreTitle(e.target.value)}
                                  className="text-xs px-3 py-2 rounded-lg border border-love-blush bg-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Date or context (e.g. November 2024)"
                                  value={newLoreDate}
                                  onChange={(e) => setNewLoreDate(e.target.value)}
                                  className="text-xs px-3 py-2 rounded-lg border border-love-blush bg-white"
                                />
                              </div>
                              <textarea
                                rows={2}
                                placeholder="What happened and why it's a core memory..."
                                value={newLoreContent}
                                onChange={(e) => setNewLoreContent(e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-love-blush bg-white"
                              />
                              <button
                                type="button"
                                onClick={handleAddLoreMemory}
                                className="px-3.5 py-1.5 rounded-lg bg-love-pink text-white text-xs font-bold hover:bg-love-deep cursor-pointer flex items-center gap-1 shadow-2xs"
                              >
                                <Plus size={13} />
                                <span>Add Memory to Lore</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (chId === "open_when") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-4"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">✉️</span>
                              <h4
                                className="text-sm font-bold text-love-plum"
                                style={{ fontFamily: "var(--font-display)" }}
                              >
                                {chapterHeader} ({surprise.openWhenLetters.length} Envelopes)
                              </h4>
                            </div>

                            {/* Letters list */}
                            <div className="space-y-2">
                              {surprise.openWhenLetters.map((letter) => (
                                <div
                                  key={letter.id}
                                  className="bg-white p-3 rounded-xl border border-love-blush flex items-center justify-between gap-3"
                                >
                                  <div>
                                    <p className="text-xs font-bold text-love-plum">{letter.title}</p>
                                    <p className="text-[10px] text-love-plum/60 truncate max-w-sm">
                                      {letter.previewTrigger}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOpenWhenLetter(letter.id)}
                                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                                    title="Remove envelope"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Add Letter Form */}
                            <div className="p-3 bg-white/70 rounded-2xl border border-love-blush/80 space-y-2">
                              <span className="text-[11px] font-bold text-love-plum block">
                                + Add a New Open When Envelope:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Envelope Title (e.g. When you miss me)"
                                  value={newLetterTitle}
                                  onChange={(e) => setNewLetterTitle(e.target.value)}
                                  className="text-xs px-3 py-2 rounded-lg border border-love-blush bg-white"
                                />
                                <select
                                  value={newLetterCategory}
                                  onChange={(e) =>
                                    setNewLetterCategory(e.target.value as OpenWhenLetter["category"])
                                  }
                                  className="text-xs px-3 py-2 rounded-lg border border-love-blush bg-white text-love-plum"
                                >
                                  <option value="love">Category: Love ♡</option>
                                  <option value="missing_you">Category: Missing You 💭</option>
                                  <option value="exams">Category: Exams & Deadlines ☕</option>
                                  <option value="bad_day">Category: Bad Day 🌙</option>
                                  <option value="motivation">Category: Motivation 🏆</option>
                                </select>
                              </div>
                              <textarea
                                rows={2}
                                placeholder="Your handwritten letter inside this envelope..."
                                value={newLetterMessage}
                                onChange={(e) => setNewLetterMessage(e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-love-blush bg-white"
                              />
                              <button
                                type="button"
                                onClick={handleAddOpenWhenLetter}
                                className="px-3.5 py-1.5 rounded-lg bg-love-pink text-white text-xs font-bold hover:bg-love-deep cursor-pointer flex items-center gap-1 shadow-2xs"
                              >
                                <Plus size={13} />
                                <span>Add Envelope</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (chId === "love_loop") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🔄</span>
                                <h4
                                  className="text-sm font-bold text-love-plum"
                                  style={{ fontFamily: "var(--font-display)" }}
                                >
                                  {chapterHeader} ({loveLoopQuestions.length} Questions)
                                </h4>
                              </div>
                              <span className="text-[11px] font-semibold text-love-deep bg-love-pale px-2.5 py-1 rounded-full border border-love-blush">
                                Multi-Question Mode
                              </span>
                            </div>

                            <p className="text-xs text-love-plum/70">
                              Add as many questions as you like for {surprise.recipientName} to answer. They can reply with text or voice note for each!
                            </p>

                            {/* Questions list */}
                            <div className="space-y-3">
                              {loveLoopQuestions.map((q, qIdx) => (
                                <div
                                  key={q.id}
                                  className="p-3.5 bg-white rounded-2xl border border-love-blush/80 shadow-2xs space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-love-plum flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-love-blush text-love-deep text-[11px] font-bold flex items-center justify-center">
                                        {qIdx + 1}
                                      </span>
                                      <span>Question #{qIdx + 1}</span>
                                    </span>

                                    <div className="flex items-center gap-2">
                                      {/* Reorder Buttons */}
                                      <div className="flex items-center bg-love-pale/60 rounded-lg p-0.5 border border-love-blush">
                                        <button
                                          type="button"
                                          onClick={() => handleMoveLoveLoopQuestion(qIdx, "up")}
                                          disabled={qIdx === 0}
                                          className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                          title="Move up"
                                        >
                                          <ChevronUp size={13} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveLoveLoopQuestion(qIdx, "down")}
                                          disabled={qIdx === loveLoopQuestions.length - 1}
                                          className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                          title="Move down"
                                        >
                                          <ChevronDown size={13} />
                                        </button>
                                      </div>

                                      {/* Delete Button */}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteLoveLoopQuestion(q.id)}
                                        disabled={loveLoopQuestions.length <= 1}
                                        className="text-rose-500 hover:text-rose-700 disabled:opacity-20 p-1 cursor-pointer disabled:cursor-not-allowed"
                                        title={
                                          loveLoopQuestions.length <= 1
                                            ? "At least one question required"
                                            : "Delete question"
                                        }
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>

                                  <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) =>
                                      handleUpdateLoveLoopQuestion(q.id, e.target.value)
                                    }
                                    placeholder="Write your question here... (e.g. What's your favorite memory of us this year?)"
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10 font-medium"
                                  />
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={handleAddLoveLoopQuestion}
                              className="px-4 py-2 rounded-xl bg-white border border-love-pink/50 text-love-deep hover:bg-love-pale text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                            >
                              <Plus size={14} className="text-love-pink" />
                              <span>Add Another Question</span>
                            </button>
                          </div>
                        );
                      }

                      if (chId === "classic-journey" || chId === "classic_journey") {
                        return (
                          <div
                            key={chId}
                            className="bg-love-pale/30 rounded-3xl p-5 border border-love-blush space-y-5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">📖</span>
                                <h4
                                  className="text-sm font-bold text-love-plum"
                                  style={{ fontFamily: "var(--font-display)" }}
                                >
                                  {chapterHeader}
                                </h4>
                              </div>
                              <span className="text-[11px] font-semibold text-love-deep bg-love-pale px-2.5 py-1 rounded-full border border-love-blush">
                                Editable Scrapbook & Climax Letter
                              </span>
                            </div>

                            <p className="text-xs text-love-plum/70 leading-relaxed">
                              Customize your personal photo scrapbook cards, playful quiz, shrinking "No" button interaction, reasons grid, and emotional final climax letter.
                            </p>

                            {/* Part 1: Scrapbook Gallery Cards */}
                            <div className="bg-white rounded-2xl p-4 border border-love-blush/70 space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-love-blush/60 pb-2">
                                <div>
                                  <span className="text-xs font-bold text-love-plum block uppercase tracking-wider">
                                    1. Personal Photo Scrapbook ({classicPhotos.length} Cards)
                                  </span>
                                  <p className="text-[11px] text-love-plum/60 mt-0.5">
                                    Add your own pictures, customize titles and captions, or remove default cards.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddClassicPhoto}
                                  className="px-3 py-1.5 rounded-xl bg-love-pink text-white text-xs font-bold hover:bg-love-deep cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                  <Plus size={13} />
                                  <span>Add Photo Card</span>
                                </button>
                              </div>

                              {/* Gallery Heading & Subtitle */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-love-plum block mb-1">
                                    Scrapbook Section Heading
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      surprise.classicJourney?.galleryHeading ??
                                      "Little moments, big feelings"
                                    }
                                    onChange={(e) =>
                                      updateSurprise({
                                        classicJourney: {
                                          ...surprise.classicJourney,
                                          galleryHeading: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="e.g. Little moments, big feelings"
                                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-love-plum block mb-1">
                                    Scrapbook Subtitle
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      surprise.classicJourney?.gallerySubtitle ??
                                      "every second with you is my favorite memory"
                                    }
                                    onChange={(e) =>
                                      updateSurprise({
                                        classicJourney: {
                                          ...surprise.classicJourney,
                                          gallerySubtitle: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="e.g. every second with you is my favorite memory"
                                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                  />
                                </div>
                              </div>

                              {/* Cards List */}
                              <div className="space-y-3">
                                {classicPhotos.map((photo, pIdx) => (
                                  <div
                                    key={photo.id}
                                    className="p-3.5 rounded-2xl bg-love-pale/20 border border-love-blush flex flex-col sm:flex-row items-start gap-3.5"
                                  >
                                    {/* Thumbnail Preview */}
                                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-white border border-love-blush shadow-2xs shrink-0 flex items-center justify-center relative group">
                                      {photo.imageUrl ? (
                                        <img
                                          src={photo.imageUrl}
                                          alt={photo.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="text-center p-2 text-love-plum/40">
                                          <Sparkles
                                            size={20}
                                            className="mx-auto mb-1 text-love-pink/50"
                                          />
                                          <span className="text-[10px] block leading-tight">
                                            Default Art
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Card Form */}
                                    <div className="flex-1 space-y-2 w-full">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-love-plum">
                                          Card #{pIdx + 1}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleMoveClassicPhoto(pIdx, "up")}
                                            disabled={pIdx === 0}
                                            className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                            title="Move earlier"
                                          >
                                            <ChevronUp size={13} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleMoveClassicPhoto(pIdx, "down")}
                                            disabled={pIdx === classicPhotos.length - 1}
                                            className="p-1 text-love-plum/70 hover:text-love-plum disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                            title="Move later"
                                          >
                                            <ChevronDown size={13} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteClassicPhoto(photo.id)}
                                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer ml-1"
                                            title="Delete photo card"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input
                                          type="text"
                                          value={photo.title}
                                          onChange={(e) =>
                                            handleUpdateClassicPhoto(photo.id, {
                                              title: e.target.value,
                                            })
                                          }
                                          placeholder="Heading / Title (e.g. My favorite place)"
                                          className="text-xs px-3 py-1.5 rounded-lg border border-love-blush bg-white font-medium"
                                        />
                                        <input
                                          type="text"
                                          value={photo.caption || ""}
                                          onChange={(e) =>
                                            handleUpdateClassicPhoto(photo.id, {
                                              caption: e.target.value,
                                            })
                                          }
                                          placeholder="Caption (e.g. Next to you, always)"
                                          className="text-xs px-3 py-1.5 rounded-lg border border-love-blush bg-white"
                                        />
                                      </div>

                                      {/* Photo Upload / Remove */}
                                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                        <label className="px-2.5 py-1 rounded-lg bg-white border border-love-pink/50 text-love-deep hover:bg-love-pale text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
                                          <Upload size={11} className="text-love-pink" />
                                          <span>
                                            {photo.imageUrl
                                              ? "Replace Photo"
                                              : "Upload Custom Photo"}
                                          </span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              try {
                                                const res = await optimizeImageFile(file, 480, 0.7);
                                                handleUpdateClassicPhoto(photo.id, {
                                                  imageUrl: res.dataUrl,
                                                });
                                              } catch (err) {
                                                alert(
                                                  err instanceof Error ? err.message : "Upload failed"
                                                );
                                              } finally {
                                                e.target.value = "";
                                              }
                                            }}
                                            className="hidden"
                                          />
                                        </label>

                                        {photo.imageUrl && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleUpdateClassicPhoto(photo.id, { imageUrl: "" })
                                            }
                                            className="px-2 py-1 rounded-lg text-[11px] text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer font-semibold flex items-center gap-1"
                                          >
                                            <X size={11} />
                                            <span>Remove Photo</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Part 2: Final Climax Letter inside Classic Journey */}
                            <div className="bg-white rounded-2xl p-4 border border-love-blush/70 space-y-3">
                              <span className="text-xs font-bold text-love-plum block uppercase tracking-wider">
                                2. Climax Love Letter & Reveal
                              </span>
                              <p className="text-[11px] text-love-plum/60">
                                This letter appears at the emotional end of the Classic Journey.
                              </p>

                              <div>
                                <label className="text-xs font-semibold text-love-plum block mb-1">
                                  Your Climax Love Letter Message
                                </label>
                                <textarea
                                  rows={4}
                                  value={
                                    surprise.classicJourney?.finalLetterMessage ??
                                    surprise.finalReveal?.message ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateSurprise({
                                      classicJourney: {
                                        ...surprise.classicJourney,
                                        finalLetterMessage: e.target.value,
                                      },
                                      finalReveal: {
                                        ...surprise.finalReveal,
                                        message: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Write your heart out..."
                                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10 leading-relaxed font-medium"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-love-plum block mb-1">
                                    Romantic Closing Quote
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      surprise.classicJourney?.finalLetterQuote ??
                                      surprise.finalReveal?.quote ??
                                      ""
                                    }
                                    onChange={(e) =>
                                      updateSurprise({
                                        classicJourney: {
                                          ...surprise.classicJourney,
                                          finalLetterQuote: e.target.value,
                                        },
                                        finalReveal: {
                                          ...surprise.finalReveal,
                                          quote: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="e.g. Every second with you is my favorite memory"
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/10"
                                  />
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-semibold text-love-plum">
                                      Optional Climax Photo
                                    </label>
                                    <label className="text-[11px] font-bold text-love-deep flex items-center gap-1 cursor-pointer hover:underline">
                                      <Upload size={12} />
                                      <span>Upload Photo</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          try {
                                            const res = await optimizeImageFile(file, 400, 0.65);
                                            updateSurprise({
                                              classicJourney: {
                                                ...surprise.classicJourney,
                                                finalLetterImageUrl: res.dataUrl,
                                              },
                                              finalReveal: {
                                                ...surprise.finalReveal,
                                                imageUrl: res.dataUrl,
                                              },
                                            });
                                          } catch (err) {
                                            alert(
                                              err instanceof Error ? err.message : "Upload failed"
                                            );
                                          } finally {
                                            e.target.value = "";
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Or paste image URL (https://...)"
                                      value={
                                        surprise.classicJourney?.finalLetterImageUrl ??
                                        surprise.finalReveal?.imageUrl ??
                                        ""
                                      }
                                      onChange={(e) =>
                                        updateSurprise({
                                          classicJourney: {
                                            ...surprise.classicJourney,
                                            finalLetterImageUrl: e.target.value,
                                          },
                                          finalReveal: {
                                            ...surprise.finalReveal,
                                            imageUrl: e.target.value,
                                          },
                                        })
                                      }
                                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                                    />
                                    {(surprise.classicJourney?.finalLetterImageUrl ||
                                      surprise.finalReveal?.imageUrl) && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateSurprise({
                                            classicJourney: {
                                              ...surprise.classicJourney,
                                              finalLetterImageUrl: "",
                                            },
                                            finalReveal: {
                                              ...surprise.finalReveal,
                                              imageUrl: "",
                                            },
                                          })
                                        }
                                        className="px-2.5 py-2 rounded-xl text-xs text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-200 cursor-pointer shrink-0 font-semibold"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                </div>
              )}

              {/* STEP 4: REVIEW & PREVIEW */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center max-w-md mx-auto space-y-1">
                    <h4
                      className="text-lg font-bold text-love-plum"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Ready to Review & Publish ♡
                    </h4>
                    <p className="text-xs text-love-plum/70">
                      Here is the summary of your continuous surprise. Click Preview to test the exact recipient experience before sharing!
                    </p>
                  </div>

                  {/* Review Checklist Card */}
                  <div className="bg-white rounded-3xl p-5 border border-love-blush shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-love-blush">
                      <div>
                        <p className="text-xs font-bold text-love-plum">
                          {surprise.title}
                        </p>
                        <p className="text-[11px] text-love-plum/60">
                          From {surprise.senderName} to {surprise.recipientName}
                        </p>
                      </div>
                      <span className="text-xs font-bold bg-love-blush text-love-deep px-3 py-1 rounded-full">
                        {
                          surprise.chapterOrder.filter(
                            (id) =>
                              surprise.enabledChapters[id] !== false &&
                              id !== "final_reveal" &&
                              (id as string) !== "chapter-8"
                          ).length
                        }{" "}
                        Chapters
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                      {surprise.chapterOrder
                        .filter(
                          (id) =>
                            surprise.enabledChapters[id] !== false &&
                            id !== "final_reveal" &&
                            (id as string) !== "chapter-8"
                        )
                        .map((id) => (
                          <div
                            key={id}
                            className="bg-love-pale/50 p-2.5 rounded-xl border border-love-blush/60 text-center"
                          >
                            <span className="text-base block mb-0.5">
                              {chapterMeta[id]?.emoji || "✨"}
                            </span>
                            <span className="font-bold text-love-plum text-[11px] block truncate">
                              {chapterMeta[id]?.title || id}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onPreview(surprise)}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-love-pale text-love-deep border border-love-pink font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      <Eye size={15} />
                      <span>Preview Surprise as Recipient</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handlePublish}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white font-bold text-xs sm:text-sm shadow-md shadow-love-pink/30 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Publishing Surprise...</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={16} />
                          <span>Publish & Get Share Link ♡</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {!publishedSuccess && (
          <footer className="px-5 py-3.5 border-t border-love-blush bg-white flex items-center justify-between">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="flex items-center gap-1 text-xs font-bold text-love-plum/70 hover:text-love-plum cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            ) : null}
          </footer>
        )}
      </div>
    </div>
  );
};
