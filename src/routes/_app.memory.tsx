import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useId } from "react";
import { Brain, Search, Pin, Tag, Clock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { EmptyState, SearchEmptyState, PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/memory")({
  head: () => ({ meta: [{ title: "MAXCES · Memory" }] }),
  component: MemoryPage,
});

const MEMORIES = [
  {
    id: "m1",
    title: "AI Product Design Principles",
    body: "Premium AI products feel different through micro-interactions that acknowledge user intent. The best interfaces anticipate rather than react.",
    tags: ["design", "AI"],
    date: "Jul 18",
    pinned: true,
  },
  {
    id: "m2",
    title: "Founder PM Notes",
    body: "Ship small, validate fast. Never over-architect before market signal. The best products are discovered, not designed upfront.",
    tags: ["strategy", "PM"],
    date: "Jul 16",
    pinned: false,
  },
  {
    id: "m3",
    title: "React Performance Patterns",
    body: "useMemo + useCallback should solve re-render issues. Lazy load heavy components. Use React.memo for static leaf nodes.",
    tags: ["react", "performance"],
    date: "Jul 14",
    pinned: false,
  },
  {
    id: "m4",
    title: "Glassmorphism Design System",
    body: "oklch color space for vibrant dark themes. backdrop-filter: blur(24px) saturate(160%) for premium glass effect. Always add top highlight.",
    tags: ["design", "css"],
    date: "Jul 12",
    pinned: true,
  },
];

// Derive all unique tags from data (no random numbers in render)
const ALL_TAGS = ["All", ...Array.from(new Set(MEMORIES.flatMap((m) => m.tags)))];
const tagCounts: Record<string, number> = { All: MEMORIES.length };
MEMORIES.forEach((m) => m.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));

export function MemoryPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const searchId = useId();

  const filtered = useMemo(() => {
    let result = MEMORIES;
    if (activeTag !== "All") result = result.filter((m) => m.tags.includes(activeTag));
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q) || m.body.toLowerCase().includes(q));
    }
    return result;
  }, [query, activeTag]);

  return (
    <PageContainer>
      <TopBar title="Memory" subtitle="AI long-term context & knowledge base" />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Left Sidebar */}
        <aside aria-label="Memory filters">
          <GlassCard hover={false}>
            {/* Search */}
            <div className="mb-4">
              <label htmlFor={searchId} className="sr-only">Search memories</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" aria-hidden />
                <input
                  id={searchId}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search memories…"
                  type="search"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-purple-500/60"
                />
              </div>
            </div>

            {/* Tag Filters */}
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Filter by tag</p>
              <ul role="listbox" aria-label="Filter memories by tag" className="space-y-1">
                {ALL_TAGS.map((tag) => (
                  <li key={tag} role="option" aria-selected={activeTag === tag}>
                    <button
                      onClick={() => setActiveTag(tag)}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                        activeTag === tag
                          ? "bg-purple-500/15 border border-purple-500/30 text-purple-200"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                      aria-label={`Filter by ${tag} (${tagCounts[tag] ?? 0} items)`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3 w-3" aria-hidden />
                        {tag}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">{tagCounts[tag] ?? 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="mt-5 pt-4 border-t border-white/8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Brain className="h-3.5 w-3.5 text-purple-400" aria-hidden />
                <span>{MEMORIES.length} total memories</span>
              </div>
            </div>
          </GlassCard>
        </aside>

        {/* Memory Cards */}
        <main aria-label="Memory results" aria-live="polite">
          {filtered.length === 0 ? (
            query ? (
              <SearchEmptyState query={query} />
            ) : (
              <EmptyState
                icon={<Brain className="h-6 w-6" />}
                title="No memories in this tag"
                description="Switch to 'All' or create new memories from your AI conversations."
              />
            )
          ) : (
            <div className="space-y-4">
              {filtered.map((mem, i) => (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <GlassCard className={mem.pinned ? "border border-purple-500/20" : ""}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {mem.pinned && (
                          <Pin className="h-3.5 w-3.5 text-purple-400 shrink-0" aria-label="Pinned memory" />
                        )}
                        <h3 className="font-semibold text-foreground text-sm truncate">{mem.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" aria-hidden />
                        <time dateTime={mem.date}>{mem.date}</time>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{mem.body}</p>

                    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Tags">
                      {mem.tags.map((t) => (
                        <span
                          key={t}
                          role="listitem"
                          className="inline-flex items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-500/8 px-2 py-0.5 text-[10px] font-medium text-purple-300"
                        >
                          <Sparkles className="h-2.5 w-2.5" aria-hidden />
                          {t}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </PageContainer>
  );
}
