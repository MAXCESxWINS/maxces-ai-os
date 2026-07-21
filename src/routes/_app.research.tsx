import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ExternalLink, Search, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "MAXCES · Research" }] }),
  component: ResearchPage,
});

const sources = [
  { t: "Patterns of luxury minimalism in modern UI", src: "sitepoint.com", tag: "Design" },
  { t: "How Linear designs for calm density", src: "linear.app/blog", tag: "Product" },
  { t: "The economics of second-brain tools", src: "stratechery.com", tag: "Business" },
  { t: "Motion design: easing curves that feel expensive", src: "motion.dev", tag: "Motion" },
];

function ResearchPage() {
  return (
    <div>
      <TopBar title="Research" subtitle="Cortex has synthesized 4 sources" />

      <GlassCard hover={false} className="mb-6">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input defaultValue="how do premium AI products feel different?" className="flex-1 bg-transparent text-sm outline-none" />
          <button className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-medium text-primary-foreground">Research</button>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-xl font-semibold"><Sparkles className="h-4 w-4 text-cyan-glow" /> Synthesis</div>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
            <p>Premium AI products share three traits: <strong className="text-cyan-glow">restraint</strong>, <strong className="text-cyan-glow">continuity</strong>, and <strong className="text-cyan-glow">density that respects attention</strong>.</p>
            <p>Restraint means removing every element that isn't earning its place. Continuity means the product remembers — files, projects, conversations, tone. Density means the interface trusts its user's eye.</p>
            <p>Users describe the feeling as "the room quieted down." That's the north star.</p>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sources</div>
            <ul className="space-y-2">
              {sources.map((s) => (
                <li key={s.t} className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.05]">
                  <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-glow" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{s.t}</div>
                    <div className="text-[11px] text-muted-foreground">{s.src} · {s.tag}</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 text-sm font-semibold">Follow-up questions</div>
          <ul className="space-y-2 text-sm">
            {["What's the smallest possible MAXCES?", "Where does restraint break down?", "Which competitors miss continuity?"].map((q) => (
              <li key={q} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-3 text-muted-foreground hover:border-primary/40 hover:text-foreground">
                {q}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
