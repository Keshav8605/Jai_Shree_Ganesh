import React, { useState, useRef, useEffect } from "react";
import type { LoveLoopResponse, LoveLoopQuestion, LoveLoopAnswer } from "../../types/romantic";
import {
  RotateCcw,
  Send,
  Heart,
  Mic,
  Square,
  RefreshCw,
  Trash2,
  CheckCircle2,
  FolderHeart,
  Share2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  submitRecipientResponse,
  uploadAudioRecording,
  saveResponseToLore,
} from "../../data/momentStore";

interface LoveLoopComposerProps {
  momentId: string;
  partnerName?: string;
  creatorName?: string;
  promptQuestion?: string;
  questions?: LoveLoopQuestion[];
  onSent?: (response: LoveLoopResponse) => void;
}

export const LoveLoopComposer: React.FC<LoveLoopComposerProps> = ({
  momentId,
  partnerName = "My Love",
  creatorName = "Your Favorite Person",
  promptQuestion,
  questions,
  onSent,
}) => {
  // Resolved questions list
  const activeQuestions: LoveLoopQuestion[] =
    questions && questions.length > 0
      ? questions
      : [
          {
            id: "q_default",
            question:
              promptQuestion ||
              "Now tell me... What's one tiny thing I do that makes you smile? 💗",
          },
        ];

  // Answers mapped by questionId
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedReaction, setSelectedReaction] = useState("🥰");

  // Audio recording state
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Submission state
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [savedToLoreState, setSavedToLoreState] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reactions = [
    { emoji: "🥰", label: "Blushing" },
    { emoji: "🥺", label: "Soft" },
    { emoji: "😭", label: "Happy tears" },
    { emoji: "💗", label: "Love" },
    { emoji: "✨", label: "Magical" },
  ];

  // Cleanup audio preview URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [audioUrl]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartRecording = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError("Voice recording is not supported in this browser.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = ""; // use browser default
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingState("recorded");
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };

      recorder.start(250);
      setRecordingState("recording");
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 120) {
            // Safe auto-stop at 2 minutes
            handleStopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicError("Microphone permission was denied. You can still send text answers!");
      } else {
        setMicError("Could not start audio recorder. You can still send text answers!");
      }
      setRecordingState("idle");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleRetakeRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setRecordingState("idle");
  };

  const handleUpdateAnswer = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const hasAnyAnswer =
    Object.values(answers).some((val) => val.trim().length > 0) || audioBlob !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAnyAnswer) return;

    setIsSending(true);
    setSendError(null);

    try {
      let uploadedAudioUrl: string | undefined = undefined;

      // 1. Upload audio file if recorded
      if (audioBlob) {
        const audioRes = await uploadAudioRecording(audioBlob);
        if (audioRes.success && audioRes.url) {
          uploadedAudioUrl = audioRes.url;
        } else {
          // If server audio upload fails, show error and do not claim success
          setIsSending(false);
          setSendError(audioRes.error || "Audio upload failed. Please try again.");
          return;
        }
      }

      // 2. Prepare structured answer list
      const answersList: LoveLoopAnswer[] = activeQuestions.map((q) => ({
        questionId: q.id,
        questionText: q.question,
        answer: (answers[q.id] || "").trim(),
      }));

      const fullCombinedText = answersList
        .filter((a) => a.answer.length > 0)
        .map((a) => (activeQuestions.length > 1 ? `${a.questionText}\n↳ ${a.answer}` : a.answer))
        .join("\n\n");

      const responseId = `resp-${Date.now()}`;
      const payload: LoveLoopResponse = {
        id: responseId,
        type: "love-loop",
        momentId,
        surpriseId: momentId,
        partnerName,
        text: fullCombinedText,
        answers: answersList,
        reaction: selectedReaction,
        audioUrl: uploadedAudioUrl,
        voiceDuration: audioBlob ? formatSeconds(recordingTime) : undefined,
        createdAt: new Date().toISOString(),
        savedToLore: false,
      };

      // 3. Confirm server persistence
      const res = await submitRecipientResponse(payload);
      if (res.success) {
        setLastSubmittedId(responseId);
        setIsSuccess(true);
        if (onSent) onSent(payload);
      } else {
        setSendError(res.error || "Failed to deliver response to server. Please try again.");
      }
    } catch (err: any) {
      setSendError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveToLore = () => {
    if (lastSubmittedId) {
      saveResponseToLore(lastSubmittedId);
      setSavedToLoreState(true);
    }
  };

  const handleWhatsAppSend = () => {
    const textSummary = Object.entries(answers)
      .map(([qId, ans]) => {
        const q = activeQuestions.find((item) => item.id === qId);
        return q ? `*${q.question}*\n${ans}` : ans;
      })
      .filter(Boolean)
      .join("\n\n");

    const message = `Hey ${creatorName}! ♡ I just answered your Love Loop:\n\n${textSummary || "Reacted with love"} ${selectedReaction}\n\n— Sent from Our Little Universe ✨`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleCopyReply = () => {
    const textSummary = Object.entries(answers)
      .map(([qId, ans]) => {
        const q = activeQuestions.find((item) => item.id === qId);
        return q ? `${q.question}: ${ans}` : ans;
      })
      .join("\n\n");
    navigator.clipboard.writeText(`${textSummary} ${selectedReaction} — Sent to ${creatorName} ♡`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-love-blush shadow-xl shadow-love-plum/5 relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-love-pink via-love-coral to-love-lavender" />

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-love-blush text-love-deep">
              <RotateCcw size={14} />
            </span>
            <span
              className="text-xs font-bold text-love-deep uppercase tracking-wider"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Love Loop • Your Turn, My Love
            </span>
          </div>
          <Heart size={14} className="fill-love-pink text-love-pink" />
        </div>

        {/* SUCCESS STATE */}
        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-[fadeInLine_0.4s_ease-out]">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h4
                className="text-base font-bold text-love-plum"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Reply Delivered to {creatorName}! 💖
              </h4>
              <p className="text-xs text-love-plum/70 mt-1 max-w-xs mx-auto">
                Your answers and audio are safely stored on the server for your partner to open.
              </p>
            </div>

            {/* Direct Delivery Fallback / WhatsApp Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Share2 size={13} />
                <span>Also Send Copy on WhatsApp ♡</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyReply}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-love-plum/80 bg-love-pale/60 hover:bg-love-blush transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy Answers"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToLore}
                  disabled={savedToLoreState}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    savedToLoreState
                      ? "bg-green-100 text-green-700"
                      : "bg-love-pale text-love-deep hover:bg-love-blush"
                  }`}
                >
                  <FolderHeart size={13} />
                  <span>{savedToLoreState ? "Saved in Lore" : "Save in Lore"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* COMPOSER FORM */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Reaction Picker */}
            <div>
              <label className="text-[11px] font-semibold text-love-plum/70 block mb-1.5">
                Pick your feeling:
              </label>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {reactions.map((r) => (
                  <button
                    key={r.emoji}
                    type="button"
                    onClick={() => setSelectedReaction(r.emoji)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-all cursor-pointer border flex items-center gap-1 ${
                      selectedReaction === r.emoji
                        ? "bg-love-pink text-white border-love-pink scale-105 shadow-xs"
                        : "bg-love-pale/50 border-love-blush text-love-plum hover:bg-love-blush/60"
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span className="text-[10px] font-bold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {activeQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-love-pale/40 rounded-2xl p-4 border border-love-blush/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-love-deep uppercase tracking-wider">
                      Question {activeQuestions.length > 1 ? `#${idx + 1}` : ""} from {creatorName}:
                    </span>
                    <span className="text-xs text-love-pink">♡</span>
                  </div>
                  <p
                    className="text-sm sm:text-base text-love-plum font-bold leading-relaxed"
                    style={{ fontFamily: "var(--font-handwritten)", fontSize: "19px" }}
                  >
                    "{q.question}"
                  </p>
                  <textarea
                    rows={2}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleUpdateAnswer(q.id, e.target.value)}
                    placeholder="Type your answer here..."
                    maxLength={400}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-love-blush focus:outline-love-pink bg-white text-love-plum leading-relaxed resize-none shadow-2xs"
                  />
                  <div className="text-right text-[10px] text-love-plum/40">
                    {(answers[q.id] || "").length}/400
                  </div>
                </div>
              ))}
            </div>

            {/* REAL AUDIO VOICE NOTE SECTION (Issue 11) */}
            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Mic size={14} className="text-purple-600" />
                  <span>Voice Note Attachment (Optional)</span>
                </span>
                {recordingState === "recording" && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    Recording {formatSeconds(recordingTime)} / 2:00
                  </span>
                )}
                {recordingState === "recorded" && (
                  <span className="text-xs font-semibold text-purple-700">
                    Ready ({formatSeconds(recordingTime)})
                  </span>
                )}
              </div>

              {micError && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-amber-600" />
                  <span>{micError}</span>
                </div>
              )}

              {recordingState === "idle" && (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-full py-2.5 px-4 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <Mic size={14} className="text-purple-600" />
                  <span>Tap to Record Voice Note</span>
                </button>
              )}

              {recordingState === "recording" && (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Square size={14} className="fill-white" />
                  <span>Stop Recording ({formatSeconds(recordingTime)})</span>
                </button>
              )}

              {recordingState === "recorded" && audioUrl && (
                <div className="space-y-2 pt-1">
                  <audio controls src={audioUrl} className="w-full h-9 rounded-lg" />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRetakeRecording}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 text-purple-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Retake Voice Note</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRetakeRecording}
                      className="py-1.5 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message if Send Failed */}
            {sendError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle size={14} className="text-rose-600" />
                  <span>Delivery Failed</span>
                </div>
                <p>{sendError}</p>
                <p className="text-[11px] text-rose-700/80">
                  You can tap Retry or copy your answers to send directly on WhatsApp.
                </p>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSending || !hasAnyAnswer}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-love-pink via-love-deep to-love-plum text-white font-bold text-xs sm:text-sm shadow-md shadow-love-pink/30 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Uploading & delivering your love...</span>
                </span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Love Reply Bundle ♡</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
