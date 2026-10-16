import type {
  Surprise,
  RecipientResponse,
  LoreMemory,
  ChapterId,
  ClassicGalleryPhoto,
  ClassicJourneyConfig,
  LoveLoopConfig,
} from "../types/romantic";
import {
  SAMPLE_HABIT_CARDS,
  SAMPLE_OPEN_WHEN_LETTERS,
  INITIAL_MEMORIES,
  WRONG_CODE_BANTER,
} from "./romanticTemplates";

const STORAGE_KEYS = {
  SURPRISES: "you_and_me_surprises_v2",
  SURPRISE_DRAFT: "you_and_me_surprise_draft_v2",
  RESPONSES: "you_and_me_responses_v2",
  MEMORIES: "you_and_me_memories_v2",
};

export const DEFAULT_CHAPTER_ORDER: ChapterId[] = [
  "welcome",
  "habit_cards",
  "secret_code",
  "delulu_story",
  "our_lore",
  "open_when",
  "love_loop",
  "classic-journey",
];

export const DEFAULT_ENABLED_CHAPTERS: Record<ChapterId, boolean> = {
  welcome: true,
  secret_code: true,
  habit_cards: true,
  delulu_story: true,
  our_lore: true,
  open_when: true,
  love_loop: true,
  "classic-journey": true,
  classic_journey: true,
  final_reveal: false,
};

export const DEFAULT_CLASSIC_GALLERY_PHOTOS: ClassicGalleryPhoto[] = [
  {
    id: "cg_1",
    src: "",
    caption: "My favorite place",
    note: "Every place feels a little more magical with you beside me.",
    rotation: -3,
  },
  {
    id: "cg_2",
    src: "",
    caption: "A little piece of forever",
    note: "Some moments are too beautiful to only happen once.",
    rotation: 2,
  },
  {
    id: "cg_3",
    src: "",
    caption: "Just you and me",
    note: "The world is so much better when it's just us.",
    rotation: -2,
  },
  {
    id: "cg_4",
    src: "",
    caption: "My kind of happiness",
    note: "If happiness had a picture, it would look something like this.",
    rotation: 3,
  },
  {
    id: "cg_5",
    src: "",
    caption: "The best kind of ordinary",
    note: "Even doing absolutely nothing feels extraordinary with you.",
    rotation: -1,
  },
  {
    id: "cg_6",
    src: "",
    caption: "My favorite view",
    note: "Out of all the views in this world, looking at you is my favorite.",
    rotation: 4,
  },
];

