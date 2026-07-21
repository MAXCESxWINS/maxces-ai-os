import { createFileRoute } from "@tanstack/react-router";
import { Code2, FileCode, Sparkles, Plus, Download, ShieldCheck, Loader2, Terminal as TerminalIcon, Eye, LayoutGrid, Layers, Smartphone, Wand2, UploadCloud, FolderArchive } from "lucide-react";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { TerminalPanel } from "@/components/workspace/TerminalPanel";
import { LivePreviewPane } from "@/components/workspace/LivePreviewPane";
import { useAuth } from "@/hooks/useAuth";
import { WorkspaceEngine } from "@/lib/ai/workspace";
import { AICodeGenerator } from "@/lib/ai/code-generator";
import { AITestingAssistant, ProjectAuditReport } from "@/lib/ai/testing-assistant";
import { ProjectExporter } from "@/lib/ai/exporter";
import { VisionEngine } from "@/lib/vision/vision-engine";
import { BrowserEngine } from "@/lib/browser/browser-engine";
import { ProjectHealthEngine } from "@/lib/ai/project-health-engine";
import { WorkspaceFile, FileNode } from "@/types/workspace";

export const Route = createFileRoute("/_app/code-builder")({
  head: () => ({ meta: [{ title: "MAXCES · AI Code Builder Workspace" }] }),
  component: CodeBuilderPage,
});

