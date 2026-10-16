import React, { useState, useEffect } from "react";
import type { Surprise } from "../../types/romantic";
import {
  getAllSurprises,
  deleteSurprise,
  encodeSurprisePayload,
} from "../../data/momentStore";
import { publishSurpriseToCloud } from "../../services/apiService";
import {
  Heart,
  Share2,
  Edit3,
  Play,
  Trash2,
  Check,
  Plus,
  Calendar,
} from "lucide-react";

interface MySurprisesListProps {
  onPlaySurprise: (surprise: Surprise) => void;
  onEditSurprise: (surprise: Surprise) => void;
  onCreateNew: () => void;
}

export const MySurprisesList: React.FC<MySurprisesListProps> = ({
  onPlaySurprise,
  onEditSurprise,
  onCreateNew,
}) => {
  const [surprises, setSurprises] = useState<Surprise[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshList = () => {
    setSurprises(getAllSurprises());
  };

  useEffect(() => {
    refreshList();
    const handleUpdate = () => refreshList();
    window.addEventListener("you_and_me_surprises_changed", handleUpdate);
    return () =>
      window.removeEventListener("you_and_me_surprises_changed", handleUpdate);
  }, []);

  const handleCopyLink = async (surprise: Surprise) => {
    try {
      const res = await publishSurpriseToCloud(surprise);
      navigator.clipboard.writeText(res.url);
    } catch {
      const encoded = encodeSurprisePayload(surprise);
      const origin = window.location.origin + window.location.pathname;
      const url = `${origin}#play=${encoded}`;
      navigator.clipboard.writeText(url);
    }
    setCopiedId(surprise.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this surprise?")) {
      deleteSurprise(id);
    }
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-love-blush">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-blush text-love-deep text-xs font-bold mb-1">
            <Heart size={12} className="fill-love-deep" />
            <span>MY CREATED SURPRISES</span>
          </div>
          <h2
            className="text-2xl font-bold text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Surprises Hub
          </h2>
          <p className="text-xs text-love-plum/70">
            Edit your creations, test the recipient playback, or copy shareable links.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white font-bold text-xs sm:text-sm shadow-md shadow-love-pink/25 hover:shadow-lg transition-all cursor-pointer btn-glow"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Plus size={16} />
          <span>Create New Surprise</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {surprises.map((s) => {
          const activeCount = s.chapterOrder.filter(
            (id) => s.enabledChapters[id] !== false
          ).length;
          const isCopied = copiedId === s.id;

          return (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-5 border border-love-blush shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-love-coral mb-2">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar size={12} />
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] font-bold bg-love-pale text-love-deep px-2.5 py-0.5 rounded-full">
                    {activeCount} Chapters
                  </span>
                </div>

                <h3
                  className="text-base font-bold text-love-plum mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p className="text-xs text-love-plum/60 mb-4">
                  For: <strong className="text-love-plum">{s.recipientName}</strong> (by {s.senderName})
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-love-blush/60">
                <button
                  onClick={() => onPlaySurprise(s)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Play size={14} className="fill-white" />
                  <span>Play Linear Experience</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(s)}
                    className="flex-1 py-2 rounded-xl bg-love-pale hover:bg-love-blush text-love-deep text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
                    <span>{isCopied ? "Link Copied!" : "Copy Link"}</span>
                  </button>

                  <button
                    onClick={() => onEditSurprise(s)}
                    className="p-2 rounded-xl border border-love-blush text-love-plum/70 hover:text-love-deep hover:bg-love-pale transition-colors cursor-pointer"
                    title="Edit surprise"
                  >
                    <Edit3 size={15} />
                  </button>

                  {surprises.length > 1 && (
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-xl border border-love-blush text-love-plum/40 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete surprise"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
