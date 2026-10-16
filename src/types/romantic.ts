export type CardTone = "cute" | "funny" | "soft" | "dramatic";

export interface HabitCard {
  id: string;
  category: string;
  shortTitle: string;
  whatYouDo?: string;
  whyILoveIt?: string;
  myMessage?: string;
  habitText: string;
  tone: CardTone;
  reactionNote?: string;
  imageUrl?: string;
  accentColor?: string;
}

export interface OpeningChapterConfig {
  greeting: string;
  subtitle: string;
  heroImageUrl?: string;
  ctaLabel: string;
  tinyNote?: string;
}

export interface SecretCodeConfig {
  code: string;
  clue: string;
  hint?: string;
  maxAttempts: number;
  wrongBanter: string[];
  rewardTitle: string;
  unlockedSubtitle?: string;
  rewardMessage: string;
  rewardImageUrl?: string;
  closingLine?: string;
  decorativeCaption?: string;
}

export interface DeluluChoice {
  id: string;
  label: string;
  nextChapterId: string;
  vibeReaction?: string;
}

export interface DeluluChapter {
  id: string;
  chapterNumber: number;
  title: string;
  sceneText: string;
  sceneImageUrl?: string;
  imageUrl?: string;
  choices?: DeluluChoice[];
  isEnding?: boolean;
  endingTitle?: string;
  realWorldMessage?: string;
}

export interface DeluluStoryConfig {
  tropeId: string;
  tropeTitle: string;
  partnerA?: string;
  partnerB?: string;
  customPremise?: string;
  characterVibe?: string;
  realHabit: string;
  insideJoke: string;
  tone: "cute" | "chaotic" | "dramatic" | "dreamy" | "emotional";
  chapters: Record<string, DeluluChapter>;
  initialChapterId: string;
  realWorldClosingNote: string;
  coverImageUrl?: string;
}

export interface OpenWhenLetter {
  id: string;
  category: "all" | "love" | "motivation" | "missing_you" | "exams" | "bad_day" | "custom";
  categoryLabel?: string;
  title: string;
  emoji?: string;
  color?: string;
  message?: string;
  attachedPhotoUrl?: string;
  previewTrigger?: string;
  letterContent?: string;
  envelopeColor?: string;
  waxSealEmoji?: string;
}

export interface LoreMemory {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
}

export interface LoveLoopQuestion {
  id: string;
  question: string;
}

export interface LoveLoopAnswer {
  questionId: string;
  questionText: string;
  answer: string;
  answerText?: string;
}

export interface LoveLoopConfig {
  enabled: boolean;
  promptQuestion: string;
  questions?: LoveLoopQuestion[];
  subtext?: string;
  allowText: boolean;
  allowReactions: boolean;
  allowVoice: boolean;
}

export interface ClassicGalleryPhoto {
  id: string;
  src?: string;
  imageUrl?: string;
  title?: string;
  caption: string;
  note?: string;
  rotation?: number;
  order?: number;
}

export interface ClassicJourneyConfig {
  galleryHeading?: string;
  gallerySubtitle?: string;
  galleryPhotos?: ClassicGalleryPhoto[];
  finalLetterMessage?: string;
  finalLetterQuote?: string;
  finalLetterImageUrl?: string;
}

export interface FinalRevealConfig {
  heading?: string;
  message: string;
  quote?: string;
  style: string;
  imageUrl?: string;
}

export type ChapterId =
  | "welcome"
  | "secret_code"
  | "habit_cards"
  | "delulu_story"
  | "our_lore"
  | "open_when"
  | "love_loop"
  | "classic-journey"
  | "classic_journey"
  | "final_reveal";

/**
 * CANONICAL SURPRISE MODEL
 * One unified creation object configured by the sender once.
 * The recipient player reads from this object sequentially without asking for re-personalization.
 */
export interface Surprise {
  id: string;
  shareId: string;
  status: "draft" | "published";
  senderName: string;
  recipientName: string;
  nicknames?: string[];
  tone: "cute" | "soft" | "teasing" | "dramatic" | "chaotic";
  theme: string;
  title: string;
  welcomeSubtitle?: string;

  // Opening Chapter config (restoring base experience)
  openingChapter: OpeningChapterConfig;

  chapterOrder: ChapterId[];
  enabledChapters: Record<ChapterId, boolean>;
  habitCards: HabitCard[];
  secretUnlock: SecretCodeConfig;
  deluluStory: DeluluStoryConfig;
  loveLoop: LoveLoopConfig;
  littleLore: LoreMemory[];
  openWhenLetters: OpenWhenLetter[];
  finalReveal: FinalRevealConfig;
  classicJourney?: ClassicJourneyConfig;
  createdAt: string;
  updatedAt?: string;
}

export interface RecipientResponse {
  id: string;
  type?: "love-loop" | "quick-reply" | "voice-note";
  surpriseId?: string;
  momentId?: string;
  recipientName?: string;
  partnerName?: string;
  context?: string;
  text?: string;
  answers?: LoveLoopAnswer[];
  reaction?: string;
  voiceDuration?: string;
  audioUrl?: string;
  createdAt: string;
  savedToLore?: boolean;
}

// Keeping aliases for backwards compatibility with existing standalone subcomponents
export type HabitCardsPayload = { cards: HabitCard[]; coverNote?: string };
export type SecretCodePayload = {
  code: string;
  clue: string;
  attemptsAllowed: number;
  wrongBanter: string[];
  hint: string;
  rewardType: "letter" | "photo" | "voice_note";
  rewardTitle: string;
  unlockedSubtitle?: string;
  rewardMessage: string;
  rewardImageUrl?: string;
  closingLine?: string;
  decorativeCaption?: string;
};
export type DeluluStoryPayload = DeluluStoryConfig & {
  partnerA: string;
  partnerB: string;
};
export type OpenWhenPayload = { letters: OpenWhenLetter[] };
export type LoveLoopResponse = RecipientResponse;
export type MemoryEntry = LoreMemory;
export type MomentType = string;
export type MomentRecord = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  creatorName: string;
  partnerName: string;
  createdAt: string;
  themeColor?: string;
  payload: any;
  hasLoveLoop?: boolean;
  loveLoopPrompt?: string;
};

export type ActiveView =
  | "home"
  | "creator"
  | "recipient-player"
  | "recipient-view"
  | "surprises"
  | "delulu"
  | "inbox"
  | "our-space"
  | "pricing"
  | "classic-journey";
