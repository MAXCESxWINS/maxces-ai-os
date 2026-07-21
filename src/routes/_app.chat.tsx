import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowUp,
  Paperclip,
  Mic,
  Sparkles,
  Pin,
  Plus,
  Search,
  Command,
  Copy,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { AICore } from "@/components/maxces/AICore";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { AIRouter } from "@/lib/ai/router";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({
    meta: [
      { title: "MAXCES · AI Chat Core" },
      { name: "description", content: "Converse with your MAXCES intelligence cortex." },
    ],
  }),
  component: ChatPage,
});

const pinned = [
  "MAXCES AI OS Launch Checklist",
  "Phase 3 Database & Memory Architecture",
  "Supabase & Gemini API Integration",
];

const recent = [
  { title: "Core Brain & Memory Layer", time: "Just now" },
  { title: "Layered Authorization Setup", time: "1h" },
  { title: "Supabase RLS Verification", time: "3h" },
  { title: "Lovable UI Integration", time: "Yesterday" },
  { title: "Project DNA Schema", time: "2d" },
];

const suggestions = [
  "Continue MAXCES AI OS development",
  "Explain my project architecture",
  "Audit my current database setup",
  "What is our next step in Phase 3?",
];

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  modelUsed?: string;
}

function ChatPage() {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Good day, Founder. I am MAXCES AI OS — your personal CTO, Lead Developer, and System Architect. I have loaded your long-term memories and project context. How shall we proceed with building today?",
      modelUsed: "gemini-2.5-flash",
    },
  ]);

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText || value).trim();
    if (!textToSend || isThinking) return;

    // Append user message immediately
    const userMsg: ChatMessage = { role: "user", text: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    setValue("");
    setIsThinking(true);

    try {
      // Format history for Gemini engine
      const history = chatMessages.slice(-6).map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }],
      }));

      // Route and execute via AIRouter (Gemini Flash + Context Injection)
      const aiResult = await AIRouter.routeAndExecute({
        userId: user?.id,
        userPrompt: textToSend,
        projectName: "MAXCES AI OS",
        conversationHistory: history,
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        text: aiResult.text,
        modelUsed: aiResult.modelUsed,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ **System Error**: ${err?.message || "Failed to process prompt."}`,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setChatMessages([
      {
        role: "assistant",
        text: "New session initialized. How can I assist your MAXCES AI OS project?",
      },
    ]);
  };

  return (
    <div>
      <TopBar title="AI Chat" subtitle="Cortex Intelligence Engine" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left rail */}
        <div className="hidden lg:block">
          <GlassCard className="p-4">
            <button
              onClick={handleNewChat}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </button>
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              <input
                placeholder="Search chats…"
                className="flex-1 bg-transparent outline-none text-foreground"
              />
            </div>

            <div className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Pinned Contexts
            </div>
            <ul className="mb-4 space-y-1">
              {pinned.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground cursor-pointer transition-colors"
                >
                  <Pin className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="truncate">{p}</span>
                </li>
              ))}
            </ul>

            <div className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Recent Activity
            </div>
            <ul className="space-y-1">
              {recent.map((r) => (
                <li
                  key={r.title}
                  className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground cursor-pointer transition-colors"
                >
                  <span className="truncate">{r.title}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground/60">
                    {r.time}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Chat pane */}
        <GlassCard className="flex min-h-[72vh] flex-col p-0" hover={false}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AICore size={44} />
              </div>
              <div>
                <div className="text-sm font-semibold flex items-center gap-2">
                  <span>Cortex Intelligence Engine</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_var(--emerald-400)]" />
                  Context-Aware · Memory Storage & Project DNA Sync Active
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono">
                <Command className="mr-1 inline h-3 w-3" />K
              </kbd>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-8">
            {chatMessages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white ring-white/10"
                      : "bg-gradient-to-br from-purple-500/30 to-cyan-500/20 ring-purple-500/30"
                  }`}
                >
                  {m.role === "user" ? (
                    <span className="text-xs font-semibold">MX</span>
                  ) : (
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  )}
                </div>
                <div className={`max-w-[80%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                        : "border border-white/10 bg-white/[0.03] text-foreground/95"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                  {m.role === "assistant" && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <button
                        onClick={() => navigator.clipboard.writeText(m.text)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/5 transition-colors"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                      <button
                        onClick={() => handleSendMessage(chatMessages[i - 1]?.text)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/5 transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" /> Regenerate
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="flex gap-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/20 ring-1 ring-purple-500/30">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <span>MAXCES AI is retrieving memories & orchestrating CTO response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 border-t border-white/5 px-6 pt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSendMessage(s)}
                disabled={isThinking}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-purple-500/40 hover:bg-white/[0.06] hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="p-4">
            <div className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-2 transition-colors focus-within:border-purple-500/50">
              <div
                className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity group-focus-within:opacity-60"
                style={{ background: "linear-gradient(90deg, oklch(0.55 0.24 295 / 40%), oklch(0.82 0.15 210 / 40%))" }}
              />
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask MAXCES anything, or describe what you want to build (Press Enter to send)..."
                className="w-full resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
              <div className="flex items-center justify-between px-2 pb-1 pt-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5 transition-colors">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5 transition-colors">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!value.trim() || isThinking}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-center text-[10px] text-muted-foreground">
              MAXCES AI OS automatically queries your personal Supabase vector memories and Project DNA.
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
