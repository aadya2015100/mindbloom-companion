import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Plus, GripVertical, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RoutineItem {
  id: string;
  label: string;
  time: string;
  done: boolean;
  color: string;
}

const COLORS = ["ns-gradient-sage", "ns-gradient-lavender", "ns-gradient-peach", "ns-gradient-sky"];

const defaultItems: RoutineItem[] = [
  { id: "1", label: "Morning stretch", time: "7:00 AM", done: false, color: COLORS[0] },
  { id: "2", label: "Breakfast", time: "7:30 AM", done: false, color: COLORS[2] },
  { id: "3", label: "Focus session", time: "8:30 AM", done: false, color: COLORS[0] },
  { id: "4", label: "Break & snack", time: "10:00 AM", done: false, color: COLORS[3] },
  { id: "5", label: "Study / Work", time: "10:30 AM", done: false, color: COLORS[1] },
  { id: "6", label: "Lunch", time: "12:30 PM", done: false, color: COLORS[2] },
];

const RoutineBuilder = () => {
  const [items, setItems] = useState<RoutineItem[]>(defaultItems);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("");

  const addItem = () => {
    if (!newLabel.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: newLabel,
        time: newTime || "—",
        done: false,
        color: COLORS[prev.length % COLORS.length],
      },
    ]);
    setNewLabel("");
    setNewTime("");
  };

  const toggleDone = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-foreground">Routine Builder</h1>
        <p className="text-muted-foreground mt-1">
          A visual schedule you can rearrange. Drag items to reorder.
        </p>
      </motion.div>

      {/* Progress */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Today's progress</span>
          <span className="font-semibold text-primary">{doneCount}/{items.length}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${items.length > 0 ? (doneCount / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* List */}
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
        {items.map((item) => (
          <Reorder.Item key={item.id} value={item}>
            <div
              className={`flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-colors ${
                item.done ? "bg-sage/20" : "glass-card"
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
              <button
                onClick={() => toggleDone(item.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                  item.done ? "bg-primary border-primary" : "border-border"
                }`}
              />
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {item.time}
              </div>
              <button onClick={() => remove(item.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add */}
      <div className="flex gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Activity name"
          className="rounded-xl"
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <Input
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          placeholder="Time"
          className="rounded-xl w-28"
        />
        <Button onClick={addItem} className="rounded-xl">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoutineBuilder;
