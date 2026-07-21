import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Filter, Grid3x3, List, Plus, Search, Star, ShieldCheck, Sparkles, Activity, CheckCircle2, Clock, Lock } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/projects")({
  head: () => ({
    meta: [
      { title: "MAXCES · Projects & Health Dashboard" },
      { name: "description", content: "All your active projects and AI Agent execution health." },
    ],
  }),
  component: ProjectsPage,
});

const PROJECTS = [
  { name: "MAXCES AI OS", stack: ["React 19", "Supabase", "Gemini 2.5"], progress: 95, health: 98, updated: "Just now", starred: true, tone: "from-purple-600 to-indigo-600" },
  { name: "Orbit CRM", stack: ["Next.js", "Postgres", "Stripe"], progress: 78, health: 96, updated: "2h ago", starred: true, tone: "from-indigo-600 to-cyan-500" },
  { name: "Halo Editor", stack: ["Tauri", "Rust", "React"], progress: 42, health: 88, updated: "Yesterday", starred: false, tone: "from-cyan-500 to-teal-500" },
  { name: "Northwind Analytics", stack: ["ClickHouse", "Remix"], progress: 91, health: 99, updated: "10m ago", starred: true, tone: "from-purple-500 to-cyan-400" },
];

interface AgentLog {
  id: string;
  agent_name: string;
  task_summary: string;
  status: string;
  created_at: string;
}

function ProjectsPage() {
  const { user } = useAuth();
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBetaNotice, setShowBetaNotice] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAgentLogs();
    }
  }, [user?.id]);

  const loadAgentLogs = async () => {
    try {
      const { data } = await (supabase as any)
        .from('agent_execution_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) setAgentLogs(data);
    } catch (err) {
      console.warn("Could not fetch agent logs:", err);
    }
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return PROJECTS;
    const q = searchQuery.toLowerCase();
    return PROJECTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.stack.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <PageContainer>
      <TopBar
        title="Projects & Health Dashboard"
        subtitle={`${PROJECTS.length} active projects · Multi-Agent Intelligence Monitored`}
        actions={
          <button
            onClick={() => setShowBetaNotice(true)}
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 sm:flex"
            aria-label="Create new project"
          >
            <Plus className="h-4 w-4" aria-hidden /> New Project
          </button>
        }
      />

      {/* Closed Beta Project Slot Notice */}
      {showBetaNotice && (
        <GlassCard className="border border-purple-500/25 bg-purple-500/5 mb-6 p-4" hover={false}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Closed Beta Slot Constraint</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  Multiple active workspaces are locked in this beta release. 
                  All AI code generation, preview, and git commits operate on your primary project workspace slot.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBetaNotice(false)}
              className="text-[10px] font-semibold text-muted-foreground hover:text-foreground shrink-0"
            >
              Dismiss
            </button>
          </div>
        </GlassCard>
      )}

      {/* Global Health Metrics Bar */}
      <GlassCard glow className="mb-6 border border-purple-500/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-base font-bold text-foreground">
            <Activity className="h-5 w-5 text-purple-400" />
            <span>MAXCES Platform Health & Agent Status</span>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> 98% Optimal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">UI / UX Score</div>
            <div className="text-xl font-bold text-purple-300 mt-1">95/100</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Performance</div>
            <div className="text-xl font-bold text-cyan-300 mt-1">92/100</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">SEO Rating</div>
            <div className="text-xl font-bold text-emerald-300 mt-1">90/100</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Security Level</div>
            <div className="text-xl font-bold text-pink-300 mt-1">98/100</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Code Quality</div>
            <div className="text-xl font-bold text-indigo-300 mt-1">96/100</div>
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm min-w-[220px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active projects…"
              className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </GlassCard>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-6">
        {filteredProjects.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="group h-full p-0">
              <div className={`relative h-32 overflow-hidden rounded-t-2xl bg-gradient-to-br ${p.tone}`}>
                <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur bg-black/30 text-amber-400">
                  <Star className={`h-3.5 w-3.5 ${p.starred ? "fill-amber-400" : ""}`} />
                </div>
                <div className="absolute bottom-3 left-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/80">Updated {p.updated}</div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
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

      {/* Multi-Agent Execution Audit Stream */}
      {agentLogs.length > 0 && (
        <GlassCard hover={false} className="p-5 border border-purple-500/20">
          <div className="mb-3 text-sm font-semibold flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Recent Multi-Agent Execution Audit Stream</span>
          </div>
          <ul className="space-y-2">
            {agentLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                    {log.agent_name} Agent
                  </span>
                  <span className="text-foreground">{log.task_summary}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </PageContainer>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative grid h-12 w-12 place-items-center">
      <svg className="absolute inset-0" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
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
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[10px] font-semibold text-foreground">{value}</span>
    </div>
  );
}
