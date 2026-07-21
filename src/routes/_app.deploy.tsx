import { createFileRoute } from "@tanstack/react-router";
import {
  Rocket,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Globe,
  Terminal,
  Key,
  ChevronDown,
  ChevronRight,
  Zap,
  Cloud,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { useAuth } from "@/hooks/useAuth";
import {
  CloudDeploymentEngine,
  DeploymentConfig,
  DeploymentLogLine,
  DeploymentProvider,
  DeploymentResult,
} from "@/lib/integrations/deployment";
import { WorkspaceEngine } from "@/lib/ai/workspace";
import { WorkspaceFile } from "@/types/workspace";

export const Route = createFileRoute("/_app/deploy")({
  head: () => ({ meta: [{ title: "MAXCES · Deploy" }] }),
  component: DeployPage,
});

// ---------------------------------------------------------------------------
// Small helper components
// ---------------------------------------------------------------------------
function ProviderBadge({ provider, selected, onClick }: { provider: DeploymentProvider; selected: boolean; onClick: () => void }) {
  const isVercel = provider === "vercel";
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2.5 rounded-2xl border p-5 transition-all hover:scale-[1.02] ${
        selected
          ? isVercel
            ? "border-white/40 bg-white/10 shadow-lg shadow-white/5"
            : "border-teal-500/60 bg-teal-500/10 shadow-lg shadow-teal-500/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      {isVercel ? (
        <svg viewBox="0 0 76 65" className="h-7 w-7 fill-white" aria-hidden>
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
          <path d="M16 0L0 8v24l16 8 16-8V8L16 0z" fill="#00AD9F" />
          <path d="M8 16l8 4 8-4" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )}
      <div className="text-center">
        <p className="text-sm font-bold text-foreground">{isVercel ? "Vercel" : "Netlify"}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{isVercel ? "Zero-config deploys" : "Free static hosting"}</p>
      </div>
      {selected && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">Selected</span>
      )}
    </button>
  );
}

