import { motion } from "framer-motion";
import { Brain, Focus, ListChecks, CalendarClock, Wind, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useStats } from "@/contexts/StatsContext";

const features = [
  { to: "/focus", icon: Focus, label: "Focus Mode", desc: "Deep work with timed intervals", gradient: "ns-gradient-sage" },
  { to: "/tasks", icon: ListChecks, label: "Task Breakdown", desc: "Break big tasks into steps", gradient: "ns-gradient-lavender" },
  { to: "/routine", icon: CalendarClock, label: "Routine Builder", desc: "Visual daily schedules", gradient: "ns-gradient-peach" },
  { to: "/breathe", icon: Wind, label: "Calm Zone", desc: "Breathing & relaxation", gradient: "ns-gradient-sky" },
  { to: "/communicate", icon: MessageSquare, label: "Communication", desc: "Templates & speech tools", gradient: "ns-gradient-sage" },
];

const Dashboard = () => {
  const { today, streak } = useStats();

  const stats = [
    { label: "Focus sessions today", value: String(today.focusSessions), icon: Focus },
    { label: "Tasks completed", value: String(today.tasksCompleted), icon: ListChecks },
    { label: "Streak", value: `${streak} day${streak !== 1 ? "s" : ""}`, icon: TrendingUp },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-warm-deep" />
          <span className="text-sm font-medium text-muted-foreground">Good morning</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
          Welcome back to <span className="text-primary">NeuroSync</span>
        </h1>
        <p className="text-muted-foreground max-w-xl">Your cognitive companion is ready. What would you like to focus on today?</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-display text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ to, icon: Icon, label, desc, gradient }, i) => (
          <motion.div key={to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}>
            <Link to={to} className={`block ${gradient} rounded-2xl p-6 hover:shadow-md transition-shadow group`}>
              <Icon className="w-8 h-8 mb-3 text-foreground/80 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold font-display text-foreground text-lg">{label}</h3>
              <p className="text-sm text-foreground/60 mt-1">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-sage flex-shrink-0 flex items-center justify-center">
          <Brain className="w-5 h-5 text-sage-deep" />
        </div>
        <div>
          <h4 className="font-semibold font-display text-foreground">Daily tip</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Try starting with a 15-minute focus session. Short bursts help build momentum without overwhelming your attention reserves.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
