import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  Brain,
  ListTodo,
  Wand2,
  Code2,
  Globe,
  Palette,
  Briefcase,
  Search,
  BarChart3,
  Clock,
  FileText,
  Settings,
  UserRound,
  Sparkles,
  Command,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const sections: {
  label: string;
  items: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}[] = [
  {
    label: "Workspace",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/chat", label: "AI Chat", icon: MessageSquare },
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/memory", label: "Memory", icon: Brain },
      { to: "/tasks", label: "Tasks", icon: ListTodo },
    ],
  },
  {
    label: "Studios",
    items: [
      { to: "/prompt-studio", label: "Prompt Studio", icon: Wand2 },
      { to: "/code-builder", label: "Code Builder", icon: Code2 },
      { to: "/website-review", label: "Website Review", icon: Globe },
      { to: "/ui-review", label: "UI Review", icon: Palette },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/business", label: "Business", icon: Briefcase },
      { to: "/research", label: "Research", icon: Search },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/timeline", label: "Timeline", icon: Clock },
      { to: "/files", label: "Files", icon: FileText },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/profile", label: "Profile", icon: UserRound },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sticky top-4 z-30 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col overflow-hidden rounded-3xl glass-strong lg:flex ml-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl glow-purple">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-secondary to-cyan-glow opacity-90" />
          <Sparkles className="relative z-10 h-5 w-5 text-white" strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold tracking-tight text-foreground">
            MAXCES
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            AI Operating System
          </div>
        </div>
      </div>

      {/* Command hint */}
      <div className="mx-4 mb-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Command className="h-3.5 w-3.5" /> Quick command
        </span>
        <kbd className="rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.label} className="mt-4 first:mt-0">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
              {section.label}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <li key={item.to} className="relative">
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/25 to-secondary/10 ring-1 ring-inset ring-primary/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Link
                      to={item.to}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active ? "text-cyan-glow" : "text-muted-foreground",
                        )}
                      />
                      <span className="truncate font-medium">{item.label}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-[0_0_10px_var(--cyan-glow)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer profile */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary ring-2 ring-white/10">
            <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-white">
              MX
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">
              Alex Maxwell
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              Pro · Cortex plan
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
        </div>
      </div>
    </aside>
  );
}
