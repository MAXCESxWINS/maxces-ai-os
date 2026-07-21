import { createFileRoute } from "@tanstack/react-router";
import { File, FileCode, FileImage, FileText, Filter, FolderIcon, Search, Upload } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";

export const Route = createFileRoute("/_app/files")({
  head: () => ({ meta: [{ title: "MAXCES · Files" }] }),
  component: FilesPage,
});

const folders = [
  { n: "Orbit CRM", c: 128, tone: "from-primary to-secondary" },
  { n: "Halo Editor", c: 82, tone: "from-secondary to-cyan-glow" },
  { n: "Northwind", c: 41, tone: "from-cyan-glow to-primary" },
  { n: "Personal", c: 24, tone: "from-primary to-cyan-glow" },
];

const files = [
  { n: "launch-checklist.md", type: "text", size: "12 KB", when: "2h" },
  { n: "orbit-hero.png", type: "image", size: "1.2 MB", when: "4h" },
  { n: "billing.ts", type: "code", size: "8 KB", when: "yesterday" },
  { n: "brand-guidelines.pdf", type: "doc", size: "3.4 MB", when: "3d" },
  { n: "cortex-schema.sql", type: "code", size: "22 KB", when: "1w" },
  { n: "onboarding-notes.md", type: "text", size: "6 KB", when: "1w" },
];

const iconFor = (t: string) =>
  t === "image" ? FileImage : t === "code" ? FileCode : t === "doc" ? File : FileText;

function FilesPage() {
  return (
    <div>
      <TopBar
        title="Files"
        subtitle="275 items · 480 MB"
        actions={
          <button className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 sm:flex">
            <Upload className="h-4 w-4" /> Upload
          </button>
        }
      />

      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm min-w-[220px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search files…" className="flex-1 bg-transparent outline-none" />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      </GlassCard>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {folders.map((f) => (
          <GlassCard key={f.n} className="group">
            <div className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.tone} ring-1 ring-white/10 transition-transform group-hover:scale-110`}>
              <FolderIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-base font-semibold">{f.n}</div>
            <div className="mt-1 text-xs text-muted-foreground">{f.c} files</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false}>
        <div className="mb-3 text-sm font-semibold">Recent</div>
        <ul className="divide-y divide-white/5">
          {files.map((f) => {
            const Icon = iconFor(f.type);
            return (
              <li key={f.n} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.03]">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="h-4 w-4 text-cyan-glow" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm">{f.n}</div>
                  <div className="text-[11px] text-muted-foreground">{f.size}</div>
                </div>
                <div className="hidden text-xs text-muted-foreground sm:block">{f.when}</div>
                <button className="text-xs text-muted-foreground hover:text-foreground">Open</button>
              </li>
            );
          })}
        </ul>
      </GlassCard>
    </div>
  );
}
