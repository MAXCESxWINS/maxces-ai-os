import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Filter, Grid3x3, List, Plus, Search, Star } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/projects")({
  head: () => ({
    meta: [
      { title: "MAXCES · Projects" },
      { name: "description", content: "All your active projects at a glance." },
    ],
  }),
  component: ProjectsPage,
});

const projects = [
  { name: "Orbit CRM", stack: ["Next.js", "Postgres", "Stripe"], progress: 78, health: 96, updated: "2h ago", starred: true, tone: "from-primary to-secondary" },
  { name: "Halo Editor", stack: ["Tauri", "Rust", "React"], progress: 42, health: 88, updated: "yesterday", starred: false, tone: "from-secondary to-cyan-glow" },
  { name: "Northwind Analytics", stack: ["ClickHouse", "Remix"], progress: 91, health: 99, updated: "10m ago", starred: true, tone: "from-cyan-glow to-primary" },
  { name: "Lumen Docs", stack: ["Astro", "MDX"], progress: 30, health: 74, updated: "3d ago", starred: false, tone: "from-primary to-cyan-glow" },
  { name: "Cortex CLI", stack: ["Bun", "TypeScript"], progress: 65, health: 92, updated: "6h ago", starred: false, tone: "from-secondary to-primary" },
  { name: "Meridian API", stack: ["Go", "gRPC", "Redis"], progress: 55, health: 81, updated: "1d ago", starred: false, tone: "from-primary to-secondary" },
];

function ProjectsPage() {
  return (
    <div>
      <TopBar
        title="Projects"
        subtitle="14 active · 3 shipping this week"
        actions={
          <button className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/10 sm:flex">
            <Plus className="h-4 w-4" /> New
          </button>
        }
      />

      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm min-w-[220px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search projects…" className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <div className="flex overflow-hidden rounded-xl border border-white/10">
            <button className="grid h-9 w-9 place-items-center bg-white/10 text-foreground">
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button className="grid h-9 w-9 place-items-center text-muted-foreground hover:bg-white/5">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="group h-full p-0">
              {/* Cover */}
              <div className={`relative h-32 overflow-hidden rounded-t-2xl bg-gradient-to-br ${p.tone}`}>
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(1 0 0 / 30%), transparent 40%)" }} />
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(45deg, transparent 45%, oklch(1 0 0 / 20%) 50%, transparent 55%)" }} />
                <button className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur ${p.starred ? "bg-warning/30 text-warning" : "bg-black/30 text-white/70"}`}>
                  <Star className={`h-3.5 w-3.5 ${p.starred ? "fill-warning" : ""}`} />
                </button>
                <div className="absolute bottom-3 left-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/80">Updated {p.updated}</div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <ProgressRing value={p.health} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.stack.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>Progress</span>
                    <span className="text-foreground">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full bg-gradient-to-r ${p.tone}`} style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative grid h-12 w-12 place-items-center">
      <svg className="absolute inset-0" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} stroke="oklch(1 0 0 / 8%)" strokeWidth="3" fill="none" />
        <circle
          cx="22"
          cy="22"
          r={r}
          stroke="url(#ring)"
          strokeWidth="3"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.15 210)" />
            <stop offset="100%" stopColor="oklch(0.55 0.24 295)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[10px] font-semibold">{value}</span>
    </div>
  );
}