export function normalizeSurprise(s: Surprise): Surprise {
  let rawOrder = Array.isArray(s.chapterOrder)
    ? [...s.chapterOrder]
    : [...DEFAULT_CHAPTER_ORDER];

  // Migrate legacy chapter IDs
  rawOrder = rawOrder
    .map((id) => (id === ("classic_journey" as ChapterId) ? ("classic-journey" as ChapterId) : id))
    .filter((id) => id !== ("final_reveal" as ChapterId) && id !== ("chapter-8" as ChapterId));

  if (!rawOrder.includes("classic-journey")) {
    rawOrder.push("classic-journey");
  }

  const enabledChapters: Record<ChapterId, boolean> = {
    ...DEFAULT_ENABLED_CHAPTERS,
    ...(s.enabledChapters || {}),
  };

  // Sync classic-journey enabled state
  if (enabledChapters["classic-journey"] === undefined) {
    enabledChapters["classic-journey"] =
      (s.enabledChapters && (s.enabledChapters as any)["classic_journey"] !== false) ?? true;
  }
  enabledChapters["classic_journey"] = enabledChapters["classic-journey"];
  enabledChapters["final_reveal"] = false;

  // Migrate finalReveal content to classicJourney if needed
  const classicJourney: ClassicJourneyConfig = {
    galleryHeading: s.classicJourney?.galleryHeading || "Little moments, big feelings ♡",
    gallerySubtitle: s.classicJourney?.gallerySubtitle || "Every picture holds a little story.",
    galleryPhotos:
      s.classicJourney?.galleryPhotos && s.classicJourney.galleryPhotos.length > 0
        ? s.classicJourney.galleryPhotos
        : [...DEFAULT_CLASSIC_GALLERY_PHOTOS],
    finalLetterMessage:
      s.classicJourney?.finalLetterMessage ||
      s.finalReveal?.message ||
      "You are my favorite thought every morning, my softest comfort every night, and the easiest choice I have ever made. Thank you for filling my universe with pure magic.",
    finalLetterQuote:
      s.classicJourney?.finalLetterQuote ||
      s.finalReveal?.quote ||
      "Whatever our souls are made of, yours and mine are the same.",
    finalLetterImageUrl:
      s.classicJourney?.finalLetterImageUrl ||
      s.finalReveal?.imageUrl ||
      "/assets/images/hero_couple_sunset.jpg",
  };

  // Migrate loveLoop questions if missing
  const loveLoop: LoveLoopConfig = {
    enabled: s.loveLoop?.enabled !== false,
    promptQuestion: s.loveLoop?.promptQuestion || "Now tell me... What's one tiny thing I do that makes you smile? 💗",
    questions:
      s.loveLoop?.questions && s.loveLoop.questions.length > 0
        ? s.loveLoop.questions
        : [
            {
              id: "q1",
              question:
                s.loveLoop?.promptQuestion ||
                "What is one tiny habit of mine that secretly makes you smile? 💗",
            },
            {
              id: "q2",
              question: "If we could teleport anywhere right now for a cozy date, where would we go? ✨",
            },
            {
              id: "q3",
              question: "What's a memory of us that you replay whenever you miss me? 🥹",
            },
          ],
    allowText: s.loveLoop?.allowText !== false,
    allowReactions: s.loveLoop?.allowReactions !== false,
    allowVoice: s.loveLoop?.allowVoice !== false,
  };

  return {
    ...s,
    chapterOrder: rawOrder,
    enabledChapters,
    classicJourney,
    loveLoop,
  };
}

/**
 * Creates a fully-populated initial Surprise template.
 * The creator can customize it in the unified wizard.
 */
