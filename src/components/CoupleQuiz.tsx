import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loveConfig } from "../data/loveConfig";
import { Panda, HeartIcon, SparkleIcon } from "./Illustrations";

interface CoupleQuizProps {
  onContinue: () => void;
}

export const CoupleQuiz: React.FC<CoupleQuizProps> = ({ onContinue }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const questions = loveConfig.quizQuestions;
  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    setAnswers((prev) => [...prev, answerIndex]);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  const getResultSummary = () => {
    const parts: string[] = [];
    // Build a personalized summary from answers
    if (answers[1] !== undefined) {
      const dateAnswers = [
        "cozy movie nights",
        "sunset walks",
        "good food and endless talking",
        "being together no matter what",
      ];
      parts.push(
        `Your perfect date involves ${dateAnswers[answers[1]] || "something special"}.`
      );
    }
    if (answers[2] !== undefined) {
      const hugAnswers = [
        "long hugs that heal everything",
        "surprise hugs that make everything better",
        "hugs where nobody wants to let go",
      ];
      parts.push(
        `You're a fan of ${hugAnswers[answers[2]] || "the best kind of hugs"}.`
      );
    }
    parts.push("Honestly? That sounds pretty wonderful. 💗");
    return parts.join(" ");
  };

  return (
    <section
      className="relative min-h-screen py-20 px-4 overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #FFF2F6 0%, #EBDDFB 40%, #FFE4EC 80%, #FFF2F6 100%)",
      }}
    >
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{ opacity: [0, 0.4, 0], rotate: [0, 180, 360] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          >
            <SparkleIcon size={10} color="#FFA0B8" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={`q-${currentQuestion}`}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-love-blush/50"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full transition-colors duration-300"
                      style={{
                        background:
                          i <= currentQuestion ? "#FF5C93" : "#FFE4EC",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs text-love-coral/60"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>

              {/* Question heading (only on first question) */}
              {currentQuestion === 0 && (
                <>
                  <motion.h2
                    className="text-2xl sm:text-3xl font-bold text-love-plum mb-2 text-center"
                    style={{ fontFamily: "var(--font-display)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {loveConfig.quizHeading}
                  </motion.h2>
                  <motion.p
                    className="text-sm text-love-plum/60 mb-6 text-center"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {loveConfig.quizSubtitle}
                  </motion.p>
                </>
              )}

              {/* Question */}
              <motion.h3
                className="text-lg sm:text-xl font-bold text-love-plum text-center mb-6"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {question.question}
              </motion.h3>

              {/* Answers */}
              <div className="space-y-3">
                {question.answers.map((answer, i) => (
                  <motion.button
                    key={i}
                    className="w-full py-3 px-5 rounded-2xl text-left text-sm font-medium cursor-pointer
                               border-2 transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-body)",
                      background:
                        selectedAnswer === i
                          ? "linear-gradient(135deg, #FF5C93, #FFA0B8)"
                          : "white",
                      borderColor:
                        selectedAnswer === i ? "#FF5C93" : "#FFE4EC",
                      color: selectedAnswer === i ? "white" : "#54233F",
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    whileHover={{
                      scale: selectedAnswer === null ? 1.02 : 1,
                      borderColor: "#FFA0B8",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      selectedAnswer === null && handleAnswer(i)
                    }
                    disabled={selectedAnswer !== null}
                  >
                    {answer}
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && selectedAnswer !== null && (
                  <motion.div
                    className="mt-4 p-3 rounded-xl bg-love-blush/50 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p
                      className="text-sm text-love-plum font-medium"
                      style={{ fontFamily: "var(--font-handwritten)" }}
                    >
                      {question.feedback[selectedAnswer]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-love-blush/50 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              {/* Celebration */}
              <motion.div
                className="mb-4 relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 pointer-events-none"
                    style={{ fontSize: `${10 + Math.random() * 12}px` }}
                    initial={{ opacity: 1, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      x: (Math.random() - 0.5) * 150,
                      y: (Math.random() - 0.5) * 150,
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.3 + Math.random() * 0.3,
                    }}
                  >
                    {["💗", "✨", "🎉", "💕", "⭐"][Math.floor(Math.random() * 5)]}
                  </motion.span>
                ))}
              </motion.div>

              <Panda size={100} className="mx-auto mb-4" />

              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-love-pink mb-4"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {loveConfig.quizResultHeading}
              </motion.h2>

              <motion.p
                className="text-sm text-love-plum/70 mb-6 leading-relaxed"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {getResultSummary()}
              </motion.p>

              <motion.p
                className="text-sm text-love-plum/50 mb-6"
                style={{ fontFamily: "var(--font-handwritten)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {loveConfig.quizResultNote}
              </motion.p>

              <div className="flex justify-center gap-2 mb-6" aria-hidden="true">
                <HeartIcon size={10} color="#FFA0B8" />
                <HeartIcon size={14} color="#FF5C93" />
                <HeartIcon size={10} color="#FFA0B8" />
              </div>

              <motion.button
                id="quiz-continue-button"
                className="px-8 py-3 rounded-full text-white font-semibold
                           bg-gradient-to-r from-love-pink to-love-coral
                           hover:scale-105 active:scale-95
                           transition-transform duration-200 cursor-pointer
                           shadow-lg shadow-love-pink/20"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={onContinue}
              >
                Show me my surprise 🎁
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
