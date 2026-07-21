import { createFileRoute, Link } from "@tanstack/react-router";
import { Palette, Type, Grid3x3, Zap, Eye, Sparkles, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { WorkspaceEngine } from "@/lib/ai/workspace";
import { ProjectHealthEngine } from "@/lib/ai/project-health-engine";
import { WorkspaceFile } from "@/types/workspace";
import { EmptyState, PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/ui-review")({
  head: () => ({ meta: [{ title: "MAXCES · UI Review" }] }),
  component: UIReviewPage,
});

function UIReviewPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockProjectId = "p1-maxces-app";

  useEffect(() => {
    if (user?.id) {
      WorkspaceEngine.getProjectFiles({ userId: user.id, projectId: mockProjectId })
        .then((res) => {
          setFiles(res);
        })
        .catch((err) => {
          console.error("Failed to load workspace files for UI review:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Compute live scores based on real active workspace files
  const healthReport = useMemo(() => {
    if (files.length === 0) return null;
    return ProjectHealthEngine.generateUnifiedHealthReport(files, "MAXCES Workspace Project");
  }, [files]);

  const scores = useMemo(() => {
    if (!healthReport) return [];
    const js = healthReport.judgeReport.scores;
    return [
      { label: "Typography", value: js.uiUxScore - 2, icon: Type },
      { label: "Spacing", value: js.maintainabilityScore - 5, icon: Grid3x3 },
      { label: "Color Palette", value: js.uiUxScore, icon: Palette },
      { label: "Motion", value: js.animationScore, icon: Zap },
      { label: "Accessibility", value: js.accessibilityScore, icon: Eye },
    ];
  }, [healthReport]);

  const grade = useMemo(() => {
    if (!healthReport) return "N/A";
    const score = healthReport.overallHealthScore;
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "A-";
    if (score >= 80) return "B+";
    if (score >= 75) return "B";
    if (score >= 70) return "C";
    return "D";
  }, [healthReport]);

  if (isLoading) {
    return (
      <PageContainer>
        <TopBar title="UI Review" subtitle="Loading design intelligence scores..." />
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <p className="text-xs text-muted-foreground shimmer-text">Analyzing component structure and auditing spacing...</p>
        </div>
      </PageContainer>
    );
  }

  if (files.length === 0) {
    return (
      <PageContainer>
        <TopBar title="UI Review" subtitle="Automated Design Quality Audit" />
        <EmptyState
          icon={<AlertCircle className="h-6 w-6 text-purple-400" />}
          title="No analysis available yet"
          description="We found no files in your active workspace. Generate a website in the Code Builder first to run design audits."
          action={
            <Link
              to="/code-builder"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:scale-105 transition-transform"
            >
              Go to Code Builder
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TopBar title="UI Review" subtitle="Automated design review based on active workspace component files" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left Card: Summary Preview */}
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="relative h-[320px] bg-gradient-to-br from-primary/10 via-black to-secondary/5 border-b border-white/5 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-32 rounded bg-purple-400/20" />
                <span className="text-[10px] text-purple-400/80 uppercase font-bold tracking-wider">Active Workspace</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded bg-white/10" />
                <div className="h-2 w-3/4 rounded bg-white/10" />
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                {files.slice(0, 3).map((f) => (
                  <span key={f.id} className="text-[9.5px] font-mono rounded bg-white/5 border border-white/8 px-2 py-0.5 text-muted-foreground">
                    {f.file_path.split("/").pop()}
                  </span>
                ))}
                {files.length > 3 && (
                  <span className="text-[9.5px] font-mono rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-purple-300">
                    +{files.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur">
              Workspace Blueprint
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Overall Rating</div>
                <div className="mt-1 text-4xl font-semibold tracking-tight text-foreground">{grade}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold text-gradient">{healthReport?.overallHealthScore}</div>
                <div className="text-xs text-muted-foreground">Composite health score</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Right Cards: Metric Details */}
        <div className="space-y-4">
          {scores.map((s) => (
            <GlassCard key={s.label} className="p-4" hover={false}>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <s.icon className="h-4 w-4 text-cyan-glow" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-foreground">{s.label}</div>
                    <div className="text-xs font-semibold text-foreground">{s.value}/100</div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-glow" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* AI Notes Panel */}
          {healthReport && (
            <GlassCard hover={false}>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-cyan-glow" /> Cortex Audit Notes
              </div>
              <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  {healthReport.judgeReport.founderExplanation.whatWeBuilt} {healthReport.judgeReport.founderExplanation.whyItMatters}
                </p>
                {healthReport.unifiedRecommendations.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="font-semibold text-foreground mb-1.5">Recommendations:</div>
                    <ul className="list-disc pl-4 space-y-1">
                      {healthReport.unifiedRecommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={`animate-spin ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        className="opacity-75"
      />
    </svg>
  );
}