export function createDefaultSurprise(
  senderName = "Aaryan",
  recipientName = "Ananya"
): Surprise {
  return {
    id: `surprise-${Date.now()}`,
    shareId: `ym-${Math.random().toString(36).substring(2, 9)}`,
    status: "published",
    senderName,
    recipientName,
    nicknames: ["Cutie", "My Love", "Princess"],
    tone: "cute",
    theme: "#FF5C93",
    title: `A Little World for ${recipientName} ♡`,
    welcomeSubtitle: `Turn your little moments into a big love story. A special continuous surprise prepared with all my love.`,

    // Opening Chapter (restoring the original base experience)
    openingChapter: {
      greeting: `Hey ${recipientName}, my favorite person...`,
      subtitle: `I made a little something just for you. Something that says all the things I sometimes forget to say out loud.`,
      ctaLabel: "Open Your Surprise ♡",
      tinyNote: "Psst... this is only for you.",
    },

    chapterOrder: [...DEFAULT_CHAPTER_ORDER],
    enabledChapters: { ...DEFAULT_ENABLED_CHAPTERS },

    // Chapter: Habit Cards (Sender configured)
    habitCards: [...SAMPLE_HABIT_CARDS],

    // Chapter 2: Secret Code (Sender configured)
    secretUnlock: {
      code: "cutie",
      clue: "The 5-letter nickname I call you when you're being dramatic and soft.",
      hint: "Starts with 'c', ends with 'e', rhymes with beauty! ♡",
      maxAttempts: 3,
      wrongBanter: [...WRONG_CODE_BANTER],
      rewardTitle: "Secret Surprise Unlocked! 💖",
      unlockedSubtitle: `A private moment just for ${recipientName} ♡`,
      rewardMessage: `I knew you'd remember, ${recipientName}! You are the sweetest part of my everyday life. Whether we're bantering over silly inside jokes or sitting in quiet comfort, there's nobody else I'd rather share this little world with. Happy surprises, today and always. ♡`,
      rewardImageUrl: "/assets/images/starry_secret_box.jpg",
      closingLine: `Forever and always yours, ${senderName} ♡`,
      decorativeCaption: "Top Secret • For Your Eyes Only",
    },

    // Chapter 3: Delulu Mode Story (Sender configured, 8 scenes with genuine branching)
    deluluStory: {
      tropeId: "academic_rivals",
      tropeTitle: "Academic Rivals to Lovers",
      characterVibe: "Sarcastic genius vs chaotic perfectionist",
      realHabit: "tippy-tappy excited hand dance",
      insideJoke: "delulu 3 AM ramen debates",
      tone: "cute",
      initialChapterId: "ch1",
      realWorldClosingNote: `Okay okay, meri drama queen! 🥹💕 Ab apni delulu duniya se bahar aao aur idhar aake mujhe ek tight sa hug do. Itni romance ho gayi, ab asli wala pyaar bhi toh banta hai! 🫂❤️`,
      chapters: {
        ch1: {
          id: "ch1",
          chapterNumber: 1,
          title: "The Project Assignment",
          sceneText: `The auditorium buzzes as Professor Sharma announces semester partners: '${senderName} and ${recipientName}—Room 402 project.' An audible gasp ripples across the lecture hall. You both have been neck-and-neck for the top spot all year. ${recipientName} crosses her arms, flashing her signature teasing smirk.`,
          choices: [
            {
              id: "c1",
              label: "Tease her about carrying the whole project",
              nextChapterId: "ch2_library",
              vibeReaction: "Playful banter mode activated! 😏",
            },
            {
              id: "c2",
              label: "Offer to get caramel coffee before we start arguing",
              nextChapterId: "ch2_cafe",
              vibeReaction: "Smooth caramel peace treaty! ☕",
            },
          ],
        },
        ch2_library: {
          id: "ch2_library",
          chapterNumber: 2,
          title: "4th Floor Library Standoff",
          sceneText: `Rain taps against the tall arched library windows. ${recipientName} slides her color-coded research notes across the mahogany table. 'Don't drool, Smarty, these took hours.' On the margin, she spots your yellow sticky note quoting our inside joke: 'delulu 3 AM ramen debates'. She lets out that tippy-tappy excited hand dance she swears nobody notices.`,
          choices: [
            {
              id: "c3",
              label: "Challenge her to a 10-minute quiz showdown",
              nextChapterId: "ch3_blackout",
              vibeReaction: "Competitive sparks flying! ⚡",
            },
            {
              id: "c4",
              label: "Reach across and gently adjust her reading glasses",
              nextChapterId: "ch3_whisper",
              vibeReaction: "Soft heart-skip moment! 🥺",
            },
          ],
        },
        ch2_cafe: {
          id: "ch2_cafe",
          chapterNumber: 2,
          title: "The Rainy Corner Booth",
          sceneText: `Steam rises from two warm mugs in the little cafe behind campus. ${recipientName} wraps both hands around her hot chocolate. 'Ceasefire for 20 minutes,' she decrees. 'Only because you remembered extra whipped cream.' Outside, autumn leaves swirl in the evening mist.`,
          choices: [
            {
              id: "c5",
              label: "Hand her one earbud to listen to our secret acoustic playlist",
              nextChapterId: "ch3_playlist",
              vibeReaction: "Sharing music intimacy! 🎧",
            },
            {
              id: "c6",
              label: "Steal a tiny bite of her strawberry cheesecake",
              nextChapterId: "ch3_rooftop",
              vibeReaction: "Pastry thief drama! 🍓",
            },
          ],
        },
        ch3_blackout: {
          id: "ch3_blackout",
          chapterNumber: 3,
          title: "The Campus Blackout Twist",
          sceneText: `A deafening crack of thunder shakes the roof—and instantly all library chandeliers go pitch black! In the sudden darkness, you feel a small hand instinctively grab your sleeve. ${recipientName} whispers softly: 'Hey... you still there?'`,
          choices: [
            {
              id: "c7",
              label: "Turn on phone flashlight and drape your oversized jacket on her shoulders",
              nextChapterId: "ch4_jacket",
              vibeReaction: "Knight in shining hoodie! 🧸",
            },
            {
              id: "c8",
              label: "Whisper: 'Don't worry, your favorite rival isn't going anywhere'",
              nextChapterId: "ch4_confession",
              vibeReaction: "Heart rate accelerating! 💓",
            },
          ],
        },
        ch3_whisper: {
          id: "ch3_whisper",
          chapterNumber: 3,
          title: "The Locked Study Room",
          sceneText: `A click rings out down the hall—the librarian locked up for the night without checking Room 402! Trapped under the amber desk lamp, ${recipientName} giggles uncontrollably. 'Great. Now my GPA rival is my prison cellmate.'`,
          choices: [
            {
              id: "c9",
              label: "Pull out secret midnight snacks from your backpack",
              nextChapterId: "ch4_noodles",
              vibeReaction: "Survival snacking together! 🍜",
            },
            {
              id: "c10",
              label: "Admit you actually don't mind being trapped here at all",
              nextChapterId: "ch4_confession",
              vibeReaction: "Honest feelings slipping out! 🙈",
            },
          ],
        },
        ch3_playlist: {
          id: "ch3_playlist",
          chapterNumber: 3,
          title: "One Earbud, One Heartbeat",
          sceneText: `The slow guitar melody plays between you two. The café chatter fades into background murmur. Slowly, almost subconsciously, ${recipientName}'s head tilts and rests gently against your shoulder. She doesn't pull away.`,
          choices: [
            {
              id: "c11",
              label: "Gently intertwine your fingers with hers on the table",
              nextChapterId: "ch4_hands",
              vibeReaction: "1000/10 romance points! 💖",
            },
            {
              id: "c12",
              label: "Whisper asking her to make a rainy wish with you",
              nextChapterId: "ch4_wish",
              vibeReaction: "Whimsical pure romance! ✨",
            },
          ],
        },
        ch3_rooftop: {
          id: "ch3_rooftop",
          chapterNumber: 3,
          title: "The Greenhouse Rooftop",
          sceneText: `'Hey, follow me!' ${recipientName} laughs, dragging you by the hand up the spiral stairs to the botanical greenhouse roof. The rain drumrolls on the glass dome surrounded by glowing fairy lights.`,
          choices: [
            {
              id: "c13",
              label: "Hold your shared umbrella and spin her in a slow dance",
              nextChapterId: "ch4_dance",
              vibeReaction: "Movie scene unlocked! 💃",
            },
            {
              id: "c14",
              label: "Ask her what she truly thinks of our rivalry",
              nextChapterId: "ch4_confession",
              vibeReaction: "Truth time under the stars! 🌙",
            },
          ],
        },
        ch4_jacket: {
          id: "ch4_jacket",
          chapterNumber: 4,
          title: "Under the Library Window",
          sceneText: `Wrapped snug in your warm jacket, ${recipientName} pulls the zipper up to her chin. The emergency lights cast a golden halo around her face. 'You know,' she murmurs, 'you're surprisingly tolerable when you're not trying to beat my exam scores.'`,
          choices: [
            {
              id: "c15",
              label: "Tell her you'd happily give her #1 if you get to keep her",
              nextChapterId: "ending_valedictorian",
              vibeReaction: "Smoothest line of the century! 🏆",
            },
            {
              id: "c16",
              label: "Declare that the jacket is officially hers forever",
              nextChapterId: "ending_hoodie",
              vibeReaction: "Hoodie deed signed! ✍️",
            },
          ],
        },
        ch4_confession: {
          id: "ch4_confession",
          chapterNumber: 4,
          title: "The Midnight Confession",
          sceneText: `The room falls completely silent. You look into each other's eyes, all academic banter stripped away. '${senderName},' ${recipientName} says softly, her fingers brushing yours. 'I think I stopped seeing you as just a rival a long time ago.'`,
          choices: [
            {
              id: "c17",
              label: "Lean in and take her hand under the clock tower chimes",
              nextChapterId: "ending_clocktower",
              vibeReaction: "Climactic fairy-tale ending! 🔔",
            },
            {
              id: "c18",
              label: "Promise that from now on, it's you two against the whole world",
              nextChapterId: "ending_valedictorian",
              vibeReaction: "Unstoppable power couple! 🌟",
            },
          ],
        },
        ch4_noodles: {
          id: "ch4_noodles",
          chapterNumber: 4,
          title: "Midnight Ramen Pact",
          sceneText: `Sharing steaming instant noodles with plastic forks at 1:00 AM on the library floor. ${recipientName} slurps happily, eyes crinkling. 'This is officially our best project ever. Nobody can top this.'`,
          choices: [
            {
              id: "c19",
              label: "Make a pinky promise to do this every week",
              nextChapterId: "ending_hoodie",
              vibeReaction: "Pinky promise sealed! 🤙",
            },
          ],
        },
        ch4_hands: {
          id: "ch4_hands",
          chapterNumber: 4,
          title: "Fingers Entwined",
          sceneText: `Her fingers curl softly between yours. Her pulse beats against your palm, sweet and steady. Neither of you moves. Even when the barista turns off the neon sign, you just sit together in the quiet warmth.`,
          choices: [
            {
              id: "c20",
              label: "Walk her all the way to her doorstep under the clock chimes",
              nextChapterId: "ending_clocktower",
              vibeReaction: "Gentleman romantic! 🌸",
            },
          ],
        },
        ch4_wish: {
          id: "ch4_wish",
          chapterNumber: 4,
          title: "The Rainy Wish",
          sceneText: `${recipientName} closes her eyes and whispers: 'I wish this evening never had to end.' When she opens them, you are looking right at her with a gentle smile. 'Then let's not end it.'`,
          choices: [
            {
              id: "c21",
              label: "Take her to the clock tower where time stands still",
              nextChapterId: "ending_clocktower",
              vibeReaction: "Eternal love moment! 💫",
            },
          ],
        },
        ch4_dance: {
          id: "ch4_dance",
          chapterNumber: 4,
          title: "Dance on the Rooftop",
          sceneText: `You turn her gently under the rain. Her laugh echoes into the autumn night, sparkling and free. For three minutes, the whole world shrinks down to just the two of you dancing on a rooftop.`,
          choices: [
            {
              id: "c22",
              label: "Pull her close as the storm clears into starry skies",
              nextChapterId: "ending_clocktower",
              vibeReaction: "Pure cinematic magic! 🎬",
            },
          ],
        },
        ending_clocktower: {
          id: "ending_clocktower",
          chapterNumber: 5,
          title: "Ending A — Under the Clock Tower Chimes",
          sceneText: `Midnight strikes across the campus. Standing together under the towering bell, the rain has turned to mist. ${recipientName} looks up at you with eyes full of tenderness. 'We started as rivals trying to win,' she smiles softly. 'Turns out the best thing I ever won was you.'`,
          isEnding: true,
          endingTitle: "🔔 Ending A: Timeless Love Under the Chimes",
        },
        ending_hoodie: {
          id: "ending_hoodie",
          chapterNumber: 5,
          title: "Ending B — The Confiscated Hoodie Forever",
          sceneText: `Swallowed in your oversized hoodie with the sleeves rolled up twice, ${recipientName} flashes her most triumphant smile. 'Contract signed, rival. This hoodie, your late-night ramen, and your heart are now officially confiscated.' You laugh and pull her into a warm hug. 'Take it all.'`,
          isEnding: true,
          endingTitle: "🧸 Ending B: The Stolen Hoodie Contract",
        },
        ending_valedictorian: {
          id: "ending_valedictorian",
          chapterNumber: 5,
          title: "Ending C — Co-Valedictorians in Love",
          sceneText: `The final scores are posted. It's an exact, perfect tie. But neither of you even glances at the board. Hand in hand, walking down the sunlit campus steps, you both know: the only grade that matters is the 100/10 love you built together.`,
          isEnding: true,
          endingTitle: "🏆 Ending C: Perfect Score in Love",
        },
      },
    },

    // Chapter 4: Love Loop Prompt (Sender configured, multi-question)
    loveLoop: {
      enabled: true,
      promptQuestion: `Now tell me ${recipientName}... What's one tiny thing I do that makes you smile? 💗`,
      questions: [
        {
          id: "q1",
          question: `What is one tiny habit of mine that secretly makes you smile? 💗`,
        },
        {
          id: "q2",
          question: `If we could teleport anywhere right now for a cozy date, where would we go? ✨`,
        },
        {
          id: "q3",
          question: `What's a memory of us that you replay whenever you miss me? 🥹`,
        },
      ],
      allowText: true,
      allowReactions: true,
      allowVoice: true,
    },

    // Chapter 5: Our Little Lore Scrapbook (Sender configured)
    littleLore: [...INITIAL_MEMORIES],

    // Chapter 6: Open When Letters (Sender configured)
    openWhenLetters: [...SAMPLE_OPEN_WHEN_LETTERS],

    // Chapter 7: Classic Journey Customization (Scrapbook + Final Letter)
    classicJourney: {
      galleryHeading: "Little moments, big feelings ♡",
      gallerySubtitle: "Every picture holds a little story.",
      galleryPhotos: [...DEFAULT_CLASSIC_GALLERY_PHOTOS],
      finalLetterMessage: `Hey ${recipientName},

I made this little world just for you, because sometimes a standard message doesn't feel like enough.

I hope every little habit card, every silly question, every secret code, and every alternate universe scene reminds you of one simple truth:

You are appreciated. You are important. And you deserve to feel loved, not just today, but in all the ordinary moments in between.

Thank you for being you. Always.`,
      finalLetterQuote: "Whatever our souls are made of, yours and mine are the same. You're my favorite notification, my favorite hello, and my favorite kind of forever. ♡",
      finalLetterImageUrl: "/assets/images/hero_couple_sunset.jpg",
    },

    // Legacy fallback for finalReveal
    finalReveal: {
      heading: `To My Favorite Person, ${recipientName}`,
      message: `Hey ${recipientName}, I made this little world just for you.`,
      quote: "Whatever our souls are made of, yours and mine are the same.",
      style: "glowing_envelope",
      imageUrl: "/assets/images/hero_couple_sunset.jpg",
    },

    createdAt: new Date().toISOString(),
  };
}

