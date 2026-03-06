import { NavLink, Outlet } from "react-router-dom";
import { Brain, Focus, ListChecks, CalendarClock, Wind, MessageSquare, LayoutDashboard, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/focus", icon: Focus, label: "Focus Mode" },
  { to: "/tasks", icon: ListChecks, label: "Task Breakdown" },
  { to: "/routine", icon: CalendarClock, label: "Routine" },
  { to: "/breathe", icon: Wind, label: "Calm Zone" },
  { to: "/communicate", icon: MessageSquare, label: "Communicate" },
  { to: "/progress", icon: BarChart3, label: "Progress" },
];

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar p-4 gap-1">
        <div className="flex items-center gap-2.5 px-3 py-4 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display text-foreground tracking-tight">NeuroSync</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around py-2 px-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
