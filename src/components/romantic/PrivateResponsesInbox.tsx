import React, { useState, useEffect } from "react";
import type { LoveLoopResponse } from "../../types/romantic";
import {
  Inbox,
  FolderHeart,
  Clock,
  Mic,
  MessageCircle,
  Check,
  RefreshCw,
  Gift,
  Sparkles,
  ChevronUp,
  Tag,
} from "lucide-react";
import {
  getStoredResponses,
  saveResponseToLore,
  syncResponsesWithBackend,
} from "../../data/momentStore";

const OPENED_RESPONSES_KEY = "you_and_me_opened_responses";

export const PrivateResponsesInbox: React.FC = () => {
  const [responses, setResponses] = useState<LoveLoopResponse[]>([]);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [openedIds, setOpenedIds] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(OPENED_RESPONSES_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshResponses = async () => {
    setIsSyncing(true);
    try {
      const list = await syncResponsesWithBackend();
      setResponses(list);
      const savedMap: Record<string, boolean> = {};
      list.forEach((r) => {
        if (r.savedToLore) savedMap[r.id] = true;
      });
      setSavedIds(savedMap);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshResponses();
    const handleUpdate = () => {
      const list = getStoredResponses();
      setResponses(list);
    };
    window.addEventListener("you_and_me_responses_changed", handleUpdate);
    return () =>
      window.removeEventListener("you_and_me_responses_changed", handleUpdate);
  }, []);

  const handleSaveLore = (id: string) => {
    saveResponseToLore(id);
    setSavedIds((prev) => ({ ...prev, [id]: true }));
  };

  const handleToggleOpenGift = (id: string) => {
    setOpenedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(OPENED_RESPONSES_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("you_and_me_responses_changed"));
      return next;
    });
  };

  const unreadCount = responses.filter((r) => !openedIds[r.id]).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-love-blush flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-blush text-love-deep text-xs font-bold mb-1">
            <Inbox size={13} />
            <span>PRIVATE REPLIES INBOX</span>
            {unreadCount > 0 && (
              <span className="bg-love-pink text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full motion-reduce:animate-none animate-bounce">
                {unreadCount} new gift{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <h2
            className="text-2xl font-extrabold text-love-plum flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>Partner Replies & Love Loops</span>
            <span className="text-love-pink">♡</span>
          </h2>
          <p className="text-xs sm:text-sm text-love-plum/70">
            Gift-wrapped messages, answers, and voice recordings sent by your partner from shared surprises.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshResponses}
          disabled={isSyncing}
          className="px-3.5 py-2 rounded-xl border border-love-blush bg-white hover:bg-love-pale text-love-plum text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <RefreshCw size={13} className={isSyncing ? "animate-spin text-love-pink" : "text-love-deep"} />
          <span>{isSyncing ? "Syncing..." : "Sync Replies"}</span>
        </button>
      </div>

      {/* Responses List */}
      {responses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl p-8 border border-love-blush space-y-3">
          <MessageCircle size={40} className="mx-auto text-love-coral/50" />
          <h3
            className="text-base font-bold text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No partner replies yet
          </h3>
          <p className="text-xs text-love-plum/60 max-w-sm mx-auto">
            When you send a surprise with a Love Loop or Open When letters enabled, your partner's answers and reactions will arrive here gift-wrapped!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {responses.map((resp) => {
            const isSaved = savedIds[resp.id];
            const isOpened = !!openedIds[resp.id];
            const isQuickReply = resp.type === "quick-reply";

            return (
              <div
                key={resp.id}
                className="bg-white rounded-3xl border border-love-blush shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {!isOpened ? (
                  /* GIFT-WRAPPED UNOPENED CARD */
                  <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFEBF2] text-center space-y-4 relative overflow-hidden border-2 border-dashed border-love-pink/40">
                    {/* Decorative Ribbon Lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-love-pink/15 pointer-events-none" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-love-pink/15 pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-love-pink to-love-deep text-white flex items-center justify-center mx-auto text-3xl shadow-md shadow-love-pink/30 motion-reduce:animate-none animate-pulse">
                        <Gift size={32} />
                      </div>

                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-love-blush text-love-deep border border-love-pink/30 uppercase tracking-wider">
                          <Sparkles size={11} />
                          <span>Special Delivery for You</span>
                        </span>
                        <h4
                          className="text-lg sm:text-xl font-bold text-love-plum pt-1"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          A Gift from {resp.partnerName || "Your Partner"} ♡
                        </h4>
                        <p className="text-xs text-love-plum/60 flex items-center justify-center gap-1">
                          <Clock size={11} />
                          <span>Received {new Date(resp.createdAt).toLocaleString()}</span>
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleToggleOpenGift(resp.id)}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs sm:text-sm font-bold shadow-md shadow-love-pink/30 hover:scale-102 active:scale-98 transition-all cursor-pointer btn-glow inline-flex items-center gap-2"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          <Gift size={16} />
                          <span>Open Your Gift 🎁</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* UNWRAPPED / OPENED GIFT CONTENT */
                  <div className="p-5 sm:p-6 space-y-4 animate-[fadeInLine_0.3s_ease-out]">
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-love-blush/60">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{resp.reaction || "💗"}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-sm font-bold text-love-plum"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              From: {resp.partnerName || "My Love"}
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-love-pale text-love-deep border border-love-blush">
                              <Tag size={10} />
                              <span>{isQuickReply ? "Quick Reply" : "Love Loop"}</span>
                            </span>
                          </div>
                          <p className="text-[10px] text-love-plum/50 flex items-center gap-1 mt-0.5">
                            <Clock size={11} />
                            <span>{new Date(resp.createdAt).toLocaleString()}</span>
                            {resp.surpriseId && (
                              <span className="ml-1 text-love-plum/40">• Surprise #{resp.surpriseId.slice(-6)}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleOpenGift(resp.id)}
                          className="text-[11px] font-semibold text-love-plum/60 hover:text-love-plum px-2.5 py-1 rounded-lg border border-love-blush hover:bg-love-pale transition-colors flex items-center gap-1 cursor-pointer"
                          title="Wrap back into a gift card"
                        >
                          <ChevronUp size={12} />
                          <span>Re-wrap Gift</span>
                        </button>

                        <button
                          onClick={() => handleSaveLore(resp.id)}
                          disabled={isSaved}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isSaved
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-love-pale text-love-deep hover:bg-love-blush"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check size={12} />
                              <span>Saved to Lore</span>
                            </>
                          ) : (
                            <>
                              <FolderHeart size={12} />
                              <span>Save to Lore</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Question by question answers (Love Loop Multi-Question) */}
                    {resp.answers && resp.answers.length > 0 ? (
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-love-plum/80 uppercase tracking-wider block">
                          Love Loop Answers ({resp.answers.length} Questions):
                        </span>
                        <div className="space-y-2.5">
                          {resp.answers.map((ans, idx) => (
                            <div
                              key={ans.questionId || idx}
                              className="bg-love-pale/35 rounded-2xl p-3.5 border border-love-blush/60 space-y-1.5"
                            >
                              <div className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-love-blush text-love-deep text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <p className="text-xs font-bold text-love-plum">
                                  {ans.questionText || `Question #${idx + 1}`}
                                </p>
                              </div>
                              <p className="text-xs sm:text-sm text-love-plum/90 font-medium pl-7 leading-relaxed">
                                "{ans.answerText || "(No written text)"}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Single Message Body (Quick Reply or legacy text) */}
                    {resp.text && (!resp.answers || resp.answers.length === 0) && (
                      <div className="bg-love-pale/50 rounded-2xl p-4 border border-love-blush/60">
                        <p
                          className="text-sm sm:text-base text-love-plum font-medium leading-relaxed"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          "{resp.text}"
                        </p>
                      </div>
                    )}

                    {/* Playable Real Audio Note Player */}
                    {resp.audioUrl ? (
                      <div className="p-3.5 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl border border-purple-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                          <span className="flex items-center gap-1.5">
                            <Mic size={14} className="text-purple-600 motion-reduce:animate-none animate-pulse" />
                            <span>Voice Note Recording {resp.voiceDuration ? `(${resp.voiceDuration})` : ""}</span>
                          </span>
                          <span className="text-[10px] text-purple-700 font-semibold bg-white/80 px-2 py-0.5 rounded-full border border-purple-200">
                            Playable Audio
                          </span>
                        </div>
                        <audio
                          controls
                          src={resp.audioUrl}
                          className="w-full h-10 rounded-lg outline-none"
                        />
                      </div>
                    ) : resp.voiceDuration ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                        <Mic size={13} />
                        <span>Voice Note Attached ({resp.voiceDuration})</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

