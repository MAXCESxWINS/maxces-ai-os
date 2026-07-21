import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "MAXCES · Analytics" }] }),
  component: AnalyticsPage,
});

const hours = Array.from({ length: 12 }).map((_, i) => ({ w: `W${i + 1}`, h: 20 + Math.round(Math.sin(i) * 8 + i * 2) }));
const ai = Array.from({ length: 14 }).map((_, i) => ({ d: i + 1, req: 100 + Math.round(Math.random() * 300) }));
const share = [
  { name: "Chat", value: 46, fill: "oklch(0.55 0.24 295)" },
  { name: "Code", value: 24, fill: "oklch(0.65 0.22 260)" },
  { name: "Review", value: 18, fill: "oklch(0.82 0.15 210)" },
  { name: "Prompt", value: 12, fill: "oklch(0.72 0.17 155)" },
];

function AnalyticsPage() {
  return (
    <div>
      <TopBar title="Analytics" subtitle="What your last 90 days look like" />
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Coding hours", v: "312h", d: "+22h" },
          { l: "Projects shipped", v: "9", d: "+3" },
          { l: "AI requests", v: "18.4K", d: "+41%" },
          { l: "Focus streak", v: "42d", d: "New record" },
        ].map((s) => (
          <GlassCard key={s.l}>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
            <div className="mt-2 text-3xl font-semibold">{s.v}</div>
            <div className="mt-1 text-xs text-success">{s.d}</div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-1 text-xl font-semibold">AI usage</div>
          <div className="mb-4 text-xs text-muted-foreground">Requests per day, last 14 days</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ai}>
                <defs>
                  <linearGradient id="ai-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.15 210)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.82 0.15 210)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "oklch(0.1 0.014 280 / 95%)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="req" stroke="oklch(0.82 0.15 210)" strokeWidth={2.5} fill="url(#ai-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-1 text-xl font-semibold">Time by surface</div>
          <div className="mb-4 text-xs text-muted-foreground">Where you spend attention</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={share} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {share.map((s) => <Cell key={s.name} fill={s.fill} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.1 0.014 280 / 95%)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {share.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: s.fill }} /> {s.name} · {s.value}%
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="mt-6">
        <GlassCard>
          <div className="mb-1 text-xl font-semibold">Deep-work hours</div>
          <div className="mb-4 text-xs text-muted-foreground">Weekly, last quarter</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hours}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.68 0.02 260)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "oklch(0.1 0.014 280 / 95%)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Bar dataKey="h" fill="oklch(0.55 0.24 295)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
