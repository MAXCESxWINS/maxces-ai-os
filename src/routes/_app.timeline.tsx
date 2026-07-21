import { createFileRoute } from "@tanstack/react-router";
import { Clock, Code2, MessageSquare, Rocket, GitBranch, Globe, Zap } from "lucide-react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { EmptyState, PageContainer } from "@/components/maxces/Primitives";
import type { ComponentType } from "react";

export const Route = createFileRoute("/_app/timeline")({
  head: () => ({ meta: [{ title: "MAXCES · Timeline" }] }),
  component: TimelinePage,
});

interface TimelineEvent {
  id: string;
  type: string;
  label: string;
  time: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
}

interface TimelineDay {
  date: string;
  isoDate: string;
  isToday: boolean;
  events: TimelineEvent[];
}

// Generate today's date dynamically — never hardcode dates
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

const iso = (d: Date) => d.toISOString().split("T")[0];

const DAYS: TimelineDay[] = [
  {
    date: `Today · ${fmt(today)}`,
    isoDate: iso(today),
    isToday: true,
    events: [
      { id: "e1", type: "deploy", label: "Deployed MAXCES AI OS to Vercel staging", time: "2h ago", icon: Rocket, color: "text-purple-400 bg-purple-500/10" },
      { id: "e2", type: "chat", label: "31 messages in AI chat session", time: "4h ago", icon: MessageSquare, color: "text-cyan-400 bg-cyan-500/10" },
      { id: "e3", type: "code", label: "Generated luxury SaaS landing page", time: "6h ago", icon: Code2, color: "text-indigo-400 bg-indigo-500/10" },
    ],
  },
  {
    date: `Yesterday · ${fmt(yesterday)}`,
    isoDate: iso(yesterday),
    isToday: false,
    events: [
      { id: "e4", type: "git", label: "Pushed 14 files to GitHub feature branch", time: "Yesterday 3pm", icon: GitBranch, color: "text-emerald-400 bg-emerald-500/10" },
      { id: "e5", type: "review", label: "Analyzed stripe.com design patterns", time: "Yesterday 11am", icon: Globe, color: "text-amber-400 bg-amber-500/10" },
      { id: "e6", type: "deploy", label: "Deployed Orbit CRM to Netlify", time: "Yesterday 9am", icon: Zap, color: "text-teal-400 bg-teal-500/10" },
    ],
  },
  {
    date: fmt(twoDaysAgo),
    isoDate: iso(twoDaysAgo),
    isToday: false,
    events: [
      { id: "e7", type: "code", label: "ZIP import engine built from scratch", time: "2 days ago, 5pm", icon: Code2, color: "text-indigo-400 bg-indigo-500/10" },
      { id: "e8", type: "chat", label: "18 messages — GitHub OAuth planning", time: "2 days ago, 2pm", icon: MessageSquare, color: "text-cyan-400 bg-cyan-500/10" },
    ],
  },
];

export function TimelinePage() {
  const hasEvents = DAYS.some((d) => d.events.length > 0);

  return (
    <PageContainer>
      <TopBar title="Timeline" subtitle="Your complete AI activity history" />

      {!hasEvents ? (
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title="No activity yet"
          description="Your AI actions, deployments, and code generations will appear here."
        />
      ) : (
        <div className="space-y-8" role="feed" aria-label="Activity timeline">
          {DAYS.map((day) => (
            <section key={day.isoDate} aria-label={`Activity on ${day.date}`}>
              {/* Day header */}
              <div className="mb-4 flex items-center gap-3">
                <time
                  dateTime={day.isoDate}
                  className={`text-xs font-semibold ${day.isToday ? "text-purple-300" : "text-muted-foreground"}`}
                >
                  {day.date}
                </time>
                <div className="flex-1 h-px bg-white/8" aria-hidden />
                <span className="text-[10px] text-muted-foreground/50" aria-label={`${day.events.length} events`}>
                  {day.events.length} {day.events.length === 1 ? "event" : "events"}
                </span>
              </div>

              {/* Events — using ol for ordered chronological list */}
              <GlassCard hover={false}>
                <ol className="relative space-y-4 pl-6" aria-label={`Events on ${day.date}`}>
                  {/* Vertical timeline line — using pseudo-element via classname, not invalid div child */}
                  {day.events.map((event, i) => {
                    const Icon = event.icon;
                    return (
                      <li key={event.id} className="relative flex items-start gap-3" aria-label={event.label}>
                        {/* Connector line */}
                        {i < day.events.length - 1 && (
                          <div
                            className="absolute -bottom-4 left-[-13px] top-6 w-px bg-white/10"
                            aria-hidden
                          />
                        )}
                        {/* Timeline dot with icon */}
                        <div
                          className={`absolute -left-[13px] top-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${event.color}`}
                          aria-hidden
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        {/* Event content */}
                        <div className="pl-1 min-w-0">
                          <p className="text-xs font-medium text-foreground leading-relaxed">{event.label}</p>
                          <time
                            dateTime={day.isoDate}
                            className="text-[10px] text-muted-foreground/60 mt-0.5 block"
                          >
                            {event.time}
                          </time>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </GlassCard>
            </section>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
