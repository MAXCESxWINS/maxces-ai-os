import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Code2,
  Globe,
  Brain,
  Wand2,
  Rocket,
  Activity,
  Github,
  Cloud,
  Keyboard,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import { AICore } from "@/components/maxces/AICore";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { OnboardingBanner, KeyboardShortcutsModal, StatusDot, PageContainer } from "@/components/maxces/Primitives";
import { useAuth } from "@/hooks/useAuth";

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
  { label: "Active Projects", value: "14", delta: "+3 this week", icon: Rocket, tone: "primary" as const },
  { label: "Tasks Today", value: "9", delta: "6 done", icon: CheckCircle2, tone: "success" as const },
  { label: "AI Requests", value: "2,481", delta: "+18%", icon: Sparkles, tone: "cyan" as const },
  { label: "Focus Score", value: "94", delta: "+6 pts", icon: TrendingUp, tone: "warning" as const },
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
  { name: "MAXCES AI OS", status: "active", progress: 78, lang: "React" },
  { name: "Orbit CRM", status: "active", progress: 42, lang: "Next.js" },
  { name: "HaloEditor", status: "building", progress: 23, lang: "Vite" },
  { name: "Cortex SDK", status: "shipped", progress: 100, lang: "TypeScript" },
];

const quickLinks = [
  { to: "/code-builder", label: "Code Builder", icon: Code2, desc: "Generate luxury React code", color: "from-purple-500/20 to-indigo-500/10" },
  { to: "/website-review", label: "Website Review", icon: Globe, desc: "Analyze any live URL", color: "from-cyan-500/20 to-blue-500/10" },
  { to: "/prompt-studio", label: "Prompt Studio", icon: Wand2, desc: "Craft premium AI prompts", color: "from-amber-500/20 to-orange-500/10" },
  { to: "/github", label: "GitHub Push", icon: Github, desc: "Safe feature branch deploy", color: "from-slate-500/20 to-slate-600/10" },
  { to: "/deploy", label: "Deploy Live", icon: Cloud, desc: "Vercel & Netlify in 1 click", color: "from-emerald-500/20 to-teal-500/10" },
  { to: "/memory", label: "Memory", icon: Brain, desc: "Long-term AI context", color: "from-pink-500/20 to-rose-500/10" },
];

const toneStyles: Record<string, string> = {
  primary: "text-purple-400 bg-purple-500/10",
  success: "text-emerald-400 bg-emerald-500/10",
  cyan: "text-cyan-400 bg-cyan-500/10",
  warning: "text-amber-400 bg-amber-500/10",
};

const statusColors: Record<string, "green" | "blue" | "gray"> = {
  active: "green",
  building: "blue",
  shipped: "gray",
};

const ONBOARDING_KEY = "maxces_onboarding_dismissed";

export function DashboardPage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const displayName =
    (user as { user_metadata?: { full_name?: string; name?: string } })?.user_metadata?.full_name ||
    (user as { user_metadata?: { name?: string } })?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    undefined;

  useEffect(() => {
    const dismissed = localStorage.getItem(ONBOARDING_KEY);
    if (!dismissed) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") setShowShortcuts(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleDismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setShowOnboarding(false);
  };

  return (
    <PageContainer>
      <TopBar
        title="Dashboard"
        subtitle="AI Operating System"
        actions={
          <button
            onClick={() => setShowShortcuts(true)}
            aria-label="Show keyboard shortcuts"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <Keyboard className="h-3.5 w-3.5" aria-hidden />
            Shortcuts
            <kbd className="rounded border border-white/10 bg-black/30 px-1 py-0.5 text-[9px] font-mono">⌘/</kbd>
          </button>
        }
      />

      {/* Onboarding Banner */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingBanner username={displayName} onDismiss={handleDismissOnboarding} />
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-6" role="region" aria-label="Overview statistics">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`grid h-8 w-8 place-items-center rounded-xl ${toneStyles[s.tone]}`}>
                  <s.icon className="h-4 w-4" aria-hidden />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/80 flex items-center gap-1">
                  <Activity className="h-3 w-3" aria-hidden /> {s.delta}
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Column */}
        <div className="space-y-6 min-w-0">
          {/* Quick Actions */}
          <section aria-labelledby="quick-actions-heading">
            <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickLinks.map((ql, i) => (
                <motion.div
                  key={ql.to}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={ql.to} aria-label={`Go to ${ql.label}`}>
                    <div className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${ql.color} p-4 hover:border-white/15 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}>
                      <div className="mb-3">
                        <div className="h-8 w-8 rounded-xl bg-white/8 grid place-items-center group-hover:bg-white/12 transition-colors">
                          <ql.icon className="h-4 w-4 text-foreground" aria-hidden />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{ql.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{ql.desc}</p>
                      <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" aria-hidden />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* AI Core */}
          <section aria-labelledby="ai-core-heading">
            <h2 id="ai-core-heading" className="sr-only">AI Assistant</h2>
            <AICore />
          </section>

          {/* Productivity Chart */}
          <GlassCard hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground text-sm">Productivity Pulse</h2>
                <p className="text-xs text-muted-foreground">Tasks completed per day</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                +23% this week
              </span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={productivity} margin={{ top: 4, right: 0, bottom: 0, left: -30 }}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "oklch(0.68 0.02 260)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.68 0.02 260)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.09 0.012 280)", border: "1px solid oklch(1 0 0 / 8%)", borderRadius: "12px", fontSize: "11px", color: "oklch(0.985 0.003 250)" }}
                  cursor={{ stroke: "oklch(1 0 0 / 12%)" }}
                />
                <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.24 295)" strokeWidth={2} fill="url(#prodGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Projects */}
          <GlassCard hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Active Projects</h2>
              <Link to="/projects" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1" aria-label="View all projects">
                View all <ArrowUpRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
            <ul className="space-y-3" role="list">
              {projects.map((p) => (
                <li key={p.name} className="flex items-center gap-3">
                  <StatusDot color={statusColors[p.status]} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{p.progress}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/8 overflow-hidden" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.name} progress`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${p.progress === 100 ? "bg-emerald-400" : "bg-gradient-to-r from-purple-500 to-cyan-400"}`}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground/60 mt-0.5 block">{p.lang}</span>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* AI Activity Feed */}
          <GlassCard hover={false}>
            <h2 className="text-sm font-semibold text-foreground mb-3">Recent AI Activity</h2>
            <ul className="space-y-2.5" role="list" aria-label="Recent AI activity feed">
              {[
                { action: "Generated luxury SaaS landing page", time: "2m ago", type: "code" },
                { action: "Analyzed stripe.com design patterns", time: "18m ago", type: "vision" },
                { action: "Pushed 14 files to GitHub branch", time: "1h ago", type: "git" },
                { action: "Deployed Orbit CRM to Vercel", time: "3h ago", type: "deploy" },
              ].map((item, i) => (
                <motion.li
                  key={item.action}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400/60" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-tight">{item.action}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{item.time}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </PageContainer>
  );
}
