/**
 * MAXCES AI OS — Shared UI Primitives
 * Premium empty states, loading skeletons, error banners, page loaders.
 * Used across ALL pages. Do not duplicate these patterns.
 */

import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, RefreshCw, Inbox, Search, Loader2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------
export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 w-full rounded-lg", className)} aria-hidden />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-3"
      role="status"
      aria-label="Loading content"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton h-8 w-8 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-2/3" />
          <SkeletonLine className="w-1/3 h-3" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} className={i === lines - 1 ? "w-3/4" : "w-full"} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonGrid({ count = 3, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <div
      className={cn("grid gap-4", {
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": cols === 3,
        "grid-cols-1 sm:grid-cols-2": cols === 2,
        "grid-cols-1": cols === 1,
      })}
      role="status"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full-Page Loader
// ---------------------------------------------------------------------------
export function PageLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5"
      role="status"
      aria-label={message}
      aria-live="polite"
    >
      <div className="relative">
        {/* Outer ring */}
        <div className="h-14 w-14 rounded-full border border-white/10" />
        {/* Spinning arc */}
        <div className="absolute inset-0 h-14 w-14 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-purple-400/60" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground shimmer-text">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Spinner
// ---------------------------------------------------------------------------
export function Spinner({ size = "sm", className }: { size?: "xs" | "sm" | "md"; className?: string }) {
  const sizes = { xs: "h-3 w-3", sm: "h-4 w-4", md: "h-5 w-5" };
  return (
    <Loader2
      className={cn("animate-spin text-purple-400", sizes[size], className)}
      aria-hidden
    />
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: "sm" | "md";
}

export function EmptyState({ icon, title, description, action, size = "md" }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "md" ? "py-16 gap-4" : "py-8 gap-3"
      )}
      role="status"
    >
      {icon ? (
        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-muted-foreground">
          {icon}
        </div>
      ) : (
        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-muted-foreground">
          <Inbox className="h-6 w-6" />
        </div>
      )}
      <div>
        <p className={cn("font-semibold text-foreground", size === "md" ? "text-base" : "text-sm")}>{title}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground/80 max-w-xs leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}

// Empty state variant for searches
export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="h-6 w-6" />}
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or check spelling."
    />
  );
}

// ---------------------------------------------------------------------------
// Error Banner
// ---------------------------------------------------------------------------
interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({ title = "Something went wrong", message, onRetry, className }: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/8 px-4 py-4",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-300">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          aria-label="Retry"
          className="shrink-0 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="h-3 w-3" aria-hidden />
          Retry
        </button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Success Banner
// ---------------------------------------------------------------------------
export function SuccessBanner({ title, message, className }: { title: string; message?: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-4",
        className
      )}
    >
      <div className="h-4 w-4 rounded-full bg-emerald-400 mt-0.5 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 6l2.5 2.5L10 4" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-300">{title}</p>
        {message && <p className="text-xs text-muted-foreground mt-0.5">{message}</p>}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Keyboard Shortcuts Modal
// ---------------------------------------------------------------------------
const SHORTCUTS = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["⌘", "Enter"], label: "Send / Submit" },
  { keys: ["⌘", "/"], label: "Show shortcuts" },
  { keys: ["Esc"], label: "Close / Cancel" },
  { keys: ["⌘", "S"], label: "Save current file" },
  { keys: ["⌘", "Z"], label: "Undo last action" },
  { keys: ["⌘", "Shift", "Z"], label: "Redo" },
  { keys: ["Tab"], label: "Navigate forward" },
  { keys: ["Shift", "Tab"], label: "Navigate backward" },
];

export function KeyboardShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-3xl glass-strong border border-white/12 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground text-base">Keyboard Shortcuts</h2>
                <button
                  onClick={onClose}
                  aria-label="Close shortcuts modal"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M3.22 3.22a.75.75 0 011.06 0L8 6.94l3.72-3.72a.75.75 0 111.06 1.06L9.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 01-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 010-1.06z" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-2" role="list">
                {SHORTCUTS.map((s) => (
                  <li key={s.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k) => (
                        <kbd
                          key={k}
                          className="rounded-md border border-white/12 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-foreground"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Onboarding Welcome Banner (shown once, dismissable)
// ---------------------------------------------------------------------------
interface OnboardingBannerProps {
  username?: string;
  onDismiss: () => void;
}

export function OnboardingBanner({ username, onDismiss }: OnboardingBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, height: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      role="region"
      aria-label="Welcome banner"
      className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-cyan-600/10 p-6 mb-6"
    >
      {/* Decorative orb */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" aria-hidden />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
            <Sparkles className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div>
            <p className="font-bold text-foreground text-base">
              Welcome to MAXCES AI OS{username ? `, ${username}` : ""}! 👋
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
              Start by building a website in{" "}
              <span className="text-purple-300 font-medium">Code Builder</span>, or push an existing project to{" "}
              <span className="text-purple-300 font-medium">GitHub</span> and deploy it live in one click.
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss welcome banner"
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Got it
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Animated Page Wrapper (wraps page content with enter animation)
// ---------------------------------------------------------------------------
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Status Dot
// ---------------------------------------------------------------------------
type StatusDotColor = "green" | "yellow" | "red" | "blue" | "gray";
const dotColors: Record<StatusDotColor, string> = {
  green: "bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]",
  yellow: "bg-amber-400 shadow-[0_0_8px_theme(colors.amber.400)]",
  red: "bg-red-400 shadow-[0_0_8px_theme(colors.red.400)]",
  blue: "bg-cyan-400 shadow-[0_0_8px_theme(colors.cyan.400)]",
  gray: "bg-slate-500",
};

export function StatusDot({ color = "gray", pulse = false }: { color?: StatusDotColor; pulse?: boolean }) {
  return (
    <span
      role="presentation"
      className={cn("inline-block h-2 w-2 rounded-full shrink-0", dotColors[color], pulse && "animate-pulse")}
    />
  );
}