function LogLine({ line }: { line: DeploymentLogLine }) {
  const colors: Record<string, string> = {
    info: "text-slate-300",
    error: "text-red-400",
    warn: "text-amber-400",
    system: "text-cyan-400 font-semibold",
  };
  return (
    <div className={`flex gap-2 text-[11px] font-mono leading-5 ${colors[line.type] || "text-slate-300"}`}>
      <span className="text-muted-foreground/50 shrink-0">[{line.timestamp}]</span>
      <span>{line.text}</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
type DeployStep = "provider" | "token" | "config" | "deploying" | "done" | "failed";

export function DeployPage() {
  const { user } = useAuth();

  // Provider selection
  const [provider, setProvider] = useState<DeploymentProvider>("vercel");

  // Token
  const [tokenInput, setTokenInput] = useState("");
  const [tokenVisible, setTokenVisible] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [tokenOwner, setTokenOwner] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Config
  const [projectName, setProjectName] = useState("my-maxces-app");
  const [buildCommand, setBuildCommand] = useState("vite build");
  const [outputDir, setOutputDir] = useState("dist");
  const [envVars, setEnvVars] = useState<{ key: string; value: string; id: number }[]>([
    { key: "", value: "", id: Date.now() },
  ]);

  // Deployment state
  const [step, setStep] = useState<DeployStep>("provider");
  const [deployLogs, setDeployLogs] = useState<DeploymentLogLine[]>([]);
  const [deployResult, setDeployResult] = useState<DeploymentResult | null>(null);
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const mockProjectId = "p1-maxces-app";

  useEffect(() => {
    if (!user?.id) return;
    WorkspaceEngine.getProjectFiles({ userId: user.id, projectId: mockProjectId }).then((files) => {
      if (files.length > 0) setWorkspaceFiles(files);
    });
  }, [user?.id]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [deployLogs]);

  // ---------------------------------------------------------------------------
  // Token verification
  // ---------------------------------------------------------------------------
  const verifyToken = async () => {
    if (!tokenInput.trim()) return;
    setIsVerifyingToken(true);
    setTokenError(null);

    try {
      if (provider === "vercel") {
        const res = await fetch("https://api.vercel.com/v2/user", {
          headers: { Authorization: `Bearer ${tokenInput.trim()}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message || "Invalid Vercel token.");
        setVerifiedToken(tokenInput.trim());
        setTokenOwner(data.user?.username || data.user?.email || "Vercel User");
        setStep("config");
      } else {
        const res = await fetch("https://api.netlify.com/api/v1/user", {
          headers: { Authorization: `Bearer ${tokenInput.trim()}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Invalid Netlify token.");
        setVerifiedToken(tokenInput.trim());
        setTokenOwner(data.email || data.full_name || "Netlify User");
        setStep("config");
      }
    } catch (err: unknown) {
      setTokenError(err instanceof Error ? err.message : "Token verification failed.");
    } finally {
      setIsVerifyingToken(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Deployment
  // ---------------------------------------------------------------------------
  const handleDeploy = async () => {
    if (!verifiedToken) return;
    setDeployLogs([]);
    setDeployResult(null);
    setStep("deploying");

    const config: DeploymentConfig = {
      provider,
      projectName: projectName.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "maxces-app",
      buildCommand: buildCommand || "vite build",
      outputDirectory: outputDir || "dist",
      environmentVariables: envVars.filter((e) => e.key.trim() && e.value.trim()).map((e) => ({ key: e.key, value: e.value })),
    };

    const result = await CloudDeploymentEngine.triggerDeployment({
      accessToken: verifiedToken,
      config,
      files: workspaceFiles,
      onLog: (line) => setDeployLogs((prev) => [...prev, line]),
    });

    setDeployResult(result);
    setStep(result.success ? "done" : "failed");
  };

  // ---------------------------------------------------------------------------
  // Env var helpers
  // ---------------------------------------------------------------------------
  const addEnvVar = () => setEnvVars((prev) => [...prev, { key: "", value: "", id: Date.now() }]);
  const removeEnvVar = (id: number) => setEnvVars((prev) => prev.filter((e) => e.id !== id));
  const updateEnvVar = (id: number, field: "key" | "value", val: string) =>
    setEnvVars((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const resetFlow = () => {
    setStep("provider");
    setVerifiedToken(null);
    setTokenOwner(null);
    setTokenInput("");
    setTokenError(null);
    setDeployLogs([]);
    setDeployResult(null);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const isDeploying = step === "deploying";
  const isDone = step === "done" || step === "failed";

  return (
    <div>
      <TopBar
        title="Deploy"
        subtitle="Push your AI-generated project live — Vercel & Netlify supported"
        actions={
          isDone ? (
            <button
              onClick={resetFlow}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground hover:bg-white/10 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> New Deployment
            </button>
          ) : undefined
        }
      />

      {/* Progress Indicator */}
      <div className="mb-6 flex items-center gap-0">
        {(["provider", "token", "config", "deploying", "done"] as DeployStep[]).map((s, i, arr) => {
          const labels: Record<string, string> = { provider: "Provider", token: "Token", config: "Configure", deploying: "Deploy", done: "Live" };
          const stepOrder: Record<string, number> = { provider: 0, token: 1, config: 2, deploying: 3, done: 4, failed: 4 };
          const currentOrder = stepOrder[step];
          const thisOrder = stepOrder[s];
          const isActive = s === step || (step === "failed" && s === "done");
          const isPast = currentOrder > thisOrder;

          return (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex flex-col items-center gap-1 flex-1 ${i === 0 ? "items-start" : i === arr.length - 1 ? "items-end" : "items-center"}`}>
                <div className={`h-2 w-2 rounded-full transition-all ${
                  isPast ? "bg-emerald-400" :
                  isActive ? (step === "failed" && s === "done" ? "bg-red-400" : "bg-purple-400 shadow-md shadow-purple-500/50") :
                  "bg-white/10"
                }`} />
                <span className={`text-[9px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}>{labels[s]}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-px flex-1 mb-3 transition-all ${isPast || isActive ? "bg-gradient-to-r from-emerald-500/40 to-purple-500/20" : "bg-white/5"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* LEFT: Main workflow */}
        <div className="space-y-4">

          {/* STEP 1: Provider Selection */}
          {(step === "provider") && (
            <GlassCard>
              <h2 className="text-sm font-bold text-foreground mb-1">Choose Deployment Platform</h2>
              <p className="text-xs text-muted-foreground mb-5">Where should your project go live?</p>
              <div className="grid grid-cols-2 gap-3">
                <ProviderBadge provider="vercel" selected={provider === "vercel"} onClick={() => setProvider("vercel")} />
                <ProviderBadge provider="netlify" selected={provider === "netlify"} onClick={() => setProvider("netlify")} />
              </div>
              <button
                onClick={() => setStep("token")}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:scale-[1.01] transition-transform"
              >
                Continue with {provider === "vercel" ? "Vercel" : "Netlify"}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </GlassCard>
          )}

          {/* STEP 2: Token Input */}
          {step === "token" && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-1">
                <Key className="h-4 w-4 text-purple-400" />
                <h2 className="text-sm font-bold text-foreground">
                  {provider === "vercel" ? "Vercel" : "Netlify"} Access Token
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                Your token is verified against the real API and never stored server-side.
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={tokenVisible ? "text" : "password"}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyToken()}
                    placeholder={provider === "vercel" ? "vercel_token_..." : "netlify_access_token_..."}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-purple-500/60 font-mono"
                  />
                  <button
                    onClick={() => setTokenVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tokenVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {tokenError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-400 flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    {tokenError}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={verifyToken}
                    disabled={isVerifyingToken || !tokenInput.trim()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50 hover:scale-[1.01] transition-transform"
                  >
                    {isVerifyingToken ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Key className="h-3.5 w-3.5" />}
                    {isVerifyingToken ? "Verifying…" : "Verify Token"}
                  </button>
                  <button onClick={() => setStep("provider")} className="px-4 py-2 rounded-xl text-xs text-muted-foreground border border-white/10 hover:bg-white/5">
                    Back
                  </button>
                </div>

                <a
                  href={provider === "vercel"
                    ? "https://vercel.com/account/settings/tokens"
                    : "https://app.netlify.com/user/applications/personal-access-tokens"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Get a token from {provider === "vercel" ? "Vercel Dashboard" : "Netlify User Settings"}
                </a>
              </div>
            </GlassCard>
          )}

          {/* Token verified banner */}
          {verifiedToken && step !== "token" && (
            <GlassCard className="border border-emerald-500/30 bg-emerald-500/5 py-3">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-semibold">Token verified</span>
                <span className="text-muted-foreground">— authenticated as <span className="text-foreground">{tokenOwner}</span></span>
              </div>
            </GlassCard>
          )}

          {/* STEP 3: Project Configuration */}
          {step === "config" && (
            <GlassCard>
              <h2 className="text-sm font-bold text-foreground mb-5">Configure Deployment</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Project Name</label>
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-purple-500/60"
                    placeholder="my-maxces-app"
                  />
                </div>

                {/* Advanced settings toggle */}
                <button
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAdvanced ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  Advanced build settings
                </button>

                {showAdvanced && (
                  <div className="space-y-3 pl-4 border-l border-white/10">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Build Command</label>
                      <input
                        value={buildCommand}
                        onChange={(e) => setBuildCommand(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-foreground font-mono outline-none focus:border-purple-500/60"
                        placeholder="vite build"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Output Directory</label>
                      <input
                        value={outputDir}
                        onChange={(e) => setOutputDir(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-foreground font-mono outline-none focus:border-purple-500/60"
                        placeholder="dist"
                      />
                    </div>
                  </div>
                )}

                {/* Environment Variables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-muted-foreground font-medium">Environment Variables</label>
                    <button
                      onClick={addEnvVar}
                      className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Plus className="h-3 w-3" /> Add Variable
                    </button>
                  </div>

                  <div className="space-y-2">
                    {envVars.map((e) => (
                      <div key={e.id} className="flex gap-2">
                        <input
                          value={e.key}
                          onChange={(ev) => updateEnvVar(e.id, "key", ev.target.value)}
                          placeholder="VITE_API_KEY"
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground font-mono outline-none focus:border-purple-500/50"
                        />
                        <input
                          type="password"
                          value={e.value}
                          onChange={(ev) => updateEnvVar(e.id, "value", ev.target.value)}
                          placeholder="Value"
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground font-mono outline-none focus:border-purple-500/50"
                        />
                        <button
                          onClick={() => removeEnvVar(e.id)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDeploy}
                  disabled={!projectName.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 hover:scale-[1.01] transition-transform"
                >
                  <Rocket className="h-4 w-4" />
                  Deploy to {provider === "vercel" ? "Vercel" : "Netlify"}
                </button>
              </div>
            </GlassCard>
          )}

          {/* STEP 4: Deploying — Live Log Stream */}
          {(step === "deploying" || isDone) && (
            <GlassCard className="border border-purple-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-bold text-foreground">Deployment Logs</span>
                {isDeploying && (
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] text-purple-300">
                    <Loader2 className="h-3 w-3 animate-spin" /> Live
                  </span>
                )}
                {step === "done" && (
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Complete
                  </span>
                )}
                {step === "failed" && (
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] text-red-400 font-semibold">
                    <AlertCircle className="h-3 w-3" /> Failed
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-4 h-72 overflow-y-auto font-mono text-xs space-y-0.5">
                {deployLogs.length === 0 ? (
                  <p className="text-muted-foreground/40">Connecting to deployment servers…</p>
                ) : (
                  deployLogs.map((line, i) => <LogLine key={i} line={line} />)
                )}
                <div ref={logsEndRef} />
              </div>
            </GlassCard>
          )}

          {/* STEP 5: Success */}
          {step === "done" && deployResult?.success && (
            <GlassCard className="border border-emerald-500/40 bg-emerald-500/5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 grid place-items-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-bold text-foreground">Deployment Successful 🚀</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Your site is live and accessible worldwide</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Live URL</p>
                      <p className="text-xs font-mono text-emerald-300 truncate">{deployResult.deploymentUrl}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <CopyButton text={deployResult.deploymentUrl} />
                      <a
                        href={deployResult.deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  {deployResult.deploymentId && (
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {deployResult.deploymentId}</p>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 5: Failure */}
          {step === "failed" && deployResult && !deployResult.success && (
            <GlassCard className="border border-red-500/30 bg-red-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold text-red-300 text-sm">Deployment Failed</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{deployResult.error}</p>
                  <button
                    onClick={() => setStep("config")}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
                  >
                    <RefreshCw className="h-3 w-3" /> Retry Deployment
                  </button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* RIGHT: Info Panel */}
        <div className="space-y-4">
          {/* Workspace Files */}
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Cloud className="h-4 w-4 text-cyan-400" />
                <span>Files to Deploy</span>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">
                {workspaceFiles.length}
              </span>
            </div>
            <ul className="space-y-1 max-h-56 overflow-y-auto text-[11px]">
              {workspaceFiles.length > 0 ? (
                workspaceFiles.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-white/5">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span className="font-mono truncate">{f.file_path}</span>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-muted-foreground text-xs">
                  <p>No workspace files found.</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60">Build a project in Code Builder first.</p>
                </li>
              )}
            </ul>
          </GlassCard>

          {/* Platform comparison */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold text-foreground">Platform Guide</span>
            </div>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground text-[11px] mb-1">Vercel — Best for React/Next.js</p>
                <ul className="space-y-0.5 text-[10px] leading-relaxed">
                  <li>✅ Automatic HTTPS & CDN</li>
                  <li>✅ Zero-config deployments</li>
                  <li>✅ Preview URLs per deployment</li>
                  <li>⚠️ Requires token from Vercel Dashboard</li>
                </ul>
              </div>
              <div className="border-t border-white/5 pt-2.5">
                <p className="font-semibold text-foreground text-[11px] mb-1">Netlify — Best for Static Sites</p>
                <ul className="space-y-0.5 text-[10px] leading-relaxed">
                  <li>✅ Drag-and-drop ZIP deploy</li>
                  <li>✅ Free tier is generous</li>
                  <li>✅ Built-in form handling</li>
                  <li>⚠️ Requires Personal Access Token</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Live URL card (shows when done) */}
          {step === "done" && deployResult?.success && (
            <GlassCard className="border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-foreground">Your Live Site</span>
              </div>
              <a
                href={deployResult.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-mono text-emerald-300 hover:bg-emerald-500/15 transition-colors"
              >
                <span className="truncate">{deployResult.deploymentUrl}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-2" />
              </a>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
