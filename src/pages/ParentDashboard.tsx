import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Focus, ListChecks, Wind, Clock, Calendar } from "lucide-react";
import { useStats } from "@/contexts/StatsContext";

const PIE_COLORS = ["hsl(160, 40%, 45%)", "hsl(0, 60%, 55%)", "hsl(35, 60%, 55%)"];

const ParentDashboard = () => {
  const { today, streak, getLast7Days, history } = useStats();
  const last7 = getLast7Days();

  const totalFocusMin = last7.reduce((s, d) => s + d.focusMinutes, 0);
  const totalFocusSessions = last7.reduce((s, d) => s + d.focusSessions, 0);
  const totalTasksCompleted = last7.reduce((s, d) => s + d.tasksCompleted, 0);
  const totalTasksCreated = last7.reduce((s, d) => s + d.tasksCreated, 0);
  const totalCalm = last7.reduce((s, d) => s + d.calmSessions, 0);
  const avgFocus = totalFocusSessions > 0 ? (totalFocusSessions / 7).toFixed(1) : "0";
  const taskPct = totalTasksCreated > 0 ? Math.round((totalTasksCompleted / totalTasksCreated) * 100) : 0;

  // Routine adherence from today
  const routineDone = today.routineCompleted;
  const routineTotal = today.routineTotal || 1;
  const routineSkipped = routineTotal - routineDone;
  const routineAdherence = [
    { name: "Completed", value: routineDone },
    { name: "Remaining", value: routineSkipped },
  ];

  // Build weekly task data for line chart
  const taskTrend = last7.map((d) => ({
    day: d.day,
    completed: d.tasksCompleted,
    created: d.tasksCreated,
  }));

  const summaryStats = [
    { icon: Focus, label: "Avg. focus / day", value: `${avgFocus} sessions` },
    { icon: Clock, label: "Total focus time", value: `${(totalFocusMin / 60).toFixed(1)} hrs` },
    { icon: ListChecks, label: "Task completion", value: `${taskPct}%` },
    { icon: Wind, label: "Calm sessions", value: `${totalCalm} this week` },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last 7 days · {streak} day streak</span>
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground">Progress Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time stats from your NeuroSync activity.</p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map(({ icon: Icon, label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4">
            <Icon className="w-5 h-5 text-primary mb-2" />
            <div className="text-xl font-bold font-display text-foreground">{value}</div>
            <span className="text-xs text-muted-foreground">{label}</span>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold font-display text-foreground mb-4">Focus Sessions (7 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(40, 20%, 90%)", fontSize: "12px" }} />
              <Bar dataKey="focusSessions" fill="hsl(160, 40%, 45%)" radius={[6, 6, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold font-display text-foreground mb-4">Tasks Created vs Completed</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={taskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(40, 20%, 90%)", fontSize: "12px" }} />
              <Line type="monotone" dataKey="created" stroke="hsl(260, 25%, 55%)" strokeWidth={2} dot={{ r: 4 }} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="hsl(160, 40%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold font-display text-foreground mb-4">Today's Routine</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={routineAdherence} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {routineAdherence.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(40, 20%, 90%)", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {routineAdherence.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold font-display text-foreground mb-4">Focus Minutes by Day</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last7} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" unit=" min" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(40, 20%, 90%)", fontSize: "12px" }} />
              <Bar dataKey="focusMinutes" fill="hsl(200, 45%, 50%)" radius={[6, 6, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Dynamic insights */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="ns-gradient-sage rounded-2xl p-5">
        <h4 className="font-semibold font-display text-foreground mb-2">Insights</h4>
        <ul className="space-y-2 text-sm text-foreground/70">
          {totalFocusSessions > 0 ? (
            <li>• You've completed {totalFocusSessions} focus session{totalFocusSessions !== 1 ? "s" : ""} totaling {totalFocusMin} minutes this week.</li>
          ) : (
            <li>• Start your first focus session to see stats here!</li>
          )}
          {totalTasksCompleted > 0 && (
            <li>• {totalTasksCompleted} subtask{totalTasksCompleted !== 1 ? "s" : ""} completed out of {totalTasksCreated} created ({taskPct}% completion rate).</li>
          )}
          {totalCalm > 0 && (
            <li>• {totalCalm} calm session{totalCalm !== 1 ? "s" : ""} this week — great self-regulation!</li>
          )}
          {streak > 1 && (
            <li>• You're on a {streak}-day streak. Keep it going!</li>
          )}
          {history.length === 0 && (
            <li>• Use Focus Mode, Task Breakdown, or Calm Zone to start tracking your progress.</li>
          )}
        </ul>
      </motion.div>
    </div>
  );
};

export default ParentDashboard;
