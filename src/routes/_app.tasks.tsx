import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, Flag, Plus } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "MAXCES · Tasks" }] }),
  component: TasksPage,
});

const columns = [
  {
    title: "Today",
    accent: "from-primary to-secondary",
    tasks: [
      { t: "Ship Orbit CRM v1.4", pr: "high", done: true },
      { t: "Review Halo UI direction", pr: "med", done: true },
      { t: "Deep work · Northwind API", pr: "high", done: false, time: "2h" },
      { t: "1:1 with Priya", pr: "med", done: false, time: "30m" },
    ],
  },
  {
    title: "This week",
    accent: "from-secondary to-cyan-glow",
    tasks: [
      { t: "Draft Q3 roadmap", pr: "high", done: false },
      { t: "Recruit ML eng", pr: "med", done: false },
      { t: "Migrate design tokens", pr: "low", done: false },
    ],
  },
  {
    title: "Backlog",
    accent: "from-cyan-glow to-primary",
    tasks: [
      { t: "Explore Cortex plugins", pr: "low", done: false },
      { t: "Rewrite billing tests", pr: "med", done: false },
      { t: "Try new prompt eval harness", pr: "low", done: false },
    ],
  },
];

const prClass: Record<string, string> = {
  high: "text-destructive",
  med: "text-warning",
  low: "text-muted-foreground",
};

function TasksPage() {
  return (
    <div>
      <TopBar
        title="Tasks"
        subtitle="Everything you're on"
        actions={
          <button className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 sm:flex">
            <Plus className="h-4 w-4" /> New task
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((c) => (
          <GlassCard key={c.title} hover={false} className="p-0">
            <div className={`rounded-t-2xl bg-gradient-to-r ${c.accent} px-5 py-3`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{c.title}</div>
                <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-white/90">{c.tasks.length}</span>
              </div>
            </div>
            <ul className="space-y-2 p-4">
              {c.tasks.map((t) => (
                <li key={t.t} className="group rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05]">
                  <div className="flex items-start gap-3">
                    <button className="mt-0.5 shrink-0">
                      {t.done ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground group-hover:text-cyan-glow" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.t}</div>
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className={`flex items-center gap-1 ${prClass[t.pr]}`}><Flag className="h-3 w-3" />{t.pr}</span>
                        {t.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.time}</span>}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