export const DEMO_SURPRISE = createDefaultSurprise("Aaryan", "Ananya");
DEMO_SURPRISE.id = "demo-surprise-001";
DEMO_SURPRISE.shareId = "demo-ananya";

// Retrieve all persistent surprises
export function getAllSurprises(): Surprise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SURPRISES);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.SURPRISES,
        JSON.stringify([DEMO_SURPRISE])
      );
      return [DEMO_SURPRISE];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map(normalizeSurprise)
      : [DEMO_SURPRISE];
  } catch {
    return [DEMO_SURPRISE];
  }
}

export function getSurpriseById(idOrShareId: string): Surprise | undefined {
  const all = getAllSurprises();
  return all.find(
    (s) => s.id === idOrShareId || s.shareId === idOrShareId
  );
}

export function saveSurprise(surprise: Surprise): void {
  try {
    const all = getAllSurprises();
    const idx = all.findIndex((s) => s.id === surprise.id);
    let updated: Surprise[];
    if (idx >= 0) {
      updated = [...all];
      updated[idx] = { ...surprise, updatedAt: new Date().toISOString() };
    } else {
      updated = [surprise, ...all];
    }
    localStorage.setItem(STORAGE_KEYS.SURPRISES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("you_and_me_surprises_changed"));
  } catch (err) {
    console.error("Error saving surprise:", err);
  }
}