export function CodeBuilderPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([]);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<WorkspaceFile | null>(null);
  const [auditReport, setAuditReport] = useState<ProjectAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'terminal'>('preview');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImportingZip, setIsImportingZip] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  const mockProjectId = "p1-maxces-app";

  useEffect(() => {
    if (user?.id) {
      loadWorkspaceFiles();
    } else {
      const initialMock: WorkspaceFile[] = [
        {
          id: "f1",
          user_id: "u1",
          project_id: mockProjectId,
          file_path: "src/components/Navbar.tsx",
          file_content: `import React from 'react';\n\nexport const Navbar = () => {\n  return (\n    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl">\n      <div className="text-lg font-bold text-white tracking-wider">MAXCES AI OS</div>\n      <button className="px-4 py-2 rounded-xl bg-purple-600 text-white font-medium shadow-lg hover:bg-purple-500">Launch App</button>\n    </nav>\n  );\n};`,
          file_type: "code",
          is_directory: false,
          version_number: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "f2",
          user_id: "u1",
          project_id: mockProjectId,
          file_path: "src/pages/Home.tsx",
          file_content: `import React from 'react';\nimport { Navbar } from '../components/Navbar';\n\nexport const Home = () => {\n  return (\n    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">\n      <Navbar />\n      <main className="max-w-4xl mx-auto py-16 px-6 text-center">\n        <h1 className="text-5xl font-extrabold text-white">Autonomous AI Operating System</h1>\n        <p className="mt-4 text-slate-400">Build software applications directly from conversation.</p>\n      </main>\n    </div>\n  );\n};`,
          file_type: "code",
          is_directory: false,
          version_number: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setWorkspaceFiles(initialMock);
      setActiveFile(initialMock[0]);
      setFileTree(WorkspaceEngine.generateFileTree(initialMock));
    }
  }, [user?.id]);

  const loadWorkspaceFiles = async () => {
    if (!user?.id) return;
    const files = await WorkspaceEngine.getProjectFiles({ userId: user.id, projectId: mockProjectId });
    if (files.length > 0) {
      setWorkspaceFiles(files);
      setActiveFile(files[0]);
      setFileTree(WorkspaceEngine.generateFileTree(files));
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      alert('Please upload a valid .zip file archive.');
      return;
    }

    setIsImportingZip(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await WorkspaceEngine.importZipArchive({
        userId: user?.id || 'guest',
        projectId: mockProjectId,
        zipArrayBuffer: arrayBuffer,
      });

      if (result.importedFiles.length > 0) {
        setWorkspaceFiles(result.importedFiles);
        setActiveFile(result.importedFiles[0]);
        setFileTree(WorkspaceEngine.generateFileTree(result.importedFiles));
        setExplanation(result.summaryText);
        setActiveTab('preview');
      } else {
        alert('Could not extract files from the provided ZIP archive.');
      }
    } catch (err: any) {
      console.error('ZIP import error:', err);
      alert(`ZIP import failed: ${err?.message || 'Read error'}`);
    } finally {
      setIsImportingZip(false);
    }
  };

  const handleExportProject = async () => {
    if (workspaceFiles.length === 0 || isExportingZip) return;
    setIsExportingZip(true);
    try {
      const success = await ProjectExporter.downloadZipBundle({
        projectName: "MAXCES_AI_OS_Project",
        files: workspaceFiles,
      });
      if (success) {
        setExplanation("1-Click Project ZIP downloaded successfully! Includes README.md, package.json, and .gitignore.");
      }
    } catch (err) {
      console.error('Export ZIP error:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  // Option 1, Option 2, & Priority 5 (Localhost Import)
  const handleGenerateCode = async (customPrompt?: string, base64Image?: string) => {
    const finalPrompt = customPrompt || prompt;
    const currentBase64 = base64Image || imagePreview || undefined;

    if (!finalPrompt.trim() && !currentBase64) return;
    setIsGenerating(true);
    setExplanation(null);

    try {
      let visionSummary = "";

      // Priority 5: Real Localhost Website Import Handler
      if (finalPrompt.includes("localhost") || finalPrompt.includes("127.0.0.1")) {
        const urlMatch = finalPrompt.match(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i);
        const targetUrl = urlMatch ? urlMatch[0] : finalPrompt;

        const localhostResult = await BrowserEngine.fetchLocalhostWebsite(targetUrl);
        if (!localhostResult.success) {
          alert(`❌ ${localhostResult.error}`);
          setIsGenerating(false);
          return;
        }

        visionSummary = `[Localhost Page Inspected: "${localhostResult.title}", Headings: ${localhostResult.headingTree?.join(', ')}, Elements: ${localhostResult.interactiveElementCount}]`;
      } else if (currentBase64) {
        const visionResult = await VisionEngine.analyzeScreenshot({
          base64DataUrl: currentBase64,
          referencePrompt: finalPrompt || "Screenshot to Code Generation",
        });
        visionSummary = `[Gemini Vision Design Specs: ${visionResult.layout.layoutPattern}, Colors: ${visionResult.palette.primary}]`;
      } else if (finalPrompt.startsWith("http://") || finalPrompt.startsWith("https://")) {
        const urlResult = await VisionEngine.analyzeWebsite(finalPrompt);
        visionSummary = `[URL Architecture Blueprint: ${urlResult.layout.layoutPattern}]`;
      }

      const combinedPrompt = visionSummary ? `${finalPrompt} ${visionSummary}` : finalPrompt;

      if (user?.id) {
        const result = await AICodeGenerator.generateProjectCode({
          userId: user.id,
          projectId: mockProjectId,
          userPrompt: combinedPrompt,
        });

        if (result.success && result.createdFiles.length > 0) {
          setWorkspaceFiles((prev) => [...prev, ...result.createdFiles]);
          setActiveFile(result.createdFiles[0]);
          setFileTree(WorkspaceEngine.generateFileTree([...workspaceFiles, ...result.createdFiles]));
          setExplanation(result.nonCoderExplanation.whatWeBuilt);
        }
      } else {
        const newFile: WorkspaceFile = {
          id: Math.random().toString(),
          user_id: "guest",
          project_id: mockProjectId,
          file_path: `src/components/LocalhostImportedComponent.tsx`,
          file_content: `// Localhost Inspected React Component: ${finalPrompt}\nimport React from 'react';\nimport { Sparkles, Globe } from 'lucide-react';\n\nexport const LocalhostImportedComponent = () => {\n  return (\n    <div className="p-8 rounded-3xl border border-purple-500/30 bg-black/60 backdrop-blur-2xl text-white shadow-2xl space-y-4">\n      <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">\n        <Globe className="h-4 w-4" />\n        <span>${finalPrompt}</span>\n      </div>\n      <p className="text-slate-300 text-xs leading-relaxed font-sans">Synthesized React 19 + Tailwind CSS component from running localhost application.</p>\n    </div>\n  );\n};`,
          file_type: "code",
          is_directory: false,
          version_number: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const updated = [...workspaceFiles, newFile];
        setWorkspaceFiles(updated);
        setActiveFile(newFile);
        setFileTree(WorkspaceEngine.generateFileTree(updated));
        setExplanation(`Synthesized React component from running localhost app.`);
      }

      const healthReport = ProjectHealthEngine.generateUnifiedHealthReport(workspaceFiles);
      setExplanation(`Synthesized UI (Quality Score: ${healthReport.overallHealthScore}/100 - ${healthReport.summaryStatus})`);

      setPrompt("");
      setImagePreview(null);
      setActiveTab('preview');
    } catch (err) {
      console.error("Code generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const report = await AITestingAssistant.auditWorkspaceFiles(workspaceFiles);
      setAuditReport(report);
    } catch (err) {
      console.error("Audit error:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div>
      <TopBar
        title="AI Code Builder & Luxury Preview Workspace"
        subtitle="God-Level AI Website Builder matching Lovable, Linear & Stripe quality"
        actions={
          <div className="flex items-center gap-2">
            <label className="cursor-pointer hidden sm:flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all">
              {isImportingZip ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderArchive className="h-4 w-4 text-purple-400" />}
              <span>{isImportingZip ? "Extracting ZIP..." : "Import Project ZIP"}</span>
              <input type="file" accept=".zip" onChange={handleZipUpload} className="hidden" />
            </label>
            <button
              onClick={handleExportProject}
              disabled={isExportingZip}
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 sm:flex disabled:opacity-50"
            >
              {isExportingZip ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span>{isExportingZip ? "Bundling ZIP..." : "Export Project (1-Click ZIP)"}</span>
            </button>
          </div>
        }
      />

      {/* Prompt Composer Bar */}
      <GlassCard hover={false} className="mb-4 border border-purple-500/30">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm w-full">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe UI, paste website URL, localhost URL (http://localhost:3000), or upload screenshot..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
            />
            <label className="cursor-pointer p-1.5 rounded-lg hover:bg-white/10 text-purple-300 hover:text-white transition-colors" title="Upload UI Screenshot (PNG/JPG)">
              <UploadCloud className="h-4 w-4" />
              <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              }} className="hidden" />
            </label>
          </div>
          <button
            onClick={() => handleGenerateCode()}
            disabled={isGenerating || (!prompt.trim() && !imagePreview)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 disabled:opacity-50 w-full sm:w-auto justify-center"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>{isGenerating ? "Synthesizing UI..." : "Generate Website"}</span>
          </button>
        </div>

        {explanation && (
          <div className="mt-3 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-xs text-purple-300 leading-relaxed">
            💡 <strong>CTO Brief:</strong> {explanation}
          </div>
        )}
      </GlassCard>

      {/* 1-Click AI Design & Conversion Improver Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs font-medium">
        <span className="text-muted-foreground flex items-center gap-1 shrink-0">
          <Wand2 className="h-3.5 w-3.5 text-purple-400" />
          <span>AI Design Improver:</span>
        </span>
        {[
          { label: "Make it Luxury SaaS", icon: Sparkles, promptText: "Transform into a luxury dark SaaS website matching Linear & Stripe quality" },
          { label: "Add Bento Grid", icon: LayoutGrid, promptText: "Add a 3-column Bento grid feature section with glowing radial highlights" },
          { label: "Add 3D Glass Cards", icon: Layers, promptText: "Apply dark glassmorphism 3D cards with CSS matrix transforms" },
          { label: "Improve Mobile UI", icon: Smartphone, promptText: "Optimize mobile viewport responsiveness and navigation drawer" },
        ].map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.label}
              onClick={() => handleGenerateCode(shortcut.promptText)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-purple-500/10 text-muted-foreground hover:text-purple-300 shrink-0 transition-all"
            >
              <Icon className="h-3.5 w-3.5 text-purple-400" />
              <span>{shortcut.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* Left Rail: Virtual File Tree */}
        <GlassCard className="h-fit">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-2 text-foreground">
              <FileCode className="h-4 w-4 text-cyan-400" />
              <span>Workspace Files</span>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">
              {workspaceFiles.length} files
            </span>
          </div>

          <ul className="space-y-1 text-xs">
            {workspaceFiles.map((f) => {
              const isActive = activeFile?.id === f.id;
              return (
                <li
                  key={f.id}
                  onClick={() => {
                    setActiveFile(f);
                    setActiveTab('editor');
                  }}
                  className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${
                    isActive && activeTab === 'editor'
                      ? "bg-purple-500/20 text-purple-200 border border-purple-500/30 font-medium"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Code2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{f.file_path}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground/60">V{f.version_number}</span>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        {/* Center Pane: Multi-View Workspace (Code Editor | Live Visual Preview | Live Terminal) */}
        <div className="flex flex-col min-h-[550px]">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <Eye className="h-3.5 w-3.5 text-emerald-400" /> Live Visual Preview
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" /> Code Editor
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'terminal'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <TerminalIcon className="h-3.5 w-3.5" /> Live Terminal Console
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="flex-1">
              <LivePreviewPane activeFile={activeFile} files={workspaceFiles} />
            </div>
          ) : activeTab === 'editor' ? (
            <GlassCard hover={false} className="p-0 flex flex-col flex-1">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-mono font-semibold text-foreground">
                    {activeFile?.file_path || "Select a file"}
                  </span>
                  {activeFile && (
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] text-emerald-400">
                      Version {activeFile.version_number} Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    {isAuditing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />}
                    <span>Audit Code</span>
                  </button>
                </div>
              </div>

              <div className="relative flex-1 overflow-auto bg-black/60 p-5 font-mono text-xs leading-6 text-foreground/90 rounded-b-2xl">
                <pre className="whitespace-pre-wrap">
                  {(activeFile?.file_content || "// Select a file from workspace to inspect code").split("\n").map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-6 select-none text-right text-muted-foreground/30">{i + 1}</span>
                      <span>{colorizeLine(line)}</span>
                    </div>
                  ))}
                </pre>
              </div>
            </GlassCard>
          ) : (
            <div className="flex-1">
              <TerminalPanel />
            </div>
          )}
        </div>

        {/* Right Rail: AI Actions & Audit Inspector */}
        <div className="space-y-4">
          <GlassCard className="h-fit">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>AI Design Assistant</span>
            </div>
            <ul className="space-y-2 text-xs">
              {[
                "Refactor component for mobile responsiveness",
                "Add TypeScript interface for data props",
                "Generate Vitest unit test suite",
                "Explain code line-by-line for non-coders",
              ].map((a) => (
                <li
                  key={a}
                  onClick={() => setPrompt(a)}
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-3 text-muted-foreground transition-colors hover:border-purple-500/40 hover:bg-white/[0.05] hover:text-foreground"
                >
                  {a}
                </li>
              ))}
            </ul>
          </GlassCard>

          {auditReport && (
            <GlassCard className="h-fit border border-purple-500/30">
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Audit Health</span>
                </div>
                <span className="text-emerald-400">{auditReport.overallHealthScore} / 100</span>
              </div>
              <div className="space-y-2 mt-3 text-xs">
                {auditReport.issues.map((iss, idx) => (
                  <div key={idx} className="rounded-lg border border-white/5 bg-white/5 p-2.5">
                    <div className="font-semibold text-purple-300">{iss.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{iss.solution}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

function colorizeLine(line: string) {
  return line.split(/(\b(?:import|from|const|export|return|function|interface|type|default|async|await)\b|"[^"]*"|\/\/.*)/).map((seg, i) => {
    if (/^(import|from|const|export|return|function|interface|type|default|async|await)$/.test(seg))
      return <span key={i} className="text-purple-400 font-semibold">{seg}</span>;
    if (/^"/.test(seg)) return <span key={i} className="text-emerald-300">{seg}</span>;
    if (/^\/\//.test(seg)) return <span key={i} className="text-muted-foreground/60 italic">{seg}</span>;
    return <span key={i}>{seg}</span>;
  });
}
