import React, { useState, useEffect } from "react";
import type { MemoryEntry } from "../../types/romantic";
import {
  FolderHeart,
  Plus,
  Trash2,
  Calendar,
  Lock,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import {
  getStoredMemories,
  addMemory,
  deleteMemory,
} from "../../data/momentStore";

interface OurLittleLoreProps {
  onUseInStory?: (memory: MemoryEntry) => void;
  onOpenCreator?: () => void;
}

export const OurLittleLore: React.FC<OurLittleLoreProps> = ({
  onUseInStory,
  onOpenCreator: _onOpenCreator,
}) => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Memory Form State
  const [title, setTitle] = useState("");
  const [dateStr, setDateStr] = useState(
    new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );
  const [category, setCategory] = useState<MemoryEntry["category"]>("Memories");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const refreshMemories = () => {
    setMemories(getStoredMemories());
  };

  useEffect(() => {
    refreshMemories();
    const handleUpdate = () => refreshMemories();
    window.addEventListener("you_and_me_memories_changed", handleUpdate);
    return () =>
      window.removeEventListener("you_and_me_memories_changed", handleUpdate);
  }, []);

  const categories = [
    "All",
    "Memories",
    "Inside Jokes",
    "Photos",
    "Notes",
    "Love Loop",
  ];

  const filteredMemories = memories.filter((mem) => {
    const matchesCat =
      activeCategory === "All" || mem.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags?.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCat && matchesSearch;
  });

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newMem: MemoryEntry = {
      id: `mem-${Date.now()}`,
      title: title.trim(),
      date: dateStr.trim(),
      category,
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      tags: tags.length ? tags : undefined,
      createdAt: new Date().toISOString(),
    };

    addMemory(newMem);
    setShowAddModal(false);
    setTitle("");
    setContent("");
    setImageUrl("");
    setTagInput("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this memory from Our Little Lore?")) {
      deleteMemory(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-love-blush">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-1">
            <FolderHeart size={13} />
            <span>PRIVATE COUPLE SCRAPBOOK</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-love-plum flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>Our Little Lore</span>
            <span className="text-love-pink text-xl">♡</span>
          </h2>
          <p className="text-xs sm:text-sm text-love-plum/70">
            A private space to save your memories, inside jokes, and special milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-love-plum/60 bg-love-pale px-3 py-1.5 rounded-full border border-love-blush">
            <Lock size={12} className="text-love-pink" />
            <span>Private to you two</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white font-bold text-xs sm:text-sm shadow-md shadow-love-pink/25 hover:shadow-lg transition-all cursor-pointer btn-glow"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Plus size={16} />
            <span>Add a Memory</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-love-pink text-white border-love-pink shadow-xs"
                    : "bg-white text-love-plum/70 border-love-blush hover:bg-love-pale"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-love-plum/40"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our lore..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-love-blush focus:outline-love-pink bg-white text-love-plum placeholder-love-plum/40"
          />
        </div>
      </div>

      {/* Memories Grid (Polaroid & Card Style from reference) */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl p-8 border border-love-blush/80 space-y-3">
          <FolderHeart size={40} className="mx-auto text-love-coral/60 animate-bounce" />
          <h3
            className="text-base font-bold text-love-plum"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No memories found in "{activeCategory}"
          </h3>
          <p className="text-xs text-love-plum/60 max-w-sm mx-auto">
            Click "+ Add a Memory" above to add your first inside joke, photo milestone, or date story!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="bg-white rounded-3xl p-5 border border-love-blush shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Optional Polaroid Image */}
                {mem.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-3.5 border border-love-blush shadow-2xs bg-love-pale">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {mem.category}
                    </span>
                  </div>
                )}

                {/* Header & Date */}
                <div className="flex items-center justify-between text-xs text-love-coral font-medium mb-1.5">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar size={12} />
                    {mem.date}
                  </span>
                  {!mem.imageUrl && (
                    <span className="text-[10px] font-bold bg-love-pale text-love-deep px-2 py-0.5 rounded-full">
                      {mem.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4
                  className="text-base font-bold text-love-plum mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {mem.title}
                </h4>

                {/* Content */}
                <p
                  className="text-xs sm:text-sm text-love-plum/80 leading-relaxed font-medium mb-3"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {mem.content}
                </p>

                {/* Tags */}
                {mem.tags && mem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-love-pale text-love-plum/60 px-2 py-0.5 rounded-md font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-love-blush/60 flex items-center justify-between">
                <button
                  onClick={() => onUseInStory && onUseInStory(mem)}
                  className="text-[11px] font-bold text-love-deep hover:text-love-pink flex items-center gap-1 cursor-pointer"
                  title="Prefill details from this memory into Delulu or Habit Cards"
                >
                  <Sparkles size={12} />
                  <span>Use in a Surprise</span>
                </button>

                <button
                  onClick={() => handleDelete(mem.id)}
                  className="text-love-plum/30 hover:text-rose-500 transition-colors p-1 rounded-lg cursor-pointer"
                  title="Remove memory"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-love-blush animate-[fadeInLine_0.2s_ease-out] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-bold text-love-plum flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <FolderHeart size={18} className="text-love-pink" />
                <span>Add a New Lore Memory</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-love-plum/50 hover:text-love-plum p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-love-plum block mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. That rainy walk, You stole my hoodie"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-love-plum block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    placeholder="e.g. 14 Feb 2024"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-love-plum block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as MemoryEntry["category"])
                    }
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink text-love-plum"
                  >
                    <option value="Memories">Memories</option>
                    <option value="Inside Jokes">Inside Jokes</option>
                    <option value="Photos">Photos</option>
                    <option value="Notes">Notes</option>
                    <option value="Love Loop">Love Loop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-love-plum block mb-1">
                  What happened? What made it special?
                </label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the moment, the inside jokes, or the feelings..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-love-plum block mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/assets/images/habit_card_cute.jpg or image URL"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-love-plum block mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="cafe, late-night, funny"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-love-plum/60 hover:text-love-plum cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-love-pink to-love-deep text-white text-xs font-bold shadow-xs hover:shadow-md cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
