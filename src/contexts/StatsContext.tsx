import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface DayLog {
  date: string; // YYYY-MM-DD
  focusSessions: number;
  focusMinutes: number;
  tasksCompleted: number;
  tasksCreated: number;
  routineCompleted: number;
  routineTotal: number;
  calmSessions: number;
}

interface StatsState {
  history: DayLog[];
  streak: number;
}

const todayKey = () => new Date().toISOString().slice(0, 10);
const STORAGE_KEY = "neurosync-stats";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getOrCreateToday(history: DayLog[]): DayLog {
  const key = todayKey();
  return history.find((d) => d.date === key) || {
    date: key,
    focusSessions: 0,
    focusMinutes: 0,
    tasksCompleted: 0,
    tasksCreated: 0,
    routineCompleted: 0,
    routineTotal: 0,
    calmSessions: 0,
  };
}

function calcStreak(history: DayLog[]): number {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().slice(0, 10);
    const log = sorted.find((l) => l.date === key);
    if (log && (log.focusSessions > 0 || log.tasksCompleted > 0 || log.calmSessions > 0)) {
      streak++;
    } else if (i > 0) {
      break; // allow today to be empty
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function loadState(): StatsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { history: [], streak: 0 };
}

interface StatsContextValue {
  today: DayLog;
  history: DayLog[];
  streak: number;
  logFocusSession: (minutes: number) => void;
  logTaskCompleted: () => void;
  logTaskCreated: () => void;
  logRoutineUpdate: (completed: number, total: number) => void;
  logCalmSession: () => void;
  getLast7Days: () => { day: string; date: string; focusSessions: number; focusMinutes: number; tasksCompleted: number; tasksCreated: number; routineCompleted: number; routineTotal: number; calmSessions: number }[];
}

const StatsContext = createContext<StatsContextValue | null>(null);

export const useStats = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within StatsProvider");
  return ctx;
};

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StatsState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateToday = useCallback((updater: (log: DayLog) => DayLog) => {
    setState((prev) => {
      const key = todayKey();
      const existing = prev.history.find((d) => d.date === key);
      const current = existing || getOrCreateToday(prev.history);
      const updated = updater(current);
      const newHistory = existing
        ? prev.history.map((d) => (d.date === key ? updated : d))
        : [...prev.history, updated];
      return { history: newHistory, streak: calcStreak(newHistory) };
    });
  }, []);

  const logFocusSession = useCallback((minutes: number) => {
    updateToday((d) => ({ ...d, focusSessions: d.focusSessions + 1, focusMinutes: d.focusMinutes + minutes }));
  }, [updateToday]);

  const logTaskCompleted = useCallback(() => {
    updateToday((d) => ({ ...d, tasksCompleted: d.tasksCompleted + 1 }));
  }, [updateToday]);

  const logTaskCreated = useCallback(() => {
    updateToday((d) => ({ ...d, tasksCreated: d.tasksCreated + 1 }));
  }, [updateToday]);

  const logRoutineUpdate = useCallback((completed: number, total: number) => {
    updateToday((d) => ({ ...d, routineCompleted: completed, routineTotal: total }));
  }, [updateToday]);

  const logCalmSession = useCallback(() => {
    updateToday((d) => ({ ...d, calmSessions: d.calmSessions + 1 }));
  }, [updateToday]);

  const today = getOrCreateToday(state.history);
  const streak = state.streak || calcStreak(state.history);

  const getLast7Days = useCallback(() => {
    const days: StatsContextValue["getLast7Days"] extends () => (infer R)[] ? R[] : never = [];
    const d = new Date();
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(d);
      dt.setDate(dt.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      const log = state.history.find((l) => l.date === key);
      days.push({
        day: dayNames[dt.getDay()],
        date: key,
        focusSessions: log?.focusSessions || 0,
        focusMinutes: log?.focusMinutes || 0,
        tasksCompleted: log?.tasksCompleted || 0,
        tasksCreated: log?.tasksCreated || 0,
        routineCompleted: log?.routineCompleted || 0,
        routineTotal: log?.routineTotal || 0,
        calmSessions: log?.calmSessions || 0,
      });
    }
    return days;
  }, [state.history]);

  return (
    <StatsContext.Provider value={{ today, history: state.history, streak, logFocusSession, logTaskCompleted, logTaskCreated, logRoutineUpdate, logCalmSession, getLast7Days }}>
      {children}
    </StatsContext.Provider>
  );
};