export function deleteSurprise(id: string): void {
  try {
    const all = getAllSurprises().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SURPRISES, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("you_and_me_surprises_changed"));
  } catch (err) {
    console.error("Error deleting surprise:", err);
  }
}

// Draft state for creator (so navigating or refreshing never loses work)
export function getDraftSurprise(): Surprise {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SURPRISE_DRAFT);
    if (raw) {
      return normalizeSurprise(JSON.parse(raw));
    }
  } catch {
    // fallback
  }
  return createDefaultSurprise("You", "Your Partner");
}

export function saveDraftSurprise(draft: Surprise): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SURPRISE_DRAFT, JSON.stringify(draft));
  } catch (err) {
    console.error("Error saving draft surprise:", err);
  }
}

export function clearDraftSurprise(): void {
  localStorage.removeItem(STORAGE_KEYS.SURPRISE_DRAFT);
}

// Recipient response tracking
export function getStoredResponses(): RecipientResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    if (!raw) {
      const demo: RecipientResponse[] = [
        {
          id: "resp-1",
          surpriseId: "demo-surprise-001",
          recipientName: "Ananya",
          text: "You always make me laugh even when I'm having the worst day. And yes, my angry face is 100% real! 😤💗",
          reaction: "🥰",
          voiceDuration: "0:24",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          savedToLore: true,
        },
      ];
      localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(demo));
      return demo;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function syncResponsesWithBackend(): Promise<RecipientResponse[]> {
  try {
    const res = await fetch("/api/responses");
    if (res.ok) {
      const remoteList = await res.json();
      if (Array.isArray(remoteList) && remoteList.length > 0) {
        const localList = getStoredResponses();
        const existingIds = new Set(localList.map((r) => r.id));
        const merged = [...localList];
        let hasNew = false;
        for (const item of remoteList) {
          if (!existingIds.has(item.id)) {
            merged.push(item);
            existingIds.add(item.id);
            hasNew = true;
          }
        }
        if (hasNew) {
          localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent("you_and_me_responses_changed"));
        }
        return merged;
      }
    }
  } catch {
    // Offline or server not running, continue with local store
  }
  return getStoredResponses();
}

