import React from "react";
import {
  CuddlingCouple,
  HuggingCouple,
  CoupleHolding,
  PandaWithPhone,
  TeddyBear,
  Panda,
  HeartIcon,
} from "../Illustrations";

export interface ArtworkOption {
  id: string;
  label: string;
  type: "illustration" | "image";
  value: string;
  previewEmoji: string;
}

export const ARTWORK_OPTIONS: ArtworkOption[] = [
  {
    id: "cuddling",
    label: "Cuddling Couple",
    type: "illustration",
    value: "cuddling",
    previewEmoji: "🧸",
  },
  {
    id: "hugging",
    label: "Warm Hug",
    type: "illustration",
    value: "hugging",
    previewEmoji: "🫂",
  },
  {
    id: "holding",
    label: "Holding Hands",
    type: "illustration",
    value: "holding",
    previewEmoji: "🤝",
  },
  {
    id: "panda_phone",
    label: "Panda on Phone",
    type: "illustration",
    value: "panda_phone",
    previewEmoji: "📱",
  },
  {
    id: "teddy",
    label: "Teddy with Heart",
    type: "illustration",
    value: "teddy",
    previewEmoji: "🐻",
  },
  {
    id: "sunset",
    label: "Sunset Lovers",
    type: "image",
    value: "/assets/images/hero_couple_sunset.jpg",
    previewEmoji: "🌅",
  },
  {
    id: "habit_photo",
    label: "Anime Couple Desk",
    type: "image",
    value: "/assets/images/habit_card_cute.jpg",
    previewEmoji: "☕",
  },
  {
    id: "anime_story",
    label: "Starlit Night",
    type: "image",
    value: "/assets/images/delulu_story_anime.jpg",
    previewEmoji: "✨",
  },
  {
    id: "starry_box",
    label: "Gift of Stars",
    type: "image",
    value: "/assets/images/starry_secret_box.jpg",
    previewEmoji: "🎁",
  },
];

interface ArtworkRendererProps {
  artworkKey?: string;
  fallbackIndex?: number;
  alt?: string;
  className?: string;
  badgeText?: string;
}

export const ArtworkRenderer: React.FC<ArtworkRendererProps> = ({
  artworkKey,
  fallbackIndex = 0,
  alt = "Romantic illustration",
  className = "w-full h-full",
  badgeText,
}) => {
  // Determine what to display
  let content: React.ReactNode = null;

  const key = artworkKey?.trim() || "";

  // 1. Direct Image URL or Data URL
  if (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("data:") ||
    key.startsWith("/assets/")
  ) {
    content = (
      <img
        src={key}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    );
  } else if (key === "cuddling" || (!key && fallbackIndex % 5 === 0)) {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4">
        <CuddlingCouple size={160} className="drop-shadow-sm" />
      </div>
    );
  } else if (key === "hugging" || (!key && fallbackIndex % 5 === 1)) {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
        <HuggingCouple size={170} className="drop-shadow-sm" />
      </div>
    );
  } else if (key === "holding" || (!key && fallbackIndex % 5 === 2)) {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-pink-50 to-rose-50 p-4">
        <CoupleHolding size={180} className="drop-shadow-sm" />
      </div>
    );
  } else if (key === "panda_phone" || (!key && fallbackIndex % 5 === 3)) {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 p-4">
        <PandaWithPhone size={140} className="drop-shadow-sm" />
      </div>
    );
  } else if (key === "teddy" || (!key && fallbackIndex % 5 === 4)) {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 p-4">
        <TeddyBear size={140} className="drop-shadow-sm" />
      </div>
    );
  } else if (key === "panda") {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <Panda size={140} className="drop-shadow-sm" />
      </div>
    );
  } else {
    // Default fallback based on fallbackIndex
    const fallbackImage =
      ARTWORK_OPTIONS[fallbackIndex % ARTWORK_OPTIONS.length];
    if (fallbackImage.type === "image") {
      content = (
        <img
          src={fallbackImage.value}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      );
    } else {
      content = (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 p-4">
          <HeartIcon size={56} className="text-love-pink animate-pulse" />
        </div>
      );
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-love-blush/60 shadow-xs bg-love-pale/30 ${className}`}
    >
      {content}
      {badgeText && (
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-love-plum shadow-2xs border border-love-blush/50">
          {badgeText}
        </div>
      )}
    </div>
  );
};
