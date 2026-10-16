import React, { useState } from "react";
import type {
  MomentType,
  MomentRecord,
  HabitCard,
  SecretCodePayload,
  DeluluStoryPayload,
  OpenWhenPayload,
} from "../../types/romantic";
import {
  SAMPLE_HABIT_CARDS,
  SAMPLE_OPEN_WHEN_LETTERS,
  WRONG_CODE_BANTER,
} from "../../data/romanticTemplates";
import { HabitCardBuilder } from "./HabitCardBuilder";
import { DeluluStoryBuilder } from "./DeluluStoryBuilder";
import { HabitCardPlayer } from "./HabitCardPlayer";
import { SecretCodeUnlock } from "./SecretCodeUnlock";
import { DeluluStoryPlayer } from "./DeluluStoryPlayer";
import { OpenWhenCollection } from "./OpenWhenCollection";
import {
  saveMoment,
  encodeSharePayload,
  DEFAULT_DEMO_DELULU_STORY,
} from "../../data/momentStore";
import {
  Sparkles,
  Heart,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Share2,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";

interface TinyMomentCreatorProps {
  initialType?: string;
  onClose: () => void;
  onOpenRecipientView: (moment: MomentRecord) => void;
}

export const TinyMomentCreator: React.FC<TinyMomentCreatorProps> = ({
  initialType = "habit_cards",
  onClose,
  onOpenRecipientView,
}) => {
  // Wizard steps: 1: choose feeling/feature, 2: personalize, 3: preview, 4: published/share
  const [currentStep, setCurrentStep] = useState<number>(
    initialType ? 2 : 1
  );
  const [selectedType, setSelectedType] = useState<MomentType>(
    (initialType as MomentType) || "habit_cards"
  );

  // Common couple personalization
  const [creatorName, setCreatorName] = useState("Aaryan");
  const [partnerName, setPartnerName] = useState("Ananya");
  const [momentTitle, setMomentTitle] = useState("A Little Surprise Just for You");
  const [enableLoveLoop, setEnableLoveLoop] = useState(true);
  const [loveLoopPrompt, setLoveLoopPrompt] = useState(
    "Now tell me... What's one tiny thing I do that makes you smile? 💗"
  );

  // Habit cards state
  const [habitCards, setHabitCards] = useState<HabitCard[]>(SAMPLE_HABIT_CARDS);

  // Secret code state
  const [secretCode, setSecretCode] = useState("cutie");
  const [secretClue, setSecretClue] = useState(
    "The 5-letter nickname I call you when you're being extra dramatic and soft."
  );
  const [secretHint, setSecretHint] = useState(
    "Starts with 'c', ends with 'e', rhymes with beauty! ♡"
  );
  const [secretRewardMessage, setSecretRewardMessage] = useState(
    "I knew you'd remember, my favorite person! You are the sweetest part of my everyday life. Whether we're bantering over silly inside jokes or sitting in quiet comfort, there's nobody else I'd rather share this little world with. Happy surprises, today and always. ♡"
  );

  // Delulu story state
  const [deluluStory, setDeluluStory] = useState<DeluluStoryPayload>(
    DEFAULT_DEMO_DELULU_STORY.payload
  );

  // Open When state
  const [openWhenLetters] = useState(SAMPLE_OPEN_WHEN_LETTERS);

  // Preview device toggle
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");

  // Share Link Modal state
  const [publishedMoment, setPublishedMoment] = useState<MomentRecord | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Intent feelings choices
  const feelings = [
    {
      type: "habit_cards" as MomentType,
      label: "A tiny habit I secretly love",
      tagline: "Make them feel seen and adored for small quirks.",
      emoji: "💗",
      badge: "Habit Cards",
    },
    {
      type: "secret_code" as MomentType,
      label: "Unlock a secret inside joke",
      tagline: "Playful mini-game with starry night unlock & banter.",
      emoji: "🔒",
      badge: "Secret Code",
    },
    {
      type: "delulu_story" as MomentType,
      label: "Put us in a fictional romance story",
      tagline: "Academic rivals, fake dating, or soulmates with choices.",
      emoji: "✨",
      badge: "Delulu Mode",
    },
    {
      type: "open_when" as MomentType,
      label: "Send 'Open When...' everyday letters",
      tagline: "For when they miss you, have exams, or feel down.",
      emoji: "✉️",
      badge: "Open When",
    },
  ];

  const handleSelectFeeling = (type: MomentType) => {
    setSelectedType(type);
    if (type === "habit_cards") {
      setMomentTitle("10 Tiny Things I Love About You");
    } else if (type === "secret_code") {
      setMomentTitle("A Starry Secret for " + partnerName);
    } else if (type === "delulu_story") {
      setMomentTitle("Our Story in Another Universe");
    } else if (type === "open_when") {
      setMomentTitle("Open When... Letters for " + partnerName);
    }
    setCurrentStep(2);
  };

  const buildMomentRecord = (): MomentRecord => {
    let payloadData: any = {};

    if (selectedType === "habit_cards") {
      payloadData = {
        cards: habitCards,
        coverNote: `Curated with love by ${creatorName} for ${partnerName}`,
      };
    } else if (selectedType === "secret_code") {
      payloadData = {
        code: secretCode,
        clue: secretClue,
        attemptsAllowed: 3,
        wrongBanter: WRONG_CODE_BANTER,
        hint: secretHint,
        rewardType: "letter",
        rewardTitle: "You unlocked my heart! 💖",
        rewardMessage: secretRewardMessage,
        rewardImageUrl: "/assets/images/habit_card_cute.jpg",
      } as SecretCodePayload;
    } else if (selectedType === "delulu_story") {
      payloadData = {
        ...deluluStory,
        partnerA: creatorName,
        partnerB: partnerName,
      };
    } else if (selectedType === "open_when") {
      payloadData = {
        letters: openWhenLetters,
      } as OpenWhenPayload;
    }

    return {
      id: `moment-${Date.now()}`,
      type: selectedType,
      title: momentTitle || "A Surprise from " + creatorName,
      subtitle: `Created with love for ${partnerName}`,
      creatorName,
      partnerName,
      createdAt: new Date().toISOString(),
      themeColor: "#FF5C93",
      payload: payloadData,
      hasLoveLoop: enableLoveLoop,
      loveLoopPrompt,
    };
  };

  const handlePublish = () => {
    const record = buildMomentRecord();
    saveMoment(record);
    setPublishedMoment(record);

    // Encode payload safely into URL
    const encoded = encodeSharePayload(record);
    const origin = window.location.origin + window.location.pathname;
    const fullShareUrl = `${origin}#share=${encoded}`;
    setShareUrl(fullShareUrl);

    setCurrentStep(4);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-love-blush flex flex-col max-h-[92vh] overflow-hidden animate-[fadeInLine_0.2s_ease-out]">
        {/* Creator Modal Header */}
        <div className="px-5 py-4 border-b border-love-blush flex items-center justify-between bg-gradient-to-r from-love-pale via-white to-love-pale">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-love-pink text-white shadow-xs">
              <Sparkles size={16} />
            </span>
            <div>
              <h3
                className="text-sm sm:text-base font-bold text-love-plum"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tiny Moment Creator • YOU & ME
              </h3>
              <p className="text-[11px] text-love-plum/60 font-medium">
                Step {currentStep} of 4:{" "}
                {currentStep === 1 && "Pick a Feeling"}
                {currentStep === 2 && "Personalize Your Surprise"}
                {currentStep === 3 && "Preview Recipient Experience"}
                {currentStep === 4 && "Share with Your Partner"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-love-plum/50 hover:text-love-plum p-1.5 rounded-full hover:bg-love-pale cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wizard Body Scrollable */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: CHOOSE A FEELING */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto space-y-1 mb-6">
                <h4
                  className="text-lg font-bold text-love-plum"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  What kind of surprise do you want to create?
                </h4>
                <p className="text-xs text-love-plum/70">
                  Select a feeling or format to get started. You can customize every single detail next!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {feelings.map((f) => (
                  <button
                    key={f.type}
                    type="button"
                    onClick={() => handleSelectFeeling(f.type)}
                    className="p-4 rounded-2xl border border-love-blush bg-white hover:bg-love-pale hover:border-love-pink transition-all shadow-xs hover:shadow-md cursor-pointer text-left flex items-start gap-3.5 group"
                  >
                    <span className="text-2xl p-2 rounded-xl bg-love-pale border border-love-blush/80 group-hover:scale-110 transition-transform">
                      {f.emoji}
                    </span>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-love-deep bg-love-blush px-2 py-0.5 rounded-full">
                        {f.badge}
                      </span>
                      <h5
                        className="text-xs sm:text-sm font-bold text-love-plum group-hover:text-love-deep transition-colors"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {f.label}
                      </h5>
                      <p className="text-[11px] text-love-plum/60 leading-tight">
                        {f.tagline}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALIZE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Names Card */}
              <div className="bg-love-pale/50 rounded-2xl p-4 border border-love-blush space-y-3">
                <span className="text-xs font-bold text-love-deep uppercase tracking-wider block">
                  Couple Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-love-plum block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                      placeholder="e.g. Aaryan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-love-plum block mb-1">
                      Partner's Name
                    </label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                      placeholder="e.g. Ananya"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-love-plum block mb-1">
                    Surprise Title
                  </label>
                  <input
                    type="text"
                    value={momentTitle}
                    onChange={(e) => setMomentTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                    placeholder="e.g. 10 Tiny Things I Love About You"
                  />
                </div>
              </div>

              {/* Specific Builder for Selected Type */}
              {selectedType === "habit_cards" && (
                <HabitCardBuilder
                  cards={habitCards}
                  onChange={setHabitCards}
                  partnerName={partnerName}
                />
              )}

              {selectedType === "secret_code" && (
                <div className="bg-white rounded-3xl p-5 border border-love-blush space-y-4">
                  <h4
                    className="text-xs font-bold text-love-plum uppercase tracking-wider flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Lock size={14} className="text-love-pink" />
                    <span>Secret Code Configuration</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-love-plum block mb-1">
                        Secret Code / Answer (case-insensitive)
                      </label>
                      <input
                        type="text"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        placeholder="e.g. cutie, 0214, ramen"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-love-plum block mb-1">
                        Fail-Safe Hint (revealed after attempts)
                      </label>
                      <input
                        type="text"
                        value={secretHint}
                        onChange={(e) => setSecretHint(e.target.value)}
                        placeholder="e.g. Starts with 'c', rhymes with beauty"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-love-plum block mb-1">
                      Playful Clue for {partnerName}
                    </label>
                    <input
                      type="text"
                      value={secretClue}
                      onChange={(e) => setSecretClue(e.target.value)}
                      placeholder="e.g. What I call you when you're extra dramatic..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-love-plum block mb-1">
                      The Hidden Love Message (Unlocked upon solving!)
                    </label>
                    <textarea
                      rows={3}
                      value={secretRewardMessage}
                      onChange={(e) => setSecretRewardMessage(e.target.value)}
                      placeholder="Write your secret love letter..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
                    />
                  </div>
                </div>
              )}

              {selectedType === "delulu_story" && (
                <DeluluStoryBuilder
                  story={deluluStory}
                  onChange={setDeluluStory}
                />
              )}

              {selectedType === "open_when" && (
                <div className="bg-white rounded-3xl p-5 border border-love-blush space-y-3">
                  <h4
                    className="text-xs font-bold text-love-plum uppercase tracking-wider flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Mail size={14} className="text-love-pink" />
                    <span>Open When Letters ({openWhenLetters.length} Envelopes)</span>
                  </h4>
                  <p className="text-xs text-love-plum/70">
                    Your collection includes letters for: Missing you, Exams, Need a smile, Bad day, Can't sleep, and Loved. All ready to open!
                  </p>
                </div>
              )}

              {/* Love Loop Toggle & Prompt */}
              <div className="bg-love-pale/40 rounded-2xl p-4 border border-love-blush space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-love-plum">
                      Enable Love Loop Response?
                    </p>
                    <p className="text-[11px] text-love-plum/60">
                      Allows your partner to send a private reply or reaction back to you.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableLoveLoop}
                    onChange={(e) => setEnableLoveLoop(e.target.checked)}
                    className="w-5 h-5 accent-love-pink cursor-pointer rounded"
                  />
                </div>

                {enableLoveLoop && (
                  <div className="pt-2 border-t border-love-blush/60">
                    <label className="text-xs font-semibold text-love-plum block mb-1">
                      Question Prompt for {partnerName}
                    </label>
                    <input
                      type="text"
                      value={loveLoopPrompt}
                      onChange={(e) => setLoveLoopPrompt(e.target.value)}
                      placeholder="e.g. One tiny thing I do that makes you smile? 💗"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Device switcher */}
              <div className="flex items-center justify-between bg-love-pale px-4 py-2 rounded-2xl border border-love-blush">
                <span className="text-xs font-bold text-love-plum">
                  Live Recipient Preview
                </span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-love-blush">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      previewDevice === "mobile"
                        ? "bg-love-pink text-white"
                        : "text-love-plum/70"
                    }`}
                  >
                    <Smartphone size={13} />
                    <span>Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      previewDevice === "desktop"
                        ? "bg-love-pink text-white"
                        : "text-love-plum/70"
                    }`}
                  >
                    <Monitor size={13} />
                    <span>Desktop</span>
                  </button>
                </div>
              </div>

              {/* Interactive Preview Canvas */}
              <div
                className={`mx-auto transition-all bg-love-pale/30 rounded-3xl p-4 border border-love-blush overflow-hidden ${
                  previewDevice === "mobile" ? "max-w-md" : "max-w-2xl"
                }`}
              >
                {selectedType === "habit_cards" && (
                  <HabitCardPlayer
                    cards={habitCards}
                    partnerName={partnerName}
                    creatorName={creatorName}
                    isRecipientMode={true}
                  />
                )}

                {selectedType === "secret_code" && (
                  <SecretCodeUnlock
                    payload={{
                      code: secretCode,
                      clue: secretClue,
                      attemptsAllowed: 3,
                      wrongBanter: WRONG_CODE_BANTER,
                      hint: secretHint,
                      rewardType: "letter",
                      rewardTitle: "You unlocked my heart! 💖",
                      rewardMessage: secretRewardMessage,
                      rewardImageUrl: "/assets/images/habit_card_cute.jpg",
                    }}
                    partnerName={partnerName}
                    creatorName={creatorName}
                    isRecipientMode={true}
                  />
                )}

                {selectedType === "delulu_story" && (
                  <DeluluStoryPlayer
                    payload={{
                      ...deluluStory,
                      partnerA: creatorName,
                      partnerB: partnerName,
                    }}
                    isRecipientMode={true}
                  />
                )}

                {selectedType === "open_when" && (
                  <OpenWhenCollection
                    letters={openWhenLetters}
                    partnerName={partnerName}
                    creatorName={creatorName}
                    isRecipientMode={true}
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 4: PUBLISHED / SHARE LINK MODAL */}
          {currentStep === 4 && publishedMoment && (
            <div className="text-center py-6 space-y-6 animate-[fadeInLine_0.4s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 text-love-pink flex items-center justify-center mx-auto text-3xl shadow-md shadow-pink-100">
                <Heart size={36} className="fill-love-pink animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4
                  className="text-xl sm:text-2xl font-extrabold text-love-plum"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Your surprise for {partnerName} is ready! ♡
                </h4>
                <p className="text-xs sm:text-sm text-love-plum/70 max-w-md mx-auto">
                  Copy the link below and send it on WhatsApp, iMessage, or Instagram. They can open it immediately on any device without installing anything!
                </p>
              </div>

              {/* Share URL Box */}
              <div className="max-w-md mx-auto bg-love-pale/60 rounded-2xl p-4 border border-love-blush text-left space-y-2">
                <label className="text-[11px] font-bold text-love-deep uppercase tracking-wider block">
                  Your Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-love-blush text-love-plum select-all truncate font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl bg-love-pink text-white text-xs font-bold hover:bg-love-deep transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-[10px] text-love-plum/50">
                  🔒 Encoded safely into the URL. Zero server dependencies, works 100% offline.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onOpenRecipientView(publishedMoment)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs sm:text-sm font-bold shadow-md shadow-love-pink/25 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 btn-glow"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ExternalLink size={15} />
                  <span>Test Recipient View Now</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-full bg-love-pale text-love-plum text-xs font-bold hover:bg-love-blush transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Done & Back to Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        {currentStep < 4 && (
          <div className="px-5 py-4 border-t border-love-blush bg-white flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-love-plum/70 hover:text-love-plum cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep === 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-love-pink to-love-deep text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Eye size={15} />
                <span>Preview Surprise</span>
                <ArrowRight size={14} />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-love-pink via-love-deep to-love-plum text-white text-xs sm:text-sm font-bold shadow-md shadow-love-pink/30 hover:scale-102 cursor-pointer btn-glow"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Share2 size={15} />
                <span>Publish & Get Share Link ♡</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
