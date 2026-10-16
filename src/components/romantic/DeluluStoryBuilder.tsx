import React, { useState } from "react";
import type { DeluluStoryPayload } from "../../types/romantic";
import { DELULU_TROPES } from "../../data/romanticTemplates";
import { Sparkles } from "lucide-react";

interface DeluluStoryBuilderProps {
  story: DeluluStoryPayload;
  onChange: (updatedStory: DeluluStoryPayload) => void;
}

export const DeluluStoryBuilder: React.FC<DeluluStoryBuilderProps> = ({
  story,
  onChange,
}) => {
  const [selectedTropeId, setSelectedTropeId] = useState(
    story.tropeId || "academic_rivals"
  );

  const handleTropeSelect = (trope: (typeof DELULU_TROPES)[0]) => {
    setSelectedTropeId(trope.id);

    // Update story with appropriate trope narrative template
    const pA = story.partnerA || "Aaryan";
    const pB = story.partnerB || "Ananya";
    const habit = story.realHabit || "the cute happy dance";
    const joke = story.insideJoke || "3 AM snack debates";

    let scene1 = "";
    let choiceA = "";
    let choiceB = "";

    if (trope.id === "best_friends") {
      scene1 = `${pA} and ${pB} have been inseparable since freshmen year. But tonight, at the quiet campus observatory, ${pB} gently rests their head on ${pA}'s shoulder while listening to their shared playlist. Suddenly, ${pA} catches ${pB} doing that exact ${habit} that makes time stop.`;
      choiceA = "Whisper: 'What if we were more than just best friends?'";
      choiceB = "Laugh it off and bring up our joke about " + joke;
    } else if (trope.id === "fake_dating") {
      scene1 = `The campus festival lights glow warm amber. 'Just hold my hand,' ${pB} whispers softly to ${pA}. 'Everyone is watching, we have to make this fake couple thing look convincing.' But as their fingers lace together, the heartbeat is 100% genuine.`;
      choiceA = "Pull them closer and gently tuck their hair behind their ear";
      choiceB = "Tease them with our inside joke about " + joke;
    } else if (trope.id === "secret_crush") {
      scene1 = `For months, ${pA} thought the secret playlists and notes were completely anonymous. But today, ${pB} catches ${pA} red-handed dropping a handwritten note inside their locker, blushing furiously.`;
      choiceA = "Finally confess: 'It was always me. Every single time.'";
      choiceB = "Try to run away, only for them to grab your wrist with a smile";
    } else if (trope.id === "soulmates_universe") {
      scene1 = `Across a million parallel galaxies and timelines, ${pA} and ${pB} keep finding each other. In this galaxy, they meet at a starlit retro cafe, recognizing that familiar soul spark instantly.`;
      choiceA = "'I knew you in a past life, didn't I?'";
      choiceB = "'I'd find you in any universe, without hesitation.'";
    } else {
      // Academic Rivals (default)
      scene1 = `The professor pairs ${pA} and ${pB} for the semester-defining project. Rivalry has burned between them all year, but when ${pB} brings out notes containing our secret inside joke about ${joke}, the tension turns deliciously romantic.`;
      choiceA = "Tease them about carrying the project";
      choiceB = "Act annoyed but secretly smile";
    }

    const updatedChapters = { ...story.chapters };
    if (updatedChapters["ch1"]) {
      updatedChapters["ch1"] = {
        ...updatedChapters["ch1"],
        sceneText: scene1,
        choices: [
          {
            id: "c1",
            label: choiceA,
            nextChapterId: "ch2_tease",
            vibeReaction: "Bold romantic move! 💖",
          },
          {
            id: "c2",
            label: choiceB,
            nextChapterId: "ch2_smug",
            vibeReaction: "Banter mode on! 🙈",
          },
        ],
      };
    }

    onChange({
      ...story,
      tropeId: trope.id,
      tropeTitle: trope.title,
      chapters: updatedChapters,
    });
  };

  const handleUpdate = (fields: Partial<DeluluStoryPayload>) => {
    onChange({ ...story, ...fields });
  };

  return (
    <div className="space-y-6">
      {/* Trope Selector Grid */}
      <div>
        <label className="text-xs font-bold text-love-plum uppercase tracking-wider block mb-2">
          Step 1: Choose Your Story Trope
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {DELULU_TROPES.map((trope) => {
            const isSelected = selectedTropeId === trope.id;
            return (
              <button
                key={trope.id}
                type="button"
                onClick={() => handleTropeSelect(trope)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-love-blush text-love-deep border-love-pink shadow-xs scale-102"
                    : "bg-white text-love-plum/80 border-love-blush hover:bg-love-pale/60"
                }`}
              >
                <div>
                  <span className="text-lg block mb-1">{trope.emoji}</span>
                  <p
                    className="text-xs font-bold text-love-plum"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {trope.title}
                  </p>
                </div>
                <p className="text-[10px] text-love-plum/60 mt-1 line-clamp-2">
                  {trope.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personalization Inputs */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-love-blush shadow-sm space-y-4">
        <h4
          className="text-xs font-bold text-love-plum uppercase tracking-wider flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Sparkles size={14} className="text-love-pink" />
          <span>Step 2: Personalize Your Main Characters</span>
        </h4>

        {/* Names Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              Your Name (Protagonist 1)
            </label>
            <input
              type="text"
              value={story.partnerA}
              onChange={(e) => handleUpdate({ partnerA: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
              placeholder="e.g. Aaryan"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              Partner's Name (Protagonist 2)
            </label>
            <input
              type="text"
              value={story.partnerB}
              onChange={(e) => handleUpdate({ partnerB: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
              placeholder="e.g. Ananya"
            />
          </div>
        </div>

        {/* Real Habit and Inside Joke */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              One Real Habit to Weave In
            </label>
            <input
              type="text"
              value={story.realHabit}
              onChange={(e) => handleUpdate({ realHabit: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
              placeholder="e.g. happy hand dance, stealing fries"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              One Real Inside Joke
            </label>
            <input
              type="text"
              value={story.insideJoke}
              onChange={(e) => handleUpdate({ insideJoke: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
              placeholder="e.g. 3 AM ramen debates, the hoodie heist"
            />
          </div>
        </div>

        {/* Character Vibe & Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              Character Dynamic / Vibe
            </label>
            <input
              type="text"
              value={story.characterVibe || ""}
              onChange={(e) => handleUpdate({ characterVibe: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20"
              placeholder="e.g. Grumpy x Sunshine, Sarcastic genius x Chaos"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-love-plum block mb-1">
              Story Tone
            </label>
            <select
              value={story.tone}
              onChange={(e) =>
                handleUpdate({
                  tone: e.target.value as DeluluStoryPayload["tone"],
                })
              }
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20 text-love-plum"
            >
              <option value="cute">Cute & Heartwarming</option>
              <option value="chaotic">Chaotic & Funny</option>
              <option value="dramatic">Dramatic & Spicy</option>
              <option value="dreamy">Dreamy & Romantic</option>
              <option value="emotional">Soft & Emotional</option>
            </select>
          </div>
        </div>

        {/* Real World Climax Closing Note */}
        <div>
          <label className="text-xs font-semibold text-love-plum block mb-1">
            Real-World Closing Note (The Transition Back to Reality)
          </label>
          <textarea
            rows={2}
            value={story.realWorldClosingNote}
            onChange={(e) =>
              handleUpdate({ realWorldClosingNote: e.target.value })
            }
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-love-pale/20 text-love-plum"
            placeholder="e.g. Okay, our delulu universe ends here. But in this universe, I'm still choosing you. Every single day. 💗"
          />
        </div>
      </div>
    </div>
  );
};
