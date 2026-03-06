import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

const TECHNIQUES = [
  { name: "Box Breathing", phases: [4, 4, 4, 4], labels: ["Breathe in", "Hold", "Breathe out", "Hold"] },
  { name: "4-7-8 Calm", phases: [4, 7, 8, 0], labels: ["Breathe in", "Hold", "Breathe out", ""] },
  { name: "Simple Deep", phases: [5, 0, 5, 0], labels: ["Breathe in", "", "Breathe out", ""] },
];

const BreathingExercise = () => {
  const [techIdx, setTechIdx] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tech = TECHNIQUES[techIdx];
  const activePhases = tech.phases.map((p, i) => ({ duration: p, label: tech.labels[i] })).filter((p) => p.duration > 0);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setPhaseIdx(0);
    setCounter(activePhases[0].duration);

    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          setPhaseIdx((pi) => {
            const next = (pi + 1) % activePhases.length;
            setCounter(activePhases[next].duration);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, techIdx]);

  const currentPhase = activePhases[phaseIdx];
  const isExpand = currentPhase?.label.includes("in");

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-foreground">Calm Zone</h1>
        <p className="text-muted-foreground mt-1">Guided breathing to help you reset and regulate.</p>
      </motion.div>

      {/* Technique selector */}
      <div className="flex gap-2 flex-wrap">
        {TECHNIQUES.map((t, i) => (
          <button
            key={t.name}
            onClick={() => { setTechIdx(i); setIsActive(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              i === techIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Breathing circle */}
      <div className="ns-gradient-sky rounded-3xl p-10 flex flex-col items-center gap-6">
        <motion.div
          animate={{
            scale: isActive ? (isExpand ? 1.4 : 1) : 1.1,
          }}
          transition={{
            duration: isActive ? currentPhase?.duration || 4 : 2,
            ease: "easeInOut",
            repeat: isActive ? 0 : Infinity,
            repeatType: "reverse",
          }}
          className="w-40 h-40 rounded-full bg-sky-deep/20 border-4 border-sky-deep/40 flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: isActive ? (isExpand ? 1.3 : 0.9) : 1,
            }}
            transition={{
              duration: isActive ? currentPhase?.duration || 4 : 2,
              ease: "easeInOut",
              repeat: isActive ? 0 : Infinity,
              repeatType: "reverse",
            }}
            className="w-24 h-24 rounded-full bg-sky-deep/30 flex items-center justify-center"
          >
            {isActive ? (
              <span className="text-3xl font-bold font-display text-foreground">{counter}</span>
            ) : (
              <Wind className="w-8 h-8 text-sky-deep" />
            )}
          </motion.div>
        </motion.div>

        {isActive && (
          <motion.p
            key={currentPhase?.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold font-display text-foreground/80"
          >
            {currentPhase?.label}
          </motion.p>
        )}

        <Button
          onClick={() => setIsActive(!isActive)}
          size="lg"
          className="rounded-full px-8"
        >
          {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isActive ? "Pause" : "Begin"}
        </Button>
      </div>

      {/* Info */}
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-semibold font-display text-foreground mb-2">Why breathing helps</h4>
        <p className="text-sm text-muted-foreground">
          Controlled breathing activates your parasympathetic nervous system, reducing anxiety and improving focus.
          Even 2 minutes can help reset your emotional state during overwhelming moments.
        </p>
      </div>
    </div>
  );
};

export default BreathingExercise;
