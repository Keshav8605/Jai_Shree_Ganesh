import type { HabitCard, OpenWhenLetter, MemoryEntry } from "../types/romantic";

export const HABIT_CATEGORIES = [
  {
    id: "habit_love",
    label: "A little habit I secretly love",
    short: "Your sweet habit",
    defaultCopy: "The way you hold your coffee mug with both hands like it's the most precious treasure in the world. It melts my heart every single morning.",
    tone: "cute" as const,
  },
  {
    id: "cute_angry",
    label: "Your cute angry face",
    short: "Angry pouts",
    defaultCopy: "You try so hard to look angry at me, but the second you smile or look away, your whole acting career ends right there.",
    tone: "funny" as const,
  },
  {
    id: "excited",
    label: "Something you do when you're excited",
    short: "Happy tippy-taps",
    defaultCopy: "The tiny tippy-tappy happy dance you do when our food arrives or when you tell me good news. It's honestly the cutest thing ever.",
    tone: "cute" as const,
  },
  {
    id: "nervous",
    label: "A thing you do when you're nervous",
    short: "Nervous tells",
    defaultCopy: "How you fidget with your rings or your hair when you're thinking hard. I can always tell before you even say a single word.",
    tone: "soft" as const,
  },
  {
    id: "think_unnoticed",
    label: "Something you think I don't notice",
    short: "Secretly noticed",
    defaultCopy: "The way you check if I'm walking on the safe side of the street or quietly adjust my jacket when the breeze picks up. I notice every time.",
    tone: "soft" as const,
  },
  {
    id: "reminds_me",
    label: "A tiny thing that reminds me of you",
    short: "Reminds me of you",
    defaultCopy: "Every time I see matcha lattes, oversized hoodies, or listen to that one acoustic playlist, my brain immediately goes: yep, that's my person.",
    tone: "cute" as const,
  },
  {
    id: "tease_reaction",
    label: "The way you react when I tease you",
    short: "When I tease you",
    defaultCopy: "That dramatic gasp followed by 'excuse me?!' followed by an immediate giggle that proves you secretly enjoyed it anyway.",
    tone: "funny" as const,
  },
  {
    id: "happy_moment",
    label: "A little thing you do when you're happy",
    short: "Pure happiness",
    defaultCopy: "The sparkle in your eyes when you look up from a book or your phone to share a random thought. Your smile makes the whole room brighter.",
    tone: "soft" as const,
  },
];

export const SAMPLE_HABIT_CARDS: HabitCard[] = [
  {
    id: "card-1",
    category: "Something you do when you're excited",
    shortTitle: "The happy bounce",
    habitText: "The way you get all excited over the smallest things—like finding a cute cafe or seeing a cat—is honestly the cutest thing ever.",
    tone: "cute",
    reactionNote: "You caught me! 🙈",
  },
  {
    id: "card-2",
    category: "Your cute angry face",
    shortTitle: "Your angry face",
    habitText: "You try so hard to look angry at me, but the second your lips twitch into a smile, your whole villain arc is ruined.",
    tone: "funny",
    reactionNote: "Stop looking so closely! 😭",
  },
  {
    id: "card-3",
    category: "A little habit I secretly love",
    shortTitle: "Stealing my hoodies",
    habitText: "How you claim my oversized hoodies are 'more comfortable' when we both know you just like smelling like me.",
    tone: "cute",
    reactionNote: "They ARE more comfortable though! 😌",
  },
  {
    id: "card-4",
    category: "Something you think I don't notice",
    shortTitle: "Looking over at me",
    habitText: "I always catch you stealing glances when you think I'm focused on driving or working. You look away so fast, it's adorable.",
    tone: "soft",
    reactionNote: "I was not looking! (Okay maybe a little) 💗",
  },
  {
    id: "card-5",
    category: "A tiny thing that reminds me of you",
    shortTitle: "Late night cravings",
    habitText: "3:00 AM snack debates. Whenever I see midnight ramen or strawberry milk, I instantly think of you.",
    tone: "funny",
    reactionNote: "Strawberry milk is elite. 🍓",
  },
  {
    id: "card-6",
    category: "A thing you do when you're nervous",
    shortTitle: "Playing with your rings",
    habitText: "Spinning your ring around your finger three times whenever you're waiting for something important. I'm always right here beside you.",
    tone: "soft",
    reactionNote: "Thank you for being there. 🥺",
  },
];

