import { createFileRoute } from "@tanstack/react-router";
import { Copy, Heart, Play, Sparkles, Wand2 } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/prompt-studio")({
  head: () => ({ meta: [{ title: "MAXCES · Prompt Studio" }] }),
  component: PromptStudioPage,
});

const templates = [
  { name: "Sales email · v3", cat: "Marketing", uses: 128 },
  { name: "Bug triage prompt", cat: "Engineering", uses: 89 },
  { name: "Design critique", cat: "Design", uses: 62 },
  { name: "Weekly retro", cat: "Personal", uses: 41 },
  { name: "SQL to English", cat: "Data", uses: 218 },
  { name: "Investor update", cat: "Business", uses: 26 },
];

const sample = `You are MAXCES, a senior product strategist.

Context:
- Product: {{product}}
- Audience: {{audience}}
- Constraint: {{constraint}}

Task:
1. Ask ONE clarifying question if the brief is ambiguous.
2. Produce 3 distinct strategic angles.
3. For each angle: hook, positioning, risks.

Voice:
- Concise. Concrete. Zero fluff.`;

function PromptStudioPage() {
  return (
    <div>
      <TopBar title="Prompt Studio" subtitle="Craft prompts like a poet" />
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <GlassCard className="h-fit">
          <div className="mb-3 text-sm font-semibold">Library</div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Templates</div>
          <ul className="space-y-1">
            {templates.map((t, i) => (
              <li key={t.name} className={`group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm ${i === 0 ? "bg-primary/15 text-foreground ring-1 ring-inset ring-primary/30" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                <div className="min-w-0">
                  <div className="truncate">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground/70">{t.cat} · {t.uses} runs</div>
                </div>
                <Heart className={`h-3.5 w-3.5 shrink-0 ${i === 0 ? "text-destructive" : "text-muted-foreground/40 group-hover:text-muted-foreground"}`} />
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard hover={false} className="p-0">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Wand2 className="h-4 w-4 text-cyan-glow" />
              <span className="font-semibold">Strategist · v3</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">Marketing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10">
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30">
                <Play className="h-3.5 w-3.5" /> Run
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-foreground/90">
              <pre className="whitespace-pre-wrap">{sample}</pre>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-cyan-glow" /> Preview output
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
                <p><strong className="text-cyan-glow">1. The "quiet luxury" angle</strong> — sell restraint. Position MAXCES as the tool serious operators use in silence.</p>
                <p><strong className="text-cyan-glow">2. The "second brain" angle</strong> — a memory that never forgets. Emphasize continuity across projects and time.</p>
                <p><strong className="text-cyan-glow">3. The "command room" angle</strong> — density, control, speed. For power users who resent bloat.</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
