import { createFileRoute } from "@tanstack/react-router";
import {
  Github,
  GitBranch,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  LogOut,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Eye,
  Key,
} from "lucide-react";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { GitHubIntegrationEngine, GitHubRepoInfo, GitHubBranchInfo } from "@/lib/integrations/github";
import { WorkspaceEngine } from "@/lib/ai/workspace";
import { WorkspaceFile } from "@/types/workspace";

export const Route = createFileRoute("/_app/github")({
  head: () => ({ meta: [{ title: "MAXCES · GitHub Integration" }] }),
  component: GitHubPage,
});

// ---------------------------------------------------------------------------
// Step State Machine
// ---------------------------------------------------------------------------
type GitHubStep = 'connect' | 'repos' | 'branch' | 'preview' | 'pushing' | 'done' | 'error';

interface PushState {
  branchName: string;
  commitMessage: string;
  commitUrl: string;
  pushedAt: string;
}

export function GitHubPage() {
  const { user } = useAuth();

  // Connection
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenInput, setAccessTokenInput] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Repos & Branches
  const [repos, setRepos] = useState<GitHubRepoInfo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepoInfo | null>(null);
  const [branches, setBranches] = useState<GitHubBranchInfo[]>([]);
  const [selectedBranchBase, setSelectedBranchBase] = useState<GitHubBranchInfo | null>(null);
  const [newBranchName, setNewBranchName] = useState(`maxces-ai-build-${Date.now().toString(36)}`);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  // Commit
  const [commitMessage, setCommitMessage] = useState("feat: AI-generated luxury website via MAXCES AI OS");
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([]);

  // Push flow
  const [step, setStep] = useState<GitHubStep>('connect');
  const [pushResult, setPushResult] = useState<PushState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPushing, setIsPushing] = useState(false);

  const mockProjectId = "p1-maxces-app";

  // Load workspace files & GitHub status on mount
  useEffect(() => {
    if (!user?.id) return;

    // Load workspace files for push preview
    WorkspaceEngine.getProjectFiles({ userId: user.id, projectId: mockProjectId }).then((files) => {
      if (files.length > 0) setWorkspaceFiles(files);
    });

    // Check existing GitHub connection
    GitHubIntegrationEngine.getGitHubStatus(user.id).then((status) => {
      if (status.isConnected && status.access_token) {
        setAccessToken(status.access_token);
        setGithubUsername(status.github_username || null);
        setStep('repos');
        loadRepos(status.access_token);
      }
    });
  }, [user?.id]);

  const loadRepos = async (token: string) => {
    setIsLoadingRepos(true);
    setErrorMessage(null);
    try {
      const repoList = await GitHubIntegrationEngine.listRepositories(token);
      setRepos(repoList);
      setStep('repos');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to load repositories. Check your access token.');
      setStep('error');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleConnectToken = async () => {
    if (!accessTokenInput.trim()) return;
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      // Verify token by calling GitHub user API
      const res = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessTokenInput.trim()}`,
          Accept: 'application/vnd.github+json',
        },
      });

      if (!res.ok) {
        throw new Error('Invalid GitHub token. Please check your Personal Access Token and try again.');
      }

      const userData = await res.json();
      const verifiedToken = accessTokenInput.trim();
      setAccessToken(verifiedToken);
      setGithubUsername(userData.login);

      // Save to Supabase if authenticated
      if (user?.id) {
        await GitHubIntegrationEngine.connectGitHub({
          userId: user.id,
          githubUsername: userData.login,
          accessToken: verifiedToken,
          avatarUrl: userData.avatar_url,
        });
      }

      setAccessTokenInput("");
      await loadRepos(verifiedToken);
    } catch (err: any) {
      setErrorMessage(err?.message || 'GitHub connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectRepo = async (repo: GitHubRepoInfo) => {
    setSelectedRepo(repo);
    setIsLoadingBranches(true);
    setErrorMessage(null);

    try {
      const branchList = await GitHubIntegrationEngine.listBranches(accessToken, repo.fullName);
      setBranches(branchList);
      const defaultBranch = branchList.find((b) => b.isDefault) || branchList[0];
      setSelectedBranchBase(defaultBranch || null);
      setStep('branch');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to load branches.');
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const handlePreviewCommit = () => {
    if (!selectedRepo || !selectedBranchBase) return;
    setStep('preview');
  };

  const handleConfirmPush = async () => {
    if (!selectedRepo || !selectedBranchBase || !accessToken) return;
    setIsPushing(true);
    setStep('pushing');
    setErrorMessage(null);

    try {
      // Step 1: Create safe feature branch (never push to main/default)
      const branchResult = await GitHubIntegrationEngine.createSafeBranch(
        accessToken,
        selectedRepo.fullName,
        newBranchName,
        selectedBranchBase.commitSha
      );

      if (!branchResult.success) {
        throw new Error(branchResult.error || 'Failed to create branch.');
      }

      // Step 2: Push workspace files to the new branch
      const filesToPush = workspaceFiles.length > 0
        ? workspaceFiles.map((f) => ({ path: f.file_path, content: f.file_content }))
        : [{ path: 'src/App.tsx', content: '// MAXCES AI OS generated project\nexport default function App() { return <div>MAXCES AI OS</div>; }' }];

      const pushResult = await GitHubIntegrationEngine.pushFilesToBranch(
        accessToken,
        selectedRepo.fullName,
        newBranchName,
        filesToPush,
        commitMessage
      );

      if (!pushResult.success) {
        throw new Error(pushResult.error || 'Push failed.');
      }

      setPushResult({
        branchName: newBranchName,
        commitMessage,
        commitUrl: pushResult.commitUrl,
        pushedAt: new Date().toLocaleString(),
      });
      setStep('done');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Push operation failed. Please verify your token has "repo" scope.');
      setStep('error');
    } finally {
      setIsPushing(false);
    }
  };

  const handleDisconnect = async () => {
    if (user?.id) await GitHubIntegrationEngine.disconnectGitHub(user.id);
    setAccessToken("");
    setGithubUsername(null);
    setRepos([]);
    setSelectedRepo(null);
    setBranches([]);
    setPushResult(null);
    setStep('connect');
  };

  const handleReset = () => {
    setSelectedRepo(null);
    setBranches([]);
    setSelectedBranchBase(null);
    setNewBranchName(`maxces-ai-build-${Date.now().toString(36)}`);
    setPushResult(null);
    setErrorMessage(null);
    setStep('repos');
  };

  const isConnected = !!accessToken && !!githubUsername;

  return (
    <div>
      <TopBar
        title="GitHub Integration"
        subtitle="Securely push AI-generated code to GitHub — never directly to main"
        actions={
          isConnected ? (
            <button
              onClick={handleDisconnect}
              className="hidden sm:flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="h-4 w-4" /> Disconnect GitHub
            </button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: Main Workflow Panel */}
        <div className="space-y-4">

          {/* Step 0: Connect GitHub */}
          {step === 'connect' && (
            <GlassCard className="border border-purple-500/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 grid place-items-center">
                  <Github className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-sm">Connect Your GitHub Account</h2>
                  <p className="text-xs text-muted-foreground">Enter a Personal Access Token (PAT) with <code className="text-purple-300">repo</code> scope</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 leading-relaxed">
                  <strong>🔐 Security Notice:</strong> Your token is stored securely in Supabase with Row Level Security. MAXCES AI OS will NEVER push directly to your <code>main</code> branch.
                </div>

                {!showTokenInput ? (
                  <button
                    onClick={() => setShowTokenInput(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
                  >
                    <Key className="h-4 w-4 text-purple-400" />
                    Enter GitHub Personal Access Token
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={accessTokenInput}
                      onChange={(e) => setAccessTokenInput(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-purple-500/60 font-mono"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleConnectToken}
                        disabled={isConnecting || !accessTokenInput.trim()}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        {isConnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Github className="h-3.5 w-3.5" />}
                        {isConnecting ? "Verifying Token..." : "Connect to GitHub"}
                      </button>
                      <button onClick={() => setShowTokenInput(false)} className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-white/10 hover:bg-white/5">
                        Cancel
                      </button>
                    </div>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=MAXCES+AI+OS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" /> Create a new token on GitHub.com
                    </a>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Connected Status Bar */}
          {isConnected && (
            <GlassCard className="border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Connected as <span className="text-emerald-300">@{githubUsername}</span></p>
                    <p className="text-xs text-muted-foreground">Token verified — push access confirmed</p>
                  </div>
                </div>
                <button onClick={() => { setStep('repos'); loadRepos(accessToken); }} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </GlassCard>
          )}

          {/* Step 1: Repository Selector */}
          {(step === 'repos' || step === 'branch' || step === 'preview') && (
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Github className="h-4 w-4 text-purple-400" />
                  <span>Select Repository</span>
                </div>
                {isLoadingRepos && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {repos.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => handleSelectRepo(repo)}
                    className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-3 text-xs text-left transition-all ${
                      selectedRepo?.id === repo.id
                        ? 'border-purple-500/60 bg-purple-500/10 text-purple-200'
                        : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-purple-500/30 hover:bg-white/[0.04] hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Github className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span className="font-medium truncate">{repo.fullName}</span>
                      {repo.isPrivate && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-700/60 text-[10px] text-slate-400 shrink-0">Private</span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0 ml-2">{repo.defaultBranch}</span>
                  </button>
                ))}
                {repos.length === 0 && !isLoadingRepos && (
                  <div className="text-center py-8 text-xs text-muted-foreground">No repositories found.</div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Step 2: Branch Selector */}
          {(step === 'branch' || step === 'preview') && selectedRepo && (
            <GlassCard>
              <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                <GitBranch className="h-4 w-4 text-cyan-400" />
                <span>Configure Branch</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Base branch (reference point)</label>
                  <div className="space-y-1.5">
                    {branches.map((b) => (
                      <button
                        key={b.name}
                        onClick={() => setSelectedBranchBase(b)}
                        className={`w-full flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs text-left transition-all ${
                          selectedBranchBase?.name === b.name
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                            : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-cyan-500/30 hover:text-foreground'
                        }`}
                      >
                        <GitBranch className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span className="font-medium">{b.name}</span>
                        {b.isDefault && <span className="px-1.5 py-0.5 rounded-md bg-cyan-900/40 text-[10px] text-cyan-300">default</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">
                    New feature branch name <span className="text-red-400">(code will be pushed here, NOT to main)</span>
                  </label>
                  <input
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-foreground outline-none focus:border-purple-500/60 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Commit message</label>
                  <input
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-foreground outline-none focus:border-purple-500/60"
                  />
                </div>

                <button
                  onClick={handlePreviewCommit}
                  disabled={!selectedBranchBase || !newBranchName.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-transform"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview Commit
                </button>
              </div>
            </GlassCard>
          )}

          {/* Step 3: Commit Preview & Confirm */}
          {step === 'preview' && selectedRepo && selectedBranchBase && (
            <GlassCard className="border border-amber-500/30">
              <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                <GitCommit className="h-4 w-4 text-amber-400" />
                <span>Commit Preview — Review Before Pushing</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-muted-foreground">Repository</span>
                  <span className="font-semibold text-foreground">{selectedRepo.fullName}</span>
                </div>
                <div className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-muted-foreground">New Branch</span>
                  <span className="font-mono text-cyan-300">{newBranchName}</span>
                </div>
                <div className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-muted-foreground">Base Branch</span>
                  <span className="font-mono text-foreground">{selectedBranchBase.name}</span>
                </div>
                <div className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-muted-foreground">Files to Push</span>
                  <span className="font-semibold text-foreground">{workspaceFiles.length} files</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-muted-foreground">Commit Message</span>
                  <p className="font-medium text-foreground mt-1">{commitMessage}</p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-amber-300">
                  <ShieldCheck className="h-3.5 w-3.5 inline mr-1" />
                  <strong>Safe Push Guarantee:</strong> Code will be pushed ONLY to <code>{newBranchName}</code> — never to <code>{selectedBranchBase.name}</code>.
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleConfirmPush}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:scale-[1.01] transition-transform"
                >
                  <UploadCloud className="h-3.5 w-3.5" /> Confirm & Push to GitHub
                </button>
                <button
                  onClick={() => setStep('branch')}
                  className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </GlassCard>
          )}

          {/* Step 4: Pushing in Progress */}
          {step === 'pushing' && (
            <GlassCard className="border border-purple-500/30">
              <div className="py-10 flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                <div>
                  <p className="font-semibold text-foreground">Pushing to GitHub...</p>
                  <p className="text-xs text-muted-foreground mt-1">Creating branch <code className="text-purple-300">{newBranchName}</code> and pushing {workspaceFiles.length} files</p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Step 5: Success */}
          {step === 'done' && pushResult && (
            <GlassCard className="border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-bold text-foreground text-sm">Push Successful! 🎉</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{pushResult.pushedAt}</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                      <span className="text-muted-foreground">Branch Created</span>
                      <code className="text-cyan-300">{pushResult.branchName}</code>
                    </div>
                    <div className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                      <span className="text-muted-foreground">Commit Message</span>
                      <span className="text-foreground text-right max-w-[60%] truncate">{pushResult.commitMessage}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={pushResult.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-purple-400" /> View on GitHub
                    </a>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Push Another Branch
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Error State */}
          {(step === 'error' || errorMessage) && (
            <GlassCard className="border border-red-500/30 bg-red-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-red-300 text-sm">Operation Failed</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{errorMessage}</p>
                  <button
                    onClick={() => { setErrorMessage(null); setStep(isConnected ? 'repos' : 'connect'); }}
                    className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
                  >
                    <RefreshCw className="h-3 w-3" /> Try Again
                  </button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right: Workspace Files Preview */}
        <div className="space-y-4">
          <GlassCard>
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-purple-400" />
                <span>Files Queued for Push</span>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">
                {workspaceFiles.length} files
              </span>
            </div>

            <ul className="space-y-1 max-h-96 overflow-y-auto text-xs">
              {workspaceFiles.length > 0 ? (
                workspaceFiles.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-white/5 transition-colors">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-mono truncate">{f.file_path}</span>
                    <span className="ml-auto text-[9px] text-muted-foreground/50 shrink-0">V{f.version_number}</span>
                  </li>
                ))
              ) : (
                <li className="py-6 text-center text-muted-foreground">
                  <p className="text-xs">No workspace files loaded.</p>
                  <p className="text-[11px] mt-1 text-muted-foreground/60">Generate a project in the Code Builder first.</p>
                </li>
              )}
            </ul>
          </GlassCard>

          {/* Push Safety Info Card */}
          <GlassCard className="border border-emerald-500/20">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1.5">
                <p className="font-semibold text-foreground">Safe Push Guarantees</p>
                <ul className="space-y-1 text-muted-foreground leading-relaxed">
                  <li>✅ Never pushes directly to <code>main</code></li>
                  <li>✅ Always creates a new feature branch</li>
                  <li>✅ Shows commit preview before push</li>
                  <li>✅ Token stored securely with RLS</li>
                  <li>✅ Max 30 files per push for rate safety</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