export const SECRET_CODE_PRESETS = [
  {
    title: "Our Anniversary or First Date",
    code: "0214",
    clue: "The day our story officially started... (MMDD or DDMM)",
    hint: "Think about Valentine's month! Four little digits.",
  },
  {
    title: "Your Special Nickname",
    code: "cutie",
    clue: "What I whisper when you're being extra dramatic and soft.",
    hint: "Starts with C, ends with E. 5 letters!",
  },
  {
    title: "Our Favorite Midnight Food",
    code: "ramen",
    clue: "Our go-to late night comfort craving when everything is quiet.",
    hint: "Steaming hot broth and noodles. 5 letters!",
  },
];

export const WRONG_CODE_BANTER = [
  "Aww... Itna bhi nahi pata mujhe? 🥺 Try again na...",
  "Galat hai! 😭 Ek aur chance... Main itni jaldi nahi khulne wali!",
  "Nice try cutie! 🙈 But that's not our secret code.",
  "Are you sure you're my person? 👀 Think harder, my love!",
  "Wrong answer! 😤 Ek cup coffee peeke aao fir try karo 💕",
  "Close, but no cuddle! One more try?",
];

export const DELULU_TROPES = [
  {
    id: "academic_rivals",
    title: "Academic Rivals to Lovers",
    tagline: "We compete for the top grade... but keep making eye contact across the library.",
    emoji: "📚",
    vibe: "Spicy banter, intense staring, secretly sharing notes",
    color: "#FFE4EC",
  },
  {
    id: "best_friends",
    title: "Best Friends to Lovers",
    tagline: "Everyone in the group chat already knows we're obsessed with each other.",
    emoji: "🧸",
    vibe: "Inside jokes, sharing headphones, accidentally holding hands",
    color: "#EBDDFB",
  },
  {
    id: "secret_crush",
    title: "Secret Crush",
    tagline: "You thought you were being subtle. Spoiler: you were completely obvious.",
    emoji: "💌",
    vibe: "Blushing at greetings, playlists with hidden messages",
    color: "#FFF9F4",
  },
  {
    id: "fake_dating",
    title: "Fake Dating",
    tagline: "We only pretended to date for the campus festival... so why does my heart race?",
    emoji: "🎡",
    vibe: "Hand-holding practice, jealous glances, 'Wait, is this real?'",
    color: "#FFE4EC",
  },
  {
    id: "soulmates_universe",
    title: "Soulmates Across Universes",
    tagline: "In every timeline, every galaxy, every lifetime, I'd still search for you.",
    emoji: "🌌",
    vibe: "Starlight romance, magical coincidences, timeless devotion",
    color: "#EBDDFB",
  },
  {
    id: "custom_story",
    title: "Custom Story Vibe",
    tagline: "Our own tailored romantic universe made from scratch.",
    emoji: "✨",
    vibe: "Personalized setting, quirky situations, pure couple lore",
    color: "#FFF9F4",
  },
];

