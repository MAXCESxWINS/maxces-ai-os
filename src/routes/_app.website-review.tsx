import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Globe, Zap, Loader2, Sparkles, Image as ImageIcon, UploadCloud } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { WebsiteAnalyzer, WebsiteAuditReport } from "@/lib/ai/website-analyzer";
import { VisionEngine } from "@/lib/vision/vision-engine";
import { VisionAnalysisResult } from "@/types/vision";
import { EmptyState, PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/website-review")({
  head: () => ({ meta: [{ title: "MAXCES · Vision & Website Review Agent" }] }),
  component: WebsiteReviewPage,
});

export function WebsiteReviewPage() {
  const [url, setUrl] = useState("https://maxces-ai-os.com");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<WebsiteAuditReport | null>(null);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleRunAudit = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    try {
      const result = await WebsiteAnalyzer.analyzeWebsite({ url });
      setReport(result);
    } catch (err) {
      console.error("Audit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setIsLoading(true);
      try {
        const vResult = await VisionEngine.analyzeScreenshot({
          base64DataUrl: base64,
          mimeType: file.type,
          referencePrompt: `Uploaded UI Screenshot (${file.name})`,
        });
        setVisionResult(vResult);
      } catch (err) {
        console.error("Vision Analysis Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const currentScores = report
    ? [
        { label: "UI / UX Design", value: report.scores.uiUxScore * 10, tone: "from-purple-500 to-indigo-500" },
        { label: "Performance", value: report.scores.performanceScore * 10, tone: "from-cyan-400 to-blue-500" },
        { label: "SEO Visibility", value: report.scores.seoScore * 10, tone: "from-emerald-400 to-teal-500" },
        { label: "Security & Privacy", value: report.scores.securityScore * 10, tone: "from-pink-500 to-purple-500" },
      ]
    : null;

  return (
    <PageContainer>
      <TopBar title="Vision & Website Review Agent" subtitle="Live Gemini 2.5 Flash Vision & UX Inspector" />

      {/* URL Input & Image Upload Card */}
      <GlassCard hover={false} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Website URL Audit */}
          <div className="flex items-center gap-2 flex-1 w-full">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 ring-1 ring-white/10">
              <Globe className="h-4 w-4 text-cyan-400" aria-hidden />
            </div>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g. https://your-site.com)"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-purple-500/50 text-foreground"
            />
            <button
              onClick={handleRunAudit}
              disabled={isLoading || !url}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] disabled:opacity-50 transition-transform"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              <span>Audit Site</span>
            </button>
          </div>

          <div className="hidden md:block h-8 w-px bg-white/10" />

          {/* Real Gemini Vision Screenshot Upload */}
          <div className="w-full md:w-auto">
            <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-purple-500/40 bg-purple-500/10 px-5 py-2.5 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 transition-all">
              <UploadCloud className="h-4 w-4 text-purple-400" />
              <span>Upload UI Screenshot (PNG/JPG)</span>
              <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {imagePreview && (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-3 animate-fade-in">
            <img src={imagePreview} alt="Screenshot Preview" className="h-16 w-28 object-cover rounded-lg border border-white/10" />
            <div>
              <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-purple-400" />
                <span>Screenshot Base64 Payload Ready</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {visionResult ? `Status: ${visionResult.status}` : "Analyzing screenshot via Gemini 2.5 Flash Vision..."}
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {!report && !visionResult && !isLoading && (
        <EmptyState
          icon={<Globe className="h-6 w-6 text-purple-400" />}
          title="No website analysis loaded"
          description="Enter a website URL above to inspect performance, SEO, and structure, or upload a UI screenshot for automated Gemini Vision design analysis."
        />
      )}

      {isLoading && !imagePreview && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <p className="text-xs text-muted-foreground shimmer-text">Running automated website design audit...</p>
        </div>
      )}

      {/* Scores Grid */}
      {currentScores && !isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
          {currentScores.map((s) => (
            <GlassCard key={s.label} hover={false}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-5xl font-semibold tracking-tight">{s.value}</div>
                <div className="text-xs text-emerald-400">/ 100</div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <div className={`h-full rounded-full bg-gradient-to-r ${s.tone}`} style={{ width: `${s.value}%` }} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Live Gemini Vision Result */}
      {visionResult && !isLoading && (
        <GlassCard glow className="mt-6 border border-purple-500/30 p-5 animate-fade-in-up" hover={false}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>Gemini 2.5 Flash Vision Analysis Output</span>
            </div>
            <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-3 py-1 text-xs text-purple-300 font-semibold">
              {visionResult.status}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{visionResult.transparencyNote}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="font-semibold text-purple-300">Extracted Layout</div>
              <div className="text-foreground mt-1">{visionResult.layout.layoutPattern}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="font-semibold text-cyan-300">Typography Specs</div>
              <div className="text-foreground mt-1">{visionResult.typography.headingFont}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="font-semibold text-emerald-300">Extracted Colors</div>
              <div className="flex gap-1 mt-1">
                {visionResult.palette.extractedColors.map((c, i) => (
                  <span key={i} className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Audit Report Results */}
      {report && !isLoading && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] animate-fade-in-up">
          <GlassCard hover={false}>
            <div className="mb-4 text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>AI Audit Findings & Issues</span>
            </div>

            <div className="space-y-3">
              {report.majorProblems.map((prob, idx) => (
                <div key={idx} className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Critical Item {idx + 1}</div>
                    <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{prob}</div>
                  </div>
                </div>
              ))}
            </div>

            {report.rawAiText && (
              <div className="mt-6 border-t border-white/10 pt-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {report.rawAiText}
              </div>
            )}
          </GlassCard>

          <GlassCard hover={false}>
            <div className="mb-3 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Recommended Fixes</span>
            </div>
            <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              {report.recommendedImprovements.map((rec, idx) => (
                <li key={idx} className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-foreground/90">
                  • {rec}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      )}
    </PageContainer>
  );
}
