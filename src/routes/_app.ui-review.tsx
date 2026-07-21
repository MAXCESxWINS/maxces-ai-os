import { createFileRoute } from "@tanstack/react-router";
import { Palette, Type, Grid3x3, Zap, Eye, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/ui-review")({
  head: () => ({ meta: [{ title: "MAXCES · UI Review" }] }),
  component: UIReviewPage,
});

const scores = [
  { label: "Typography", value: 92, icon: Type },
  { label: "Spacing", value: 84, icon: Grid3x3 },
  { label: "Color", value: 89, icon: Palette },
  { label: "Motion", value: 76, icon: Zap },
  { label: "Accessibility", value: 81, icon: Eye },
];

function UIReviewPage() {
  return (
    <div>
      <TopBar title="UI Review" subtitle="Halo Editor · onboarding" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="relative h-[420px] bg-gradient-to-br from-primary/20 via-black to-secondary/10">
            <div className="absolute inset-6 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl">
              <div className="grid h-full grid-cols-[220px_1fr]">
                <div className="border-r border-white/5 p-4 space-y-2">
                  <div className="h-3 w-24 rounded bg-white/20" />
                  {[1,2,3,4].map((i) => <div key={i} className="h-2 w-full rounded bg-white/10" />)}
                </div>
                <div className="p-6">
                  <div className="h-6 w-56 rounded bg-white/30" />
                  <div className="mt-3 h-3 w-72 rounded bg-white/15" />
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="h-32 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 ring-1 ring-white/10" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur">Screenshot preview</span>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Overall rating</div>
                <div className="mt-1 text-4xl font-semibold tracking-tight">A-</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold text-gradient">84</div>
                <div className="text-xs text-muted-foreground">Composite score</div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          {scores.map((s) => (
            <GlassCard key={s.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <s.icon className="h-4 w-4 text-cyan-glow" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-sm font-semibold">{s.value}</div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-glow" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}

          <GlassCard>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-cyan-glow" /> Cortex notes</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Elegant hierarchy overall. The onboarding CTA and step indicator compete visually. Consider unifying to a single accent and reducing motion on the sidebar hover for a calmer feel.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
