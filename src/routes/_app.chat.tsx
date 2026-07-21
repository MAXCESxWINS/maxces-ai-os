import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowUp,
  Paperclip,
  Mic,
  Sparkles,
  Pin,
  Plus,
  Search,
  Command,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { AICore } from "@/components/maxces/AICore";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({
    meta: [
      { title: "MAXCES · AI Chat" },
      { name: "description", content: "Converse with your MAXCES cortex." },
    ],
  }),
  component: ChatPage,
});

const pinned = [
  "Orbit CRM launch checklist",
  "Prompt: sales email v3",
  "Northwind SQL playground",
];

const recent = [
  { title: "Refactor auth to server functions", time: "2m" },
  { title: "Design tokens audit", time: "1h" },
  { title: "Weekly retro brief", time: "3h" },
  { title: "Halo onboarding flow", time: "Yesterday" },
  { title: "Q3 growth ideas", time: "2d" },
];

const suggestions = [
  "Summarize what I did last week",
  "Draft a launch tweet for Orbit CRM",
  "Explain my Northwind schema",
  "Plan tomorrow around deep work",
];

const messages = [
  {
    role: "assistant" as const,
    text:
      "Good evening, Alex. I pulled context from Orbit CRM and your notes from Friday. Where should we begin — the launch checklist, or the auth refactor?",
  },
  {
    role: "user" as const,
    text: "Let's start with the launch checklist. What's still open?",
  },
  {
    role: "assistant" as const,
    text: `Three items remain before you can ship:

1. **Billing edge cases** — trial expiry flow needs a retry on card decline.
2. **Onboarding copy** — the second-step CTA is ambiguous ("Continue" vs. "Set up team").
3. **Observability** — p95 latency alerts aren't wired to Slack.

I can draft the copy fix and open a PR for the alert wiring in parallel. Want me to?`,
  },
];

function ChatPage() {
  const [value, setValue] = useState("");

  return (
    <div>
      <TopBar title="AI Chat" subtitle="Cortex conversation" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left rail */}
        <div className="hidden lg:block">
          <GlassCard className="p-4">
            <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02]">
              <Plus className="h-4 w-4" />
              New conversation
            </button>
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              <input
                placeholder="Search chats…"
                className="flex-1 bg-transparent outline-none text-foreground"
              />
            </div>

            <div className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Pinned
            </div>
            <ul className="mb-4 space-y-1">
              {pinned.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  <Pin className="h-3.5 w-3.5 text-cyan-glow" />
                  <span className="truncate">{p}</span>
                </li>
              ))}
            </ul>

            <div className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Recent
            </div>
            <ul className="space-y-1">
              {recent.map((r) => (
                <li
                  key={r.title}
                  className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  <span className="truncate">{r.title}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground/60">
                    {r.time}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Chat pane */}
        <GlassCard className="flex min-h-[70vh] flex-col p-0" hover={false}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AICore size={44} />
              </div>
              <div>
                <div className="text-sm font-semibold">Cortex</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
                  Thinking with 14 memories · GPT-Cortex 1.5
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono">
                <Command className="mr-1 inline h-3 w-3" />K
              </kbd>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-8">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-secondary to-primary text-white ring-white/10"
                      : "bg-gradient-to-br from-primary/40 to-secondary/20 ring-primary/30"
                  }`}
                >
                  {m.role === "user" ? (
                    <span className="text-xs font-semibold">MX</span>
                  ) : (
                    <Sparkles className="h-4 w-4 text-cyan-glow" />
                  )}
                </div>
                <div className={`max-w-[75%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30"
                        : "border border-white/10 bg-white/[0.03] text-foreground/95"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                  {m.role === "assistant" && (
                    <div className="mt-2 flex gap-1.5 text-[11px] text-muted-foreground">
                      <button className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/5">
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                      <button className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/5">
                        <RefreshCw className="h-3 w-3" /> Regenerate
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Thinking */}
            <div className="flex gap-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-secondary/20 ring-1 ring-primary/30">
                <Sparkles className="h-4 w-4 text-cyan-glow" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-cyan-glow"
                  />
                ))}
                <span className="ml-2 text-xs shimmer-text">Thinking…</span>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 border-t border-white/5 px-6 pt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.06] hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="p-4">
            <div className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-2 transition-colors focus-within:border-primary/50">
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity group-focus-within:opacity-60"
                   style={{ background: "linear-gradient(90deg, oklch(0.55 0.24 295 / 40%), oklch(0.82 0.15 210 / 40%))" }} />
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={2}
                placeholder="Ask MAXCES anything…"
                className="w-full resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <div className="flex items-center justify-between px-2 pb-1 pt-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-center text-[10px] text-muted-foreground">
              Cortex may reference your memories, projects, and files.
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
