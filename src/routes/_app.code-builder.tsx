import { createFileRoute } from "@tanstack/react-router";
import { Code2, FileCode, Play, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/code-builder")({
  head: () => ({ meta: [{ title: "MAXCES · Code Builder" }] }),
  component: CodeBuilderPage,
});

const files = [
  { name: "index.ts", active: true },
  { name: "auth.ts" },
  { name: "session.ts" },
  { name: "utils.ts" },
];

const code = `import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSession = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ token: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const user = await verify(data.token);
    return { user, expiresAt: Date.now() + 3600_000 };
  });`;

function CodeBuilderPage() {
  return (
    <div>
      <TopBar title="Code Builder" subtitle="Ship real code with your cortex" />
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
        <GlassCard className="h-fit">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><FileCode className="h-4 w-4 text-cyan-glow" />Files</div>
          <ul className="space-y-1 text-sm">
            {files.map((f) => (
              <li key={f.name} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${f.active ? "bg-primary/15 text-foreground ring-1 ring-inset ring-primary/30" : "text-muted-foreground hover:bg-white/5"}`}>
                <Code2 className="h-3.5 w-3.5" />{f.name}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard hover={false} className="p-0">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              {["index.ts", "auth.ts"].map((t, i) => (
                <div key={t} className={`rounded-t-md px-3 py-1 text-xs ${i === 0 ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"}`}>{t}</div>
              ))}
            </div>
            <button className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30">
              <Play className="h-3.5 w-3.5" /> Run
            </button>
          </div>
          <div className="relative overflow-hidden bg-black/50 p-5 font-mono text-xs leading-6">
            <pre className="whitespace-pre-wrap">
              {code.split("\n").map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-6 select-none text-right text-muted-foreground/40">{i + 1}</span>
                  <span className="text-foreground/90">{colorize(line)}</span>
                </div>
              ))}
            </pre>
          </div>
        </GlassCard>

        <GlassCard className="h-fit">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-cyan-glow" /> Cortex actions</div>
          <ul className="space-y-2 text-sm">
            {["Refactor to use middleware", "Add zod schema for user", "Write vitest tests", "Explain this file"].map((a) => (
              <li key={a} className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-3 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.05] hover:text-foreground">
                {a}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function colorize(line: string) {
  // extremely minimal syntax paint
  return line.split(/(\b(?:import|from|const|export|async|await|return|new)\b|"[^"]*"|\/\/.*)/).map((seg, i) => {
    if (/^(import|from|const|export|async|await|return|new)$/.test(seg))
      return <span key={i} className="text-primary">{seg}</span>;
    if (/^"/.test(seg)) return <span key={i} className="text-warning">{seg}</span>;
    if (/^\/\//.test(seg)) return <span key={i} className="text-muted-foreground">{seg}</span>;
    return <span key={i}>{seg}</span>;
  });
}