export const SAMPLE_OPEN_WHEN_LETTERS: OpenWhenLetter[] = [
  {
    id: "ow-1",
    category: "missing_you",
    categoryLabel: "Missing You",
    title: "Open when you miss me",
    emoji: "💭",
    color: "#FFE4EC",
    message:
      "Hey love. Even when we're miles apart or just separated by a long day, there is a piece of my heart that is permanently right beside you. Close your eyes, take a deep breath, and feel my biggest, tightest hug. I'm already counting down the minutes until I see you next. 💗",
  },
  {
    id: "ow-2",
    category: "exams",
    categoryLabel: "Exams & Deadlines",
    title: "Open when you're stressed about exams",
    emoji: "☕",
    color: "#EBDDFB",
    message:
      "Put your pen down for ten seconds and unclench your jaw. You've worked so hard for this, and your brain is full of magic. No single exam or grade defines who you are or how proud I am of you. Drink some water, take a breath, and go show them what you're made of! 🌟",
  },
  {
    id: "ow-3",
    category: "love",
    categoryLabel: "Love",
    title: "Open when you need a smile",
    emoji: "😊",
    color: "#FFF9F4",
    message:
      "Emergency notification: you have officially been designated the cutest person on this planet. It is mandatory for you to smile right this second. Remember that time you laughed so hard you snorted? Yeah. That's my absolute favorite sound in the whole universe. ♡",
  },
  {
    id: "ow-4",
    category: "motivation",
    categoryLabel: "Motivation",
    title: "Open when you're proud of yourself",
    emoji: "🏆",
    color: "#FFE4EC",
    message:
      "I KNEW YOU COULD DO IT! 🎉 I am standing on the virtual rooftop shouting how incredible you are. Take this moment to soak it all in. You earned this win, and nobody deserves to celebrate more than you. Next treat is 100% on me!",
  },
  {
    id: "ow-5",
    category: "bad_day",
    categoryLabel: "Bad Day",
    title: "Open when you're having a bad day",
    emoji: "🌙",
    color: "#EBDDFB",
    message:
      "Bad days don't get to win. You don't have to be strong or cheerful right now. It's totally okay to crawl into bed, wrap yourself like a burrito, and be mad at the world. Tomorrow is a brand new blank page. I'm right here with you, always. 💗",
  },
  {
    id: "ow-6",
    category: "missing_you",
    categoryLabel: "Nighttime",
    title: "Open when you can't sleep",
    emoji: "✨",
    color: "#FFF9F4",
    message:
      "Late night thoughts keeping you up? Imagine us sitting on a quiet balcony together watching the stars. No rush, no worries, just the gentle breeze and soft music. Let your shoulders drop. Sweet dreams, my favorite human. 🌙",
  },
  {
    id: "ow-7",
    category: "love",
    categoryLabel: "Love",
    title: "Open when you need a reminder you're loved",
    emoji: "💝",
    color: "#FFE4EC",
    message:
      "Just in case you forgot: you are deeply, genuinely, unconditionally loved. Not just for your best days, but for every silly, tired, quiet, and imperfect moment in between. You are my home. ♡",
  },
];

export const INITIAL_MEMORIES: MemoryEntry[] = [
  {
    id: "mem-1",
    title: "Our first call",
    date: "14 Jan 2024",
    category: "Memories",
    content: "We said we'd talk for 15 minutes because we were both 'so busy'. We ended up staying on the phone until 4:32 AM talking about alien conspiracy theories and childhood snacks.",
    imageUrl: "/assets/images/hero_couple_sunset.jpg",
    tags: ["firsts", "late-night", "comfort"],
    createdAt: "2024-01-14T04:32:00Z",
  },
  {
    id: "mem-2",
    title: "That cafe date",
    date: "22 Feb 2024",
    category: "Memories",
    content: "Spilled caramel macchiato on the menu because I was laughing too hard at your impression of our professor. You gave me your napkin with a tiny heart drawn on the corner.",
    imageUrl: "/assets/images/habit_card_cute.jpg",
    tags: ["cafe", "laughter", "coffee"],
    createdAt: "2024-02-22T16:20:00Z",
  },
  {
    id: "mem-3",
    title: "You in my hoodie",
    date: "3 Mar 2024",
    category: "Photos",
    content: "The grey oversized Nike hoodie was officially confiscated. I don't think I'm ever getting it back, but honestly you look 1000x cuter in it anyway.",
    imageUrl: "/assets/images/delulu_story_anime.jpg",
    tags: ["hoodie", "cute", "stolen"],
    createdAt: "2024-03-03T19:10:00Z",
  },
  {
    id: "mem-4",
    title: "Our goofy pics",
    date: "15 Apr 2024",
    category: "Photos",
    content: "That photobooth strip where we tried to take aesthetic couple photos but ended up making double-chin frog faces in the last two frames. The best ones on my lock screen.",
    imageUrl: "/assets/images/starry_secret_box.jpg",
    tags: ["photobooth", "silly", "lockscreen"],
    createdAt: "2024-04-15T18:45:00Z",
  },
  {
    id: "mem-5",
    title: "Playlist we both love",
    date: "10 May 2024",
    category: "Inside Jokes",
    content: "The 38-song collaborative playlist titled 'delulu hours only'. Track 14 has our secret code hidden in the song title initials.",
    tags: ["music", "delulu", "songs"],
    createdAt: "2024-05-10T22:00:00Z",
  },
  {
    id: "mem-6",
    title: "Notes to each other",
    date: "1 Jun 2024",
    category: "Notes",
    content: "Little sticky notes stuck inside textbooks and laptop lids. 'Drink water cutie' and 'Go crush this presentation!'",
    tags: ["sticky-notes", "cheering", "love"],
    createdAt: "2024-06-01T08:30:00Z",
  },
];
