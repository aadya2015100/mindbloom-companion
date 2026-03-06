import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStats } from "@/contexts/StatsContext";

interface SubTask { id: string; text: string; done: boolean; }
interface Task { id: string; title: string; subtasks: SubTask[]; expanded: boolean; }

const suggestSubtasks = (title: string): string[] => {
  const lower = title.toLowerCase();
  if (lower.includes("essay") || lower.includes("write") || lower.includes("paper"))
    return ["Research the topic", "Create an outline", "Write the introduction", "Write body paragraphs", "Write conclusion", "Proofread and edit"];
  if (lower.includes("study") || lower.includes("exam") || lower.includes("test"))
    return ["Gather study materials", "Review notes for 20 min", "Practice questions", "Take a short break", "Review difficult topics"];
  if (lower.includes("project") || lower.includes("presentation"))
    return ["Define the goal", "List key points", "Gather resources", "Create first draft", "Review and refine"];
  return ["Break this into a first step", "Work on it for 15 minutes", "Review progress", "Take a break"];
};

const TaskBreakdown = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const { logTaskCreated, logTaskCompleted } = useStats();
  const prevCompletedRef = useRef(0);

  // Track completed subtask count changes
  useEffect(() => {
    const totalCompleted = tasks.reduce((sum, t) => sum + t.subtasks.filter((s) => s.done).length, 0);
    const diff = totalCompleted - prevCompletedRef.current;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) logTaskCompleted();
    }
    prevCompletedRef.current = totalCompleted;
  }, [tasks, logTaskCompleted]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const subs = suggestSubtasks(newTask);
    logTaskCreated();
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title: newTask, subtasks: subs.map((s) => ({ id: crypto.randomUUID(), text: s, done: false })), expanded: true }]);
    setNewTask("");
  };

  const toggleExpand = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)));

  const toggleSubtask = (taskId: string, subId: string) =>
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)) } : t));

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const addSubtask = (taskId: string, text: string) => {
    if (!text.trim()) return;
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: crypto.randomUUID(), text, done: false }] } : t));
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-foreground">Task Breakdown</h1>
        <p className="text-muted-foreground mt-1">Big tasks feel smaller when broken into steps. Add a task and we'll suggest steps.</p>
      </motion.div>

      <div className="flex gap-2">
        <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="e.g. Write my history essay" className="rounded-xl" />
        <Button onClick={addTask} className="rounded-xl gap-1"><Sparkles className="w-4 h-4" /> Break Down</Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map((task) => {
            const done = task.subtasks.filter((s) => s.done).length;
            const total = task.subtasks.length;
            const pct = total > 0 ? (done / total) * 100 : 0;
            return (
              <motion.div key={task.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleExpand(task.id)}>
                  {task.expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <div className="flex-1">
                    <h3 className="font-semibold font-display text-foreground">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} /></div>
                      <span className="text-xs text-muted-foreground">{done}/{total}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <AnimatePresence>
                  {task.expanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-2">
                        {task.subtasks.map((sub) => (
                          <button key={sub.id} onClick={() => toggleSubtask(task.id, sub.id)} className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${sub.done ? "bg-sage/30" : "hover:bg-muted/60"}`}>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${sub.done ? "bg-primary border-primary" : "border-border"}`}>{sub.done && <Check className="w-3 h-3 text-primary-foreground" />}</div>
                            <span className={`text-sm ${sub.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{sub.text}</span>
                          </button>
                        ))}
                        <SubtaskAdder onAdd={(text) => addSubtask(task.id, text)} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SubtaskAdder = ({ onAdd }: { onAdd: (text: string) => void }) => {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2 pt-1">
      <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { onAdd(text); setText(""); } }} placeholder="Add a step..." className="h-8 text-sm rounded-lg" />
      <Button size="sm" variant="ghost" onClick={() => { onAdd(text); setText(""); }} className="h-8"><Plus className="w-3 h-3" /></Button>
    </div>
  );
};

export default TaskBreakdown;
