import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { label: "Quick Sprint", focus: 10 * 60, breakTime: 3 * 60 },
  { label: "Standard", focus: 25 * 60, breakTime: 5 * 60 },
  { label: "Deep Work", focus: 45 * 60, breakTime: 10 * 60 },
];

const FocusMode = () => {
  const [presetIdx, setPresetIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].focus);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const preset = PRESETS[presetIdx];
  const totalTime = isBreak ? preset.breakTime : preset.focus;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      clearTimer();
      if (!isBreak) {
        setSessions((s) => s + 1);
        setIsBreak(true);
        setTimeLeft(preset.breakTime);
      } else {
        setIsBreak(false);
        setTimeLeft(preset.focus);
        setIsRunning(false);
      }
    }
    return clearTimer;
  }, [isRunning, timeLeft, isBreak, preset, clearTimer]);

  const reset = () => {
    clearTimer();
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(preset.focus);
  };

  const selectPreset = (idx: number) => {
    clearTimer();
    setPresetIdx(idx);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(PRESETS[idx].focus);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-foreground">Focus Mode</h1>
        <p className="text-muted-foreground mt-1">Structured intervals tailored to your attention rhythm.</p>
      </motion.div>

      {/* Presets */}
      <div className="flex gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => selectPreset(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              i === presetIdx
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <motion.div
        layout
        className={`rounded-3xl p-10 flex flex-col items-center gap-6 ${
          isBreak ? "ns-gradient-sky" : "ns-gradient-sage"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isBreak ? "break" : "focus"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 text-sm font-medium text-foreground/70"
          >
            {isBreak ? <Coffee className="w-4 h-4" /> : null}
            {isBreak ? "Break Time" : "Focus Session"}
          </motion.div>
        </AnimatePresence>

        {/* Progress ring */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold font-display text-foreground tabular-nums">
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            size="lg"
            className="rounded-full px-8"
          >
            {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="rounded-full">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Session count */}
      <div className="glass-card rounded-xl p-4 text-center">
        <span className="text-sm text-muted-foreground">Sessions completed today: </span>
        <span className="font-bold text-primary font-display text-lg">{sessions}</span>
      </div>
    </div>
  );
};

export default FocusMode;
