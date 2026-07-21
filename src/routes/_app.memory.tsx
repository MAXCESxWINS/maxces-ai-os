import { createFileRoute } from "@tanstack/react-router";
import { Brain, Pin, Search, Tag } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/memory")({
  head: () => ({ meta: [{ title: "MAXCES · Memory" }] }),
  component: MemoryPage,
});

const memories = [
  { title: "Orbit CRM launch plan", tag: "Product", when: "Today", pinned: true, body: "Ship v1.4 Wed. Focus: billing edge cases + observability. Priya owns Slack alerts wiring." },
  { title: "My writing style", tag: "Personal", when: "Yesterday", pinned: true, body: "Short sentences. Concrete verbs. Avoid 'in order to'. Never marketing fluff." },
  { title: "Northwind schema", tag: "Data", when: "2d", body: "orders → order_items → products. Partitioned by month. Latency budget: 200ms p95." },
  { title: "Design system tokens", tag: "Design", when: "3d", body: "Primary purple, cyan highlights. Radii scale 1x → 1.5x → 2x. Motion 220ms cubic." },
  { title: "Meeting notes: Q3", tag: "Business", when: "1w", body: "Focus on retention. Cut two features. Hire ML eng in October." },
  { title: "Book: The Timeless Way", tag: "Reading", when: "2w", body: "Pattern language. Quality without a name. Reread ch. 4 before starting Halo." },
];

function MemoryPage() {
  return (
    <div>
      <TopBar title="Memory" subtitle="Your second brain" />
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <GlassCard className="h-fit">
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search memory…" className="flex-1 bg-transparent outline-none" />
          </div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tags</div>
          <ul className="space-y-1 text-sm">
            {["All", "Product", "Personal", "Data", "Design", "Business", "Reading"].map((t, i) => (
              <li key={t} className={`flex items-center justify-between rounded-lg px-2.5 py-2 ${i === 0 ? "bg-white/5 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                <span className="flex items-center gap-2"><Tag className="h-3.5 w-3.5" />{t}</span>
                <span className="text-[10px] text-muted-foreground/60">{i === 0 ? "48" : Math.floor(Math.random() * 9) + 2}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Brain className="h-4 w-4 text-cyan-glow" /> Knowledge graph</div>
            <div className="relative h-32 overflow-hidden rounded-lg bg-black/40">
              <svg viewBox="0 0 200 128" className="absolute inset-0 h-full w-full">
                {[[40,40],[100,30],[160,50],[70,90],[130,95],[110,60]].map(([x,y],i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r={4 + (i%3)} fill="oklch(0.82 0.15 210)" opacity="0.9" />
                    <circle cx={x} cy={y} r={10} fill="oklch(0.55 0.24 295)" opacity="0.2" />
                  </g>
                ))}
                <path d="M40 40 L100 30 L160 50 L130 95 L70 90 Z M110 60 L100 30 M110 60 L130 95" stroke="oklch(1 0 0 / 20%)" fill="none" />
              </svg>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {memories.map((m) => (
            <GlassCard key={m.title}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {m.pinned && <Pin className="h-3.5 w-3.5 text-cyan-glow" />}
                    <h3 className="truncate text-base font-semibold">{m.title}</h3>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">{m.tag}</span>
                    <span>{m.when}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
