import { createFileRoute } from "@tanstack/react-router";
import { File, FileCode, FileImage, FileText, Filter, FolderIcon, Search, Upload, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { FileAnalyzer, ProjectHealthReport } from "@/lib/ai/file-analyzer";

export const Route = createFileRoute("/_app/files")({
  head: () => ({ meta: [{ title: "MAXCES · Files & ZIP Analyzer" }] }),
  component: FilesPage,
});

const folders = [
  { n: "MAXCES AI OS", c: 128, tone: "from-purple-600 to-indigo-600" },
  { n: "Orbit CRM", c: 82, tone: "from-indigo-600 to-cyan-500" },
  { n: "Halo Editor", c: 41, tone: "from-cyan-500 to-teal-500" },
  { n: "Personal Workspace", c: 24, tone: "from-purple-500 to-cyan-400" },
];

const mockFiles = [
  { n: "package.json", type: "code", size: "3 KB", when: "Just now" },
  { n: "vite.config.ts", type: "code", size: "1 KB", when: "10m" },
  { n: "architecture-notes.md", type: "text", size: "12 KB", when: "1h" },
  { n: "supabase-schema.sql", type: "code", size: "22 KB", when: "3h" },
];

const iconFor = (t: string) =>
  t === "image" ? FileImage : t === "code" ? FileCode : t === "doc" ? File : FileText;

function FilesPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<ProjectHealthReport | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    try {
      const text = await file.text();
      const result = await FileAnalyzer.analyzeProjectFiles({
        fileName: file.name,
        fileContent: text,
      });
      setReport(result);
    } catch (err) {
      console.error("File analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <TopBar
        title="Files & Project Analyzer"
        subtitle="Upload ZIP or package.json for instant AI health audit"
        actions={
          <label className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.02] cursor-pointer sm:flex">
            <Upload className="h-4 w-4" />
            <span>Upload & Analyze</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept=".json,.js,.ts,.md,.txt,.zip" />
          </label>
        }
      />

      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm min-w-[220px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search files & project dependencies…" className="flex-1 bg-transparent outline-none text-foreground" />
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 cursor-pointer hover:bg-purple-500/20 transition-colors">
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{analyzing ? "Analyzing File..." : "Inspect File"}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept=".json,.js,.ts,.md,.txt,.zip" />
          </label>
        </div>
      </GlassCard>

      {/* AI Analysis Health Report Banner */}
      {report && (
        <GlassCard glow className="mb-6 border border-purple-500/30 p-6 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>Project Health Audit Report</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Clean & Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Framework</div>
              <div className="text-sm font-bold text-purple-300 mt-1">{report.detectedFramework}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Backend Engine</div>
              <div className="text-sm font-bold text-cyan-300 mt-1">{report.detectedBackend}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Database</div>
              <div className="text-sm font-bold text-emerald-300 mt-1">{report.detectedDatabase}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Styling Engine</div>
              <div className="text-sm font-bold text-pink-300 mt-1">{report.detectedStyling}</div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-white/10 pt-4">
            {report.rawAiText}
          </div>
        </GlassCard>
      )}

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
        <div className="mb-3 text-sm font-semibold">Project Code & Documentation Files</div>
        <ul className="divide-y divide-white/5">
          {mockFiles.map((f) => {
            const Icon = iconFor(f.type);
            return (
              <li key={f.n} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.03]">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="h-4 w-4 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{f.n}</div>
                  <div className="text-[11px] text-muted-foreground">{f.size}</div>
                </div>
                <div className="hidden text-xs text-muted-foreground sm:block">{f.when}</div>
                <button className="text-xs text-purple-400 hover:underline">Inspect</button>
              </li>
            );
          })}
        </ul>
      </GlassCard>
    </div>
  );
}
