import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, CartesianGrid } from "recharts";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { ArrowDown, ArrowUp, Lightbulb, Target, TrendingUp, Lock } from "lucide-react";
import { PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/business")({
  head: () => ({ meta: [{ title: "MAXCES · Business" }] }),
  component: BusinessPage,
});

const revenue = [
  { m: "Jan", you: 24, comp: 22 },
  { m: "Feb", you: 32, comp: 25 },
  { m: "Mar", you: 41, comp: 31 },
  { m: "Apr", you: 48, comp: 34 },
  { m: "May", you: 56, comp: 38 },
  { m: "Jun", you: 71, comp: 44 },
  { m: "Jul", you: 89, comp: 52 },
];

const pros = ["Loyal power-users", "Fast release cadence", "Distinctive design", "Zero-config UX"];
const cons = ["Small team", "No enterprise SSO yet", "Docs coverage 62%", "Limited integrations"];

const ideas = [
  { t: "Team seats + billing", impact: 9, effort: 6 },
  { t: "Weekly digest email", impact: 6, effort: 3 },
  { t: "SSO / SCIM", impact: 8, effort: 8 },
  { t: "Public API", impact: 7, effort: 7 },
];

function BusinessPage() {
  return (
    <PageContainer>
      <TopBar title="Business" subtitle="Your operating picture" />

      {/* Closed Beta Banner */}
      <GlassCard className="border border-purple-500/20 bg-purple-500/5 mb-6 p-4" hover={false}>
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
            <Lock className="h-3 w-3" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Closed Beta Preview</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              Business intelligence indicators, charts, and metrics are currently generated from simulated startup financial datasets. 
              Full integration with Stripe and database billing schemas will be available in a future Beta update.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "MRR", v: "$89.4K", d: "+18%", up: true },
          { l: "Active users", v: "12,481", d: "+9%", up: true },
          { l: "Churn", v: "2.1%", d: "-0.4%", up: true },
          { l: "NPS", v: "62", d: "-3", up: false },
        ].map((s) => (
          <GlassCard key={s.l}>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
            <div className="mt-2 text-3xl font-semibold">{s.v}</div>
            <div className={`mt-1 inline-flex items-center gap-1 text-xs ${s.up ? "text-success" : "text-warning"}`}>
              {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {s.d}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-1 text-xl font-semibold">You vs. Competitor</div>
          <div className="mb-4 text-xs text-muted-foreground">Monthly revenue, thousands USD</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "oklch(0.1 0.014 280 / 95%)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="comp" stroke="oklch(0.5 0.02 260)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="you" stroke="oklch(0.55 0.24 295)" strokeWidth={3} dot={{ fill: "oklch(0.82 0.15 210)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 text-xl font-semibold">Pros / Cons</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-success">Pros</div>
              <ul className="space-y-1.5">{pros.map((p) => <li key={p} className="rounded-lg border border-success/20 bg-success/5 px-2.5 py-1.5 text-foreground/90">{p}</li>)}</ul>
            </div>
            <div>
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-destructive">Cons</div>
              <ul className="space-y-1.5">{cons.map((c) => <li key={c} className="rounded-lg border border-destructive/20 bg-destructive/5 px-2.5 py-1.5 text-foreground/90">{c}</li>)}</ul>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-1 flex items-center gap-2 text-xl font-semibold"><Target className="h-4 w-4 text-cyan-glow" /> Priority matrix</div>
          <div className="mb-4 text-xs text-muted-foreground">Impact vs. effort</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ideas}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="t" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "oklch(0.1 0.014 280 / 95%)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Bar dataKey="impact" fill="oklch(0.55 0.24 295)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="effort" fill="oklch(0.82 0.15 210)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-xl font-semibold"><Lightbulb className="h-4 w-4 text-cyan-glow" /> Growth ideas</div>
          <ul className="space-y-2 text-sm">
            {["Launch Product Hunt Sept 12", "Design partner beta w/ 5 studios", "Weekly retention teardown video", "Bundle w/ Cortex API"].map((i) => (
              <li key={i} className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-glow" />
                <span className="text-muted-foreground">{i}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
