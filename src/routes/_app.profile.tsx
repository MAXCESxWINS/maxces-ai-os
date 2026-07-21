import { createFileRoute } from "@tanstack/react-router";
import { Award, Github, Linkedin, Rocket, Trophy, Twitter } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "MAXCES · Profile" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div>
      <TopBar title="Profile" subtitle="Alex Maxwell" />

      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="relative h-40 bg-gradient-to-br from-primary via-secondary to-cyan-glow">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(1 0 0 / 40%), transparent 40%)" }} />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-14 flex flex-wrap items-end gap-5">
            <div className="grid h-28 w-28 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold ring-4 ring-background">
              MX
            </div>
            <div className="min-w-0 flex-1 pt-14">
              <h2 className="text-3xl font-semibold tracking-tight">Alex Maxwell</h2>
              <p className="mt-1 text-sm text-muted-foreground">Founder · Product engineer · Building MAXCES</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { icon: Github, label: "alexmaxwell" },
                  { icon: Twitter, label: "@alexmax" },
                  { icon: Linkedin, label: "alexmaxwell" },
                ].map((s) => (
                  <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                    <s.icon className="h-3 w-3" /> {s.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ l: "Projects", v: 24 }, { l: "Streak", v: "42d" }, { l: "Level", v: 27 }].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                  <div className="text-xl font-semibold">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-xl font-semibold"><Trophy className="h-4 w-4 text-warning" /> Achievements</div>
          <ul className="space-y-2 text-sm">
            {[
              { t: "Ship it · 10 projects", d: "Completed" },
              { t: "Marathon · 30-day streak", d: "Completed" },
              { t: "Cortex whisperer · 10K prompts", d: "In progress · 8.4K" },
              { t: "Open source · 100 stars", d: "In progress · 68" },
            ].map((a) => (
              <li key={a.t} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <div className="text-sm">{a.t}</div>
                <div className="text-[11px] text-muted-foreground">{a.d}</div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-xl font-semibold"><Award className="h-4 w-4 text-cyan-glow" /> Skills</div>
          <div className="space-y-3">
            {[
              { k: "Product design", v: 92 },
              { k: "TypeScript", v: 88 },
              { k: "Systems thinking", v: 84 },
              { k: "Writing", v: 78 },
            ].map((s) => (
              <div key={s.k}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.k}</span>
                  <span>{s.v}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-glow" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-xl font-semibold"><Rocket className="h-4 w-4 text-cyan-glow" /> Goals · Q3</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3">Reach $150K MRR</li>
            <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3">Ship Halo Editor 1.0</li>
            <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3">Publish 12 essays</li>
            <li className="rounded-xl border border-white/5 bg-white/[0.03] p-3">Hire first ML engineer</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
