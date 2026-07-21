import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Globe, Zap } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/website-review")({
  head: () => ({ meta: [{ title: "MAXCES · Website Review" }] }),
  component: WebsiteReviewPage,
});

const scores = [
  { label: "Performance", value: 92, tone: "from-success to-cyan-glow" },
  { label: "SEO", value: 87, tone: "from-cyan-glow to-primary" },
  { label: "Accessibility", value: 78, tone: "from-warning to-cyan-glow" },
  { label: "Security", value: 96, tone: "from-primary to-secondary" },
];

const issues = [
  { level: "critical", title: "Missing HTTP security headers", detail: "Add strict-transport-security and content-security-policy on / and /docs." },
  { level: "warn", title: "Largest Contentful Paint 2.8s on 3G", detail: "Hero image is 1.2MB. Serve WebP + priority preload." },
  { level: "warn", title: "6 images without alt text", detail: "Blog post images between May and July need descriptive alt text." },
  { level: "info", title: "Sitemap out of date", detail: "3 new pages missing from /sitemap.xml. Regenerate on deploy." },
];

const levelColor: Record<string, string> = {
  critical: "text-destructive bg-destructive/10 border-destructive/30",
  warn: "text-warning bg-warning/10 border-warning/30",
  info: "text-cyan-glow bg-cyan-glow/10 border-cyan-glow/30",
};

function WebsiteReviewPage() {
  return (
    <div>
      <TopBar title="Website Review" subtitle="orbit-crm.com · scanned 2m ago" />

      <GlassCard hover={false} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 ring-1 ring-white/10">
            <Globe className="h-4 w-4 text-cyan-glow" />
          </div>
          <input
            defaultValue="https://orbit-crm.com"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
          />
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30">
            <Zap className="h-4 w-4" /> Rescan
          </button>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scores.map((s) => (
          <GlassCard key={s.label}>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-5xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-xs text-success">/ 100</div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div className={`h-full rounded-full bg-gradient-to-r ${s.tone}`} style={{ width: `${s.value}%` }} />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <GlassCard>
          <div className="mb-4 text-xl font-semibold">Issues</div>
          <ul className="space-y-3">
            {issues.map((i) => (
              <li key={i.title} className={`rounded-xl border p-4 ${levelColor[i.level]}`}>
                <div className="flex items-start gap-3">
                  {i.level === "info" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                  <div>
                    <div className="text-sm font-semibold">{i.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{i.detail}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <div className="mb-3 text-sm font-semibold">Recommendations</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Adopt image priority hints on hero and above-the-fold cards.</li>
            <li>Pre-render /pricing and /docs with static output for TTFB.</li>
            <li>Consolidate 3 external fonts to 1 variable font.</li>
            <li>Add JSON-LD product schema on landing.</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