export async function submitRecipientResponse(
  response: RecipientResponse
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    });

    if (res.ok) {
      // Confirmed server delivery! Update local cache as well
      const all = getStoredResponses();
      const updated = [response, ...all.filter((r) => r.id !== response.id)];
      localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("you_and_me_responses_changed"));
      return { success: true };
    } else {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || `Server returned ${res.status}` };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reach delivery server" };
  }
}

export async function uploadAudioRecording(
  audioBlob: Blob
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const res = await fetch("/api/upload-audio", {
      method: "POST",
      headers: {
        "Content-Type": audioBlob.type || "audio/webm",
      },
      body: audioBlob,
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, url: data.url };
    } else {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || `Upload failed with status ${res.status}` };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Network error uploading audio" };
  }
}

export function saveLoveLoopResponse(response: RecipientResponse): void {
  try {
    const all = getStoredResponses();
    const updated = [response, ...all.filter((r) => r.id !== response.id)];
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("you_and_me_responses_changed"));

    // Transmit to backend API for cross-device visibility
    fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    }).catch(() => {
      // Local storage persists the reply even if offline
    });
  } catch (err) {
    console.error("Error saving response:", err);
  }
}

export function saveResponseToLore(responseId: string): void {
  const responses = getStoredResponses();
  const resp = responses.find((r) => r.id === responseId);
  if (!resp) return;

  const newMemory: LoreMemory = {
    id: `lore-${Date.now()}`,
    title: `Love Loop Reply from ${resp.recipientName || "My Love"}`,
    date: new Date(resp.createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    category: "Love Loop",
    content: resp.text || `Reacted with ${resp.reaction || "💗"}`,
    tags: ["love-loop", "reply", "sweet-words"],
  };

  addMemory(newMemory);

  const updatedResponses = responses.map((r) =>
    r.id === responseId ? { ...r, savedToLore: true } : r
  );
  localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(updatedResponses));
  window.dispatchEvent(new CustomEvent("you_and_me_responses_changed"));
}

