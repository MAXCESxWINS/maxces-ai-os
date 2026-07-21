import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Code2,
  Palette,
  Globe,
  Brain,
  Wand2,
  Rocket,
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AICore } from "@/components/maxces/AICore";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "MAXCES · AI Operating System" },
      {
        name: "description",
        content:
          "MAXCES AI OS — a luxury command center for your projects, prompts, code, and intelligence.",
      },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Active Projects", value: "14", delta: "+3", icon: Rocket, tone: "primary" as const },
  { label: "Tasks Today", value: "9", delta: "6 done", icon: CheckCircle2, tone: "success" as const },
  { label: "AI Requests", value: "2,481", delta: "+18%", icon: Sparkles, tone: "cyan" as const },
  { label: "Focus Score", value: "94", delta: "+6", icon: TrendingUp, tone: "warning" as const },
];

const productivity = [
  { d: "Mon", v: 42 },
  { d: "Tue", v: 55 },
  { d: "Wed", v: 61 },
  { d: "Thu", v: 48 },
  { d: "Fri", v: 78 },
  { d: "Sat", v: 66 },
  { d: "Sun", v: 84 },
];

const projects = [
  {
    name: "Orbit CRM",
    tag: "Web · Realtime",
    progress: 78,
    health: "Excellent",
    color: "from-primary to-secondary",
  },
  {
    name: "Halo Editor",
    tag: "Desktop · AI",
    progress: 42,
    health: "On track",
    color: "from-secondary to-cyan-glow",
  },
  {
    name: "Northwind Analytics",
    tag: "Dashboard · BI",
    progress: 91,
    health: "Ship-ready",
    color: "from-cyan-glow to-primary",
  },
];

const quickActions = [
  { icon: Wand2, label: "New Prompt", to: "/prompt-studio" },
  { icon: Code2, label: "Build Code", to: "/code-builder" },
  { icon: Globe, label: "Review Site", to: "/website-review" },
  { icon: Palette, label: "Review UI", to: "/ui-review" },
  { icon: Brain, label: "Save Memory", to: "/memory" },
  { icon: Activity, label: "Analytics", to: "/analytics" },
];

function DashboardPage() {
  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle="Good evening, Alex"
      />

      {/* Hero */}
      <GlassCard hover={false} className="relative overflow-hidden p-0">
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-glow">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-[0_0_10px_var(--cyan-glow)]" />
              Cortex online
            </div>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              <span className="text-gradient">The control room</span>
              <br />
              <span className="shimmer-text">of your intelligence.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              MAXCES is ready. Nine tasks queued for today, three projects near
              ship, and 14 memories synced. Shall we begin?
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                Start a conversation
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
              >
                View projects
              </Link>
            </div>
          </div>

          <div className="relative grid place-items-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-2xl" />
            <AICore size={300} label="Cortex · Ready" />
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-success">{s.delta}</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <s.icon className="h-4 w-4 text-cyan-glow" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Productivity */}
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Weekly productivity
              </div>
              <div className="mt-1 text-xl font-semibold">Peak flow this Sunday</div>
            </div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivity}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: "oklch(1 0 0 / 20%)" }}
                  contentStyle={{
                    background: "oklch(0.1 0.014 280 / 95%)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="oklch(0.82 0.15 210)"
                  strokeWidth={2.5}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Today's plan */}
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold">Today</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              6 / 9
            </div>
          </div>
          <ul className="space-y-3">
            {[
              { t: "Ship Orbit CRM v1.4", time: "10:00", done: true },
              { t: "Review Halo UI direction", time: "12:30", done: true },
              { t: "Deep work · Northwind API", time: "14:00", done: false },
              { t: "1:1 with Priya", time: "16:00", done: false },
              { t: "Weekly retro", time: "17:30", done: false },
            ].map((t) => (
              <li
                key={t.t}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-inset ${t.done ? "bg-success/20 ring-success/40" : "bg-white/5 ring-white/10"}`}
                >
                  {t.done && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-sm ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {t.t}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {t.time}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Projects + suggestions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold">Active projects</div>
            <Link to="/projects" className="text-xs text-cyan-glow hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {projects.map((p) => (
              <motion.div
                key={p.name}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${p.color} opacity-30 blur-3xl transition-opacity group-hover:opacity-60`} />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {p.tag}
                  </div>
                  <div className="mt-1 text-lg font-semibold">{p.name}</div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Progress</span>
                      <span className="text-foreground">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-success">
                    <span className="h-1 w-1 rounded-full bg-success" /> {p.health}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold">AI suggestions</div>
            <Sparkles className="h-4 w-4 text-cyan-glow" />
          </div>
          <ul className="space-y-3 text-sm">
            {[
              "Refactor Orbit CRM auth into a shared session hook.",
              "Halo Editor onboarding needs a shorter first-run.",
              "Northwind: your API p95 spiked 18% Thursday — investigate.",
            ].map((s) => (
              <li
                key={s}
                className="group flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-primary to-cyan-glow" />
                <span className="text-muted-foreground group-hover:text-foreground">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <GlassCard>
          <div className="mb-4 text-xl font-semibold">Quick actions</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-primary/40 hover:bg-white/[0.05]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 ring-1 ring-white/10 transition-transform group-hover:scale-110">
                  <a.icon className="h-4 w-4 text-cyan-glow" />
                </div>
                <div className="text-sm font-medium">{a.label}</div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
