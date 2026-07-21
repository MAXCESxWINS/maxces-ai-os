import { createFileRoute } from "@tanstack/react-router";
import { Copy, Heart, Play, Sparkles, Wand2, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { GeminiAIEngine } from "@/lib/ai/gemini";
import { PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/prompt-studio")({
  head: () => ({ meta: [{ title: "MAXCES · Prompt Studio" }] }),
  component: PromptStudioPage,
});

interface PromptTemplate {
  name: string;
  cat: string;
  uses: number;
  prompt: string;
}

const TEMPLATES: PromptTemplate[] = [
  {
    name: "Sales email · v3",
    cat: "Marketing",
    uses: 128,
    prompt: `You are MAXCES, an elite sales copywriter.
Task: Write a cold sales email for a premium product.

Product: [Enter your product name]
Target Audience: [Enter your target audience]

Rule: Keep it under 150 words. Avoid generic phrases like "I hope this email finds you well". Focus on a clear value proposition and a low-friction call-to-action.`
  },
  {
    name: "Bug triage prompt",
    cat: "Engineering",
    uses: 89,
    prompt: `You are a senior QA engineer. Analyze the following bug report:

Bug: [Enter bug details]
Environment: [Enter environment details]

Task: Provide a severity rating (Critical, High, Medium, Low), a root-cause hypothesis, and the exact steps to reproduce or fix.`
  },
  {
    name: "Design critique",
    cat: "Design",
    uses: 62,
    prompt: `You are a principal UI/UX designer. Critique the following component design:

Component: [Enter component name or description]
Aspects to evaluate: Typography, Spacing, Color contrast.

Task: Provide 3 actionable aesthetic improvements matching Stripe/Linear style.`
  },
  {
    name: "SQL to English",
    cat: "Data",
    uses: 218,
    prompt: `Translate the following SQL query into plain, non-technical English:

SELECT u.email, COUNT(p.id) as projects_count
FROM users u
LEFT JOIN projects p ON p.user_id = u.id
WHERE u.status = 'active'
GROUP BY u.email
HAVING COUNT(p.id) > 5;

Explain: What tables are queried, what filters are applied, and what the final output contains.`
  },
  {
    name: "Investor update",
    cat: "Business",
    uses: 26,
    prompt: `You are a startup founder. Write a concise monthly investor update.

Key wins: [Enter key wins]
Key metrics: [Enter key metrics]

Task: Highlight progress, mention runway, and end with a specific ask.`
  }
];

function PromptStudioPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [promptContent, setPromptContent] = useState(TEMPLATES[0].prompt);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setPromptContent(TEMPLATES[selectedIdx].prompt);
  }, [selectedIdx]);

  const handleRun = async () => {
    if (!promptContent.trim()) return;
    setIsLoading(true);
    setOutput("");

    try {
      const res = await GeminiAIEngine.generateContent({
        prompt: promptContent,
        systemInstruction: "You are an expert AI prompt engineer assistant. Execute the prompt given by the user carefully and provide a premium, highly formatted output."
      });
      setOutput(res.text);
    } catch (err: any) {
      setOutput(`⚠️ **Execution Error**: ${err?.message || "Failed to run prompt"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = output || promptContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLike = (idx: number) => {
    setLiked(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <PageContainer>
      <TopBar title="Prompt Studio" subtitle="Craft and execute prompts with real AI integration" />
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Library Column */}
        <GlassCard className="h-fit" hover={false}>
          <div className="mb-3 text-sm font-semibold text-foreground">Library</div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Templates</div>
          <ul className="space-y-1.5" role="listbox" aria-label="Prompt Templates">
            {TEMPLATES.map((t, i) => (
              <li
                key={t.name}
                role="option"
                aria-selected={selectedIdx === i}
                className={`group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${
                  selectedIdx === i
                    ? "bg-primary/15 text-foreground ring-1 ring-inset ring-primary/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
                onClick={() => setSelectedIdx(i)}
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground/70">{t.cat} · {t.uses} runs</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(i);
                  }}
                  aria-label={liked[i] ? "Remove from favorites" : "Add to favorites"}
                  className="p-1 rounded-lg hover:bg-white/10 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors"
                >
                  <Heart className={`h-3.5 w-3.5 ${liked[i] ? "text-red-500 fill-red-500" : ""}`} />
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Right Editor & Preview Column */}
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 bg-white/[0.01]">
            <div className="flex items-center gap-2.5 text-sm">
              <Wand2 className="h-4 w-4 text-cyan-glow" />
              <span className="font-semibold text-foreground">{TEMPLATES[selectedIdx].name}</span>
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-medium text-purple-300">
                {TEMPLATES[selectedIdx].cat}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                aria-label="Copy prompt or output"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleRun}
                disabled={isLoading || !promptContent.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50 hover:scale-[1.02] transition-transform"
                aria-label="Run prompt with Gemini"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {isLoading ? "Running…" : "Run"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {/* Editor Textarea */}
            <div className="flex flex-col">
              <label htmlFor="prompt-textarea" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Prompt Editor</label>
              <textarea
                id="prompt-textarea"
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                placeholder="Write your prompt strategy here..."
                className="flex-1 min-h-[300px] rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-foreground/90 placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/60 transition-all resize-y"
              />
            </div>

            {/* Output Preview */}
            <div className="flex flex-col">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-glow" /> Output Preview
              </div>
              <div className="flex-1 min-h-[300px] rounded-xl border border-white/10 bg-white/[0.02] p-4 overflow-y-auto max-h-[500px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                    <p className="text-xs text-muted-foreground shimmer-text">Executing prompt with real-time Gemini pipeline...</p>
                  </div>
                ) : output ? (
                  <article className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap prose prose-invert">
                    {output}
                  </article>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10 text-muted-foreground">
                    <Wand2 className="h-8 w-8 text-white/10 mb-2" />
                    <p className="text-xs">Click 'Run' to generate live AI response output.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