// Memories (Our Little Lore)
export function getStoredMemories(): LoreMemory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.MEMORIES,
        JSON.stringify(INITIAL_MEMORIES)
      );
      return INITIAL_MEMORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MEMORIES;
  } catch {
    return INITIAL_MEMORIES;
  }
}

export function addMemory(entry: LoreMemory): void {
  try {
    const list = getStoredMemories();
    const updated = [entry, ...list];
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("you_and_me_memories_changed"));
  } catch (err) {
    console.error("Error adding memory:", err);
  }
}

export function deleteMemory(id: string): void {
  try {
    const list = getStoredMemories().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("you_and_me_memories_changed"));
  } catch (err) {
    console.error("Error deleting memory:", err);
  }
}

// URL Portable Share Encoding (zero-backend, cross-session portable)
export function encodeSurprisePayload(surprise: Surprise): string {
  try {
    const jsonStr = JSON.stringify(surprise);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  } catch (err) {
    console.error("Failed to encode surprise:", err);
    return "";
  }
}

export function decodeSurprisePayload(encoded: string): Surprise | null {
  try {
    const decodedUri = decodeURIComponent(encoded);
    const binary = atob(decodedUri);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr) as Surprise;
    return normalizeSurprise(parsed);
  } catch (err) {
    console.error("Failed to decode surprise:", err);
    return null;
  }
}

