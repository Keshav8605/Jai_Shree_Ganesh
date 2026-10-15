import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Volume2, VolumeX, Sparkles } from "lucide-react";

interface MusicPlayerProps {
  autoStartTrigger?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoStartTrigger }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  // Romantic music-box chord progression frequencies (Hz)
  // Cmaj9 -> Am9 -> Fmaj7 -> Gsus4 / G7
  const melodyNotes = [
    // Measure 1: Cmaj9
    261.63, 329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 329.63,
    // Measure 2: Am9
    220.0, 261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 261.63,
    // Measure 3: Fmaj7
    174.61, 261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 261.63,
    // Measure 4: G9 / Gsus
    196.0, 246.94, 293.66, 392.0, 440.0, 392.0, 293.66, 246.94,
    // Measure 5: Em7
    164.81, 246.94, 329.63, 392.0, 493.88, 392.0, 329.63, 246.94,
    // Measure 6: Am7
    220.0, 261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 261.63,
    // Measure 7: Dm9 / F
    146.83, 220.0, 261.63, 329.63, 440.0, 329.63, 261.63, 220.0,
    // Measure 8: G7sus -> G
    196.0, 293.66, 349.23, 392.0, 523.25, 493.88, 392.0, 293.66,
  ];

  const playChimeNote = useCallback(
    (freq: number, time: number) => {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft music-box timbre (sine + gentle triangle with warm filter)
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 1.002, time); // warm detune

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, time);
      filter.Q.setValueAtTime(2, time);

      // Sweet bell-like decay envelope
      noteGain.gain.setValueAtTime(0.0001, time);
      noteGain.gain.exponentialRampToValueAtTime(0.28, time + 0.025);
      noteGain.gain.exponentialRampToValueAtTime(0.06, time + 0.5);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(master);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 1.7);
      osc2.stop(time + 1.7);
    },
    []
  );

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(volume, ctx.currentTime);
      master.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, [volume]);

  const startMusic = useCallback(() => {
    initAudio();
    setIsPlaying(true);

    const stepIntervalMs = 420; // tranquil, gentle tempo

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== "running") return;

      const currentIdx = stepRef.current % melodyNotes.length;
      const freq = melodyNotes[currentIdx];

      playChimeNote(freq, ctx.currentTime);

      // Add a soft bass anchor note on downbeats
      if (currentIdx % 8 === 0) {
        playChimeNote(freq * 0.5, ctx.currentTime);
      }

      stepRef.current += 1;
    }, stepIntervalMs);
  }, [initAudio, melodyNotes, playChimeNote]);

  const stopMusic = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  const toggleMute = useCallback(() => {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    const target = newMute ? 0.0001 : volume;
    masterGainRef.current.gain.setTargetAtTime(
      target,
      audioCtxRef.current.currentTime,
      0.05
    );
  }, [isMuted, volume]);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current && !isMuted) {
      masterGainRef.current.gain.setTargetAtTime(
        newVol,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  };

  // If autoStartTrigger becomes true (e.g. user entered the site), start music
  useEffect(() => {
    if (autoStartTrigger && !isPlaying) {
      startMusic();
    }
  }, [autoStartTrigger, isPlaying, startMusic]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2">
      {/* Control panel popup */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-love-blush/60 flex items-center gap-3"
          >
            <button
              onClick={toggleMute}
              className="text-love-plum/70 hover:text-love-pink transition-colors cursor-pointer"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-love-pink cursor-pointer h-1.5 rounded-lg"
              aria-label="Volume slider"
            />
            <span className="text-[11px] font-medium text-love-plum/60 tracking-wider">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating music button */}
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-lg shadow-love-pink/15 border border-love-blush/70 text-love-plum hover:text-love-pink transition-all duration-300 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? "Pause romantic music" : "Play romantic music"}
      >
        {/* Pulsing ring when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-love-pink/40 animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Music icon or dancing bars */}
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 w-4">
            <span className="w-1 bg-love-pink rounded-full animate-[musicBar1_0.8s_ease-in-out_infinite]" />
            <span className="w-1 bg-love-coral rounded-full animate-[musicBar2_0.9s_ease-in-out_infinite]" />
            <span className="w-1 bg-love-pink rounded-full animate-[musicBar3_0.7s_ease-in-out_infinite]" />
          </div>
        ) : (
          <Music size={16} className="text-love-pink" />
        )}

        <span
          className="text-xs font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isPlaying ? "Our Song ♪" : "Play Music ♫"}
        </span>

        <Sparkles
          size={12}
          className={`text-love-coral/80 transition-transform ${
            isPlaying ? "animate-spin" : ""
          }`}
        />
      </motion.button>
    </div>
  );
};
