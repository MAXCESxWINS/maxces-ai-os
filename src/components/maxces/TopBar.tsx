import { Bell, Search, Zap } from "lucide-react";
import type { ReactNode } from "react";

export function TopBar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pb-6 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
          MAXCES / {title}
        </div>
        <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {subtitle ?? title}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full glass px-3.5 py-2 text-sm text-muted-foreground md:flex w-[280px]">
          <Search className="h-4 w-4" />
          <input
            placeholder="Search anything, ask MAXCES…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>
        {actions}
        <button className="relative grid h-10 w-10 place-items-center rounded-full glass transition-transform hover:scale-105">
          <Bell className="h-4 w-4 text-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-glow shadow-[0_0_10px_var(--cyan-glow)]" />
        </button>
        <button className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] sm:flex">
          <Zap className="h-4 w-4" />
          Upgrade
        </button>
      </div>
    </header>
  );
}