// Backwards compatibility for existing components
export const DEFAULT_DEMO_DELULU_STORY = {
  payload: {
    ...DEMO_SURPRISE.deluluStory,
    partnerA: DEMO_SURPRISE.senderName,
    partnerB: DEMO_SURPRISE.recipientName,
  },
};
export const DEFAULT_DEMO_HABIT_MOMENT = {
  partnerName: DEMO_SURPRISE.recipientName,
  creatorName: DEMO_SURPRISE.senderName,
  payload: { cards: DEMO_SURPRISE.habitCards },
};
export const DEFAULT_DEMO_SECRET_CODE = {
  partnerName: DEMO_SURPRISE.recipientName,
  creatorName: DEMO_SURPRISE.senderName,
  payload: {
    code: DEMO_SURPRISE.secretUnlock.code,
    clue: DEMO_SURPRISE.secretUnlock.clue,
    attemptsAllowed: DEMO_SURPRISE.secretUnlock.maxAttempts,
    wrongBanter: DEMO_SURPRISE.secretUnlock.wrongBanter,
    hint: DEMO_SURPRISE.secretUnlock.hint || "",
    rewardType: "letter" as const,
    rewardTitle: DEMO_SURPRISE.secretUnlock.rewardTitle,
    unlockedSubtitle: DEMO_SURPRISE.secretUnlock.unlockedSubtitle,
    rewardMessage: DEMO_SURPRISE.secretUnlock.rewardMessage,
    rewardImageUrl: DEMO_SURPRISE.secretUnlock.rewardImageUrl,
    closingLine: DEMO_SURPRISE.secretUnlock.closingLine,
    decorativeCaption: DEMO_SURPRISE.secretUnlock.decorativeCaption,
  },
};
export const DEFAULT_DEMO_OPEN_WHEN = {
  partnerName: DEMO_SURPRISE.recipientName,
  creatorName: DEMO_SURPRISE.senderName,
  payload: { letters: DEMO_SURPRISE.openWhenLetters },
};
export function decodeSharePayload(encoded: string): any {
  return decodeSurprisePayload(encoded);
}
export function encodeSharePayload(moment: any): string {
  return encodeSurprisePayload(moment);
}
export function saveMoment(moment: any): void {
  saveSurprise(moment);
}
