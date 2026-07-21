import { createFileRoute } from "@tanstack/react-router";
import { useState, useId, useEffect } from "react";
import { Search, ExternalLink, Loader2, Sparkles, Globe } from "lucide-react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { EmptyState, ErrorBanner, PageContainer } from "@/components/maxces/Primitives";
import { GeminiAIEngine } from "@/lib/ai/gemini";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "MAXCES · Research" }] }),
  component: ResearchPage,
});

interface Source {
  id: string;
  title: string;
  site: string;
  url: string;
  snippet: string;
}

interface ResearchResult {
  query: string;
  sources: Source[];
  synthesis: string;
  followUps: string[];
}

export function ResearchPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  // If a followUp changes query, we want to auto-run research
  const handleFollowUp = (q: string) => {
    setQuery(q);
  };

  // Auto-run research when query is set via followUp click
  useEffect(() => {
    if (query && result && query !== result.query) {
      handleResearch();
    }
  }, [query]);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    const prompt = `You are an elite research analyst. Research the following topic: "${query.trim()}".
Provide a synthesized answer along with relevant sources.
You MUST respond with a JSON object containing the following keys:
1. "synthesis": A string containing a detailed Markdown-formatted analysis/synthesis of the answer.
2. "sources": An array of 3-4 objects, each having keys: "id" (unique string), "title" (name of page), "site" (domain), "url" (complete url), and "snippet" (brief quote/summary).
3. "followUps": An array of 3 follow-up question strings.

Do not wrap the JSON output in markdown formatting like \`\`\`json. Return the raw JSON object string only.`;

    try {
      const res = await GeminiAIEngine.generateContent({
        prompt,
        systemInstruction: "You are an expert AI research assistant that outputs strictly structured, valid JSON matching the requested schema. No conversational preamble before or after the JSON."
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to fetch response from Gemini");
      }

      // Resilient parsing of JSON from response
      const rawText = res.text.trim();
      const startIdx = rawText.indexOf('{');
      const endIdx = rawText.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1) {
        throw new Error("Gemini did not return a valid JSON object structure.");
      }
      const jsonStr = rawText.substring(startIdx, endIdx + 1);
      const parsed = JSON.parse(jsonStr) as Partial<ResearchResult>;

      if (!parsed.synthesis || !Array.isArray(parsed.sources) || !Array.isArray(parsed.followUps)) {
        throw new Error("Parsed JSON is missing required fields (synthesis, sources, or followUps).");
      }

      setResult({
        query: query.trim(),
        sources: parsed.sources.map((s: any, idx: number) => ({
          id: s.id || `s-${idx}`,
          title: s.title || "Reference Source",
          site: s.site || "external-resource.com",
          url: s.url || "#",
          snippet: s.snippet || "No detailed snippet available.",
        })),
        synthesis: parsed.synthesis,
        followUps: parsed.followUps,
      });
    } catch (err: any) {
      console.error("[Research Page Error]:", err);
      setError(err?.message || "Failed to generate research report. Please verify your API Key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <TopBar title="Research" subtitle="Deep AI synthesis from live Google Gemini models" />

      <div className="space-y-5">
        {/* Search Input */}
        <GlassCard hover={false}>
          <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground mb-2 block">
            Research question
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
              <input
                id={inputId}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleResearch()}
                placeholder="Ask anything — MAXCES AI will synthesize multiple sources…"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-purple-500/60"
                aria-label="Research query"
              />
            </div>
            <button
              type="button"
              onClick={handleResearch}
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50 hover:scale-105 transition-transform"
              aria-label="Start research"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Sparkles className="h-3.5 w-3.5" aria-hidden />}
              {isLoading ? "Researching…" : "Research"}
            </button>
          </div>
        </GlassCard>

        {error && <ErrorBanner message={error} onRetry={handleResearch} />}

        {/* Empty / Idle State */}
        {!isLoading && !result && !error && (
          <EmptyState
            icon={<Globe className="h-6 w-6" />}
            title="Ask MAXCES to research anything"
            description="MAXCES AI will synthesize multiple trusted sources and give you a deep, structured answer with follow-up questions."
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <GlassCard hover={false} className="py-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm shimmer-text">Synthesizing sources…</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing top results from multiple trusted sources using Gemini AI Core</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Results */}
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Sources */}
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">Sources</h2>
                <span className="text-xs text-muted-foreground">{result.sources.length} sources synthesized</span>
              </div>
              <ul className="space-y-2.5" role="list">
                {result.sources.map((src) => (
                  <li key={src.id} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
                    <div className="h-6 w-6 shrink-0 rounded-lg bg-white/8 grid place-items-center mt-0.5">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-foreground hover:text-purple-300 transition-colors flex items-center gap-1"
                          aria-label={`Open ${src.title} on ${src.site}`}
                        >
                          {src.title}
                          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" aria-hidden />
                        </a>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 mb-1">{src.site}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{src.snippet}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* AI Synthesis */}
            <GlassCard hover={false} className="border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-400" aria-hidden />
                <h2 className="text-sm font-semibold text-foreground">AI Synthesis</h2>
              </div>
              <article className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line prose prose-invert prose-p:mb-3" aria-label="Research synthesis">
                {result.synthesis}
              </article>
            </GlassCard>

            {/* Follow-up Questions */}
            <GlassCard hover={false}>
              <h2 className="text-sm font-semibold text-foreground mb-3">Follow-up Questions</h2>
              <ul className="space-y-2" role="list">
                {result.followUps.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => handleFollowUp(q)}
                      className="w-full text-left flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                      aria-label={`Research: ${q}`}
                    >
                      <Search className="h-3 w-3 shrink-0 text-purple-400" aria-hidden />
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </PageContainer>
  );
}
