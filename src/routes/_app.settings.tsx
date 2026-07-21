import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe, Languages, Palette, Plug, Shield, User } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "MAXCES · Settings" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const sections = [
    { icon: User, title: "Account", desc: "Name, avatar, email" },
    { icon: Palette, title: "Appearance", desc: "Theme, density, accent" },
    { icon: Bell, title: "Notifications", desc: "Slack, email, digest" },
    { icon: Languages, title: "Language", desc: "English (US)" },
    { icon: Globe, title: "Workspace", desc: "Team of 4 · Cortex plan" },
    { icon: Plug, title: "Integrations", desc: "GitHub, Linear, Notion" },
    { icon: Shield, title: "Security", desc: "2FA, sessions, keys" },
  ];

  return (
    <div>
      <TopBar title="Settings" subtitle="Tune your OS" />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <GlassCard className="h-fit p-3">
          <ul className="space-y-1">
            {sections.map((s, i) => (
              <li key={s.title}>
                <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${i === 1 ? "bg-primary/15 ring-1 ring-inset ring-primary/30 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                  <s.icon className={`h-4 w-4 ${i === 1 ? "text-cyan-glow" : ""}`} />
                  <div className="min-w-0">
                    <div className="truncate">{s.title}</div>
                    <div className="truncate text-[10px] text-muted-foreground/70">{s.desc}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <div className="mb-1 text-xl font-semibold">Appearance</div>
            <div className="mb-6 text-sm text-muted-foreground">MAXCES is designed dark. Choose your accent and density.</div>

            <div className="mb-6">
              <div className="mb-2 text-sm font-medium">Accent</div>
              <div className="flex gap-3">
                {[
                  ["Royal", "from-primary to-secondary"],
                  ["Cyan", "from-cyan-glow to-secondary"],
                  ["Emerald", "from-success to-cyan-glow"],
                  ["Amber", "from-warning to-destructive"],
                ].map(([name, cls], i) => (
                  <button key={name} className={`group relative h-14 flex-1 overflow-hidden rounded-xl ring-2 ${i === 0 ? "ring-cyan-glow" : "ring-white/10 hover:ring-white/25"}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${cls}`} />
                    <span className="absolute inset-x-0 bottom-1 text-center text-[10px] font-semibold uppercase tracking-widest text-white/90">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleRow label="Motion" desc="Ambient animations across UI" defaultOn />
              <ToggleRow label="Sounds" desc="Subtle interaction sounds" />
              <ToggleRow label="Cursor glow" desc="Follow-me ambient light" defaultOn />
              <ToggleRow label="Compact density" desc="Slightly tighter spacing" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-3 text-xl font-semibold">Integrations</div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["GitHub", "Linear", "Notion", "Slack", "Figma", "Vercel"].map((i, idx) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-xs font-semibold">{i.slice(0, 2)}</div>
                    <div>
                      <div className="text-sm">{i}</div>
                      <div className="text-[11px] text-muted-foreground">{idx < 4 ? "Connected" : "Not connected"}</div>
                    </div>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${idx < 4 ? "bg-success" : "bg-white/20"}`} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="min-w-0">
        <div className="text-sm">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-gradient-to-r from-primary to-secondary" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
