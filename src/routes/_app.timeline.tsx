import { createFileRoute } from "@tanstack/react-router";
import { GitCommit, MessageSquare, Rocket, Wand2 } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/timeline")({
  head: () => ({ meta: [{ title: "MAXCES · Timeline" }] }),
  component: TimelinePage,
});

const days = [
  {
    date: "Today · Mon, Jul 20",
    items: [
      { icon: Rocket, tone: "text-cyan-glow", t: "Shipped Orbit CRM v1.4", d: "Billing retry + observability wiring" },
      { icon: MessageSquare, tone: "text-primary", t: "44 messages with Cortex", d: "Launch checklist and Halo onboarding" },
      { icon: GitCommit, tone: "text-success", t: "12 commits across 3 repos", d: "Peak day: 4h focus block" },
    ],
  },
  {
    date: "Yesterday · Sun, Jul 19",
    items: [
      { icon: Wand2, tone: "text-warning", t: "New prompt · Investor update", d: "Saved to library, 8 runs so far" },
      { icon: GitCommit, tone: "text-success", t: "6 commits · Halo Editor", d: "Motion polish + typography" },
    ],
  },
  {
    date: "Sat, Jul 18",
    items: [
      { icon: MessageSquare, tone: "text-primary", t: "Design critique session", d: "Cortex flagged 3 spacing regressions" },
      { icon: Rocket, tone: "text-cyan-glow", t: "Deployed Northwind v2 staging", d: "p95 down to 180ms" },
    ],
  },
];

function TimelinePage() {
  return (
    <div>
      <TopBar title="Timeline" subtitle="Everything you touched" />
      <div className="space-y-8">
        {days.map((day) => (
          <div key={day.date}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{day.date}</div>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <ul className="relative space-y-3 pl-6">
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-secondary/30 to-transparent" />
              {day.items.map((i, idx) => (
                <li key={idx} className="relative">
                  <span className="absolute -left-[22px] top-3 grid h-5 w-5 place-items-center rounded-full bg-background ring-2 ring-primary/40">
                    <i.icon className={`h-2.5 w-2.5 ${i.tone}`} />
                  </span>
                  <GlassCard className="p-4">
                    <div className="text-sm font-medium">{i.t}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{i.d}</div>
                  </GlassCard>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
