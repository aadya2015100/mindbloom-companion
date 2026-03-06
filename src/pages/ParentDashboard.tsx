import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Focus, ListChecks, Wind, Clock, Calendar } from "lucide-react";

const weeklyFocus = [
  { day: "Mon", sessions: 3, minutes: 75 },
  { day: "Tue", sessions: 4, minutes: 100 },
  { day: "Wed", sessions: 2, minutes: 50 },
  { day: "Thu", sessions: 5, minutes: 125 },
  { day: "Fri", sessions: 3, minutes: 75 },
  { day: "Sat", sessions: 1, minutes: 25 },
  { day: "Sun", sessions: 2, minutes: 50 },
];

const taskCompletion = [
  { week: "Week 1", completed: 12, created: 18 },
  { week: "Week 2", completed: 15, created: 20 },
  { week: "Week 3", completed: 22, created: 24 },
  { week: "Week 4", completed: 28, created: 30 },
];

const routineAdherence = [
  { name: "Completed", value: 72 },
  { name: "Skipped", value: 18 },
  { name: "Partial", value: 10 },
];

const PIE_COLORS = ["hsl(160, 40%, 45%)", "hsl(0, 60%, 55%)", "hsl(35, 60%, 55%)"];

const summaryStats = [
  { icon: Focus, label: "Avg. focus / day", value: "3.2 sessions", trend: "+12%" },
  { icon: Clock, label: "Total focus time", value: "8.3 hrs", trend: "+8%" },
  { icon: ListChecks, label: "Task completion", value: "87%", trend: "+15%" },
  { icon: Wind, label: "Calm sessions", value: "14 this week", trend: "+5%" },
];

const ParentDashboard = () => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">This week's overview</span>
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground">Progress Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track focus, task completion, and routine patterns over time.</p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map(({ icon: Icon, label, value, trend }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-4"
          >
            <Icon className="w-5 h-5 text-primary mb-2" />
            <div className="text-xl font-bold font-display text-foreground">{value}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-xs font-medium text-primary flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus sessions bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-semibold font-display text-foreground mb-4">Focus Sessions This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyFocus} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(40, 20%, 90%)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="sessions" fill="hsl(160, 40%, 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task completion trend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-semibold font-display text-foreground mb-4">Task Completion Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={taskCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(40, 20%, 90%)",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="created" stroke="hsl(260, 25%, 55%)" strokeWidth={2} dot={{ r: 4 }} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="hsl(160, 40%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routine adherence pie */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-semibold font-display text-foreground mb-4">Routine Adherence</h3>
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
                {entry.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Focus time bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5 lg:col-span-2"
        >
          <h3 className="font-semibold font-display text-foreground mb-4">Focus Minutes by Day</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyFocus} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" unit=" min" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(40, 20%, 90%)", fontSize: "12px" }} />
              <Bar dataKey="minutes" fill="hsl(200, 45%, 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="ns-gradient-sage rounded-2xl p-5"
      >
        <h4 className="font-semibold font-display text-foreground mb-2">Weekly Insights</h4>
        <ul className="space-y-2 text-sm text-foreground/70">
          <li>• Focus sessions peak on Thursdays — consider scheduling important tasks then.</li>
          <li>• Task completion rate improved 15% over the last 4 weeks — great momentum!</li>
          <li>• Routine adherence is at 72%. Adding reminders for morning activities may help.</li>
          <li>• Calm zone usage increased — a positive indicator of self-regulation skills.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default ParentDashboard;
