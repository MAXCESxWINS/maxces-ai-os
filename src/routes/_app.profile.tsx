import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { UserRound, Mail, LogOut, Loader2, AlertTriangle, Trophy, Target, Star } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { ErrorBanner, PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "MAXCES · Profile" }] }),
  component: ProfilePage,
});

const ACHIEVEMENTS = [
  { id: "a1", label: "Ship it", desc: "10 projects launched", icon: "🚀" },
  { id: "a2", label: "Marathon", desc: "30-day streak", icon: "🏃" },
  { id: "a3", label: "Cortex Whisperer", desc: "10K prompts sent", icon: "🧠" },
  { id: "a4", label: "Open Source", desc: "100 GitHub stars", icon: "⭐" },
];

const SKILLS = [
  { label: "Product Design", value: 92 },
  { label: "TypeScript", value: 88 },
  { label: "AI Prompting", value: 95 },
  { label: "System Architecture", value: 76 },
];

const GOALS = [
  { id: "g1", text: "Ship MAXCES AI OS closed beta", done: false },
  { id: "g2", text: "Reach $10K MRR milestone", done: false },
  { id: "g3", text: "Build 5 AI-generated SaaS projects", done: true },
];

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const displayName =
    (user as { user_metadata?: { full_name?: string } })?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Your Account";

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join("");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
      navigate({ to: "/login" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign out failed. Please try again.";
      setSignOutError(msg);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <PageContainer>
      <TopBar title="Profile" subtitle="Your MAXCES AI OS account" />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Identity Card */}
        <aside aria-label="Profile identity">
          <GlassCard glow hover={false}>
            <div className="flex flex-col items-center text-center gap-4">
              {/* Avatar */}
              <div
                role="img"
                aria-label={`${displayName}'s avatar`}
                className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 grid place-items-center ring-2 ring-white/10 shadow-lg shadow-purple-500/20"
              >
                <span className="text-2xl font-bold text-white select-none" aria-hidden>{initials || "MX"}</span>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-background" title="Online" aria-label="Online" />
              </div>

              <div className="space-y-0.5">
                <h1 className="font-bold text-foreground text-lg tracking-tight">{displayName}</h1>
                {user?.email && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" aria-hidden />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] font-semibold text-purple-300">
                  Pro · Cortex Plan
                </span>
              </div>

              {signOutError && (
                <ErrorBanner message={signOutError} className="w-full text-left" />
              )}

              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/15 disabled:opacity-50 transition-colors"
                aria-label="Sign out of MAXCES AI OS"
              >
                {isSigningOut
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  : <LogOut className="h-3.5 w-3.5" aria-hidden />
                }
                {isSigningOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </GlassCard>
        </aside>

        {/* Main Profile Content */}
        <div className="space-y-5">
          {/* Achievements */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-amber-400" aria-hidden />
              <h2 className="font-semibold text-foreground text-sm">Achievements</h2>
            </div>
            <ul className="grid grid-cols-2 gap-2.5" role="list" aria-label="Achievements">
              {ACHIEVEMENTS.map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] p-3"
                >
                  <span className="text-lg" role="img" aria-label={a.label}>{a.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{a.label}</p>
                    <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </GlassCard>

          {/* Skills */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-cyan-400" aria-hidden />
              <h2 className="font-semibold text-foreground text-sm">Skills</h2>
            </div>
            <ul className="space-y-3.5" role="list" aria-label="Skill proficiency levels">
              {SKILLS.map((skill) => (
                <li key={skill.label}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-foreground font-medium">{skill.label}</span>
                    <span className="text-muted-foreground" aria-hidden>{skill.value}%</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full bg-white/8 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={skill.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.label}: ${skill.value}%`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Goals */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-emerald-400" aria-hidden />
              <h2 className="font-semibold text-foreground text-sm">Goals</h2>
            </div>
            <ul className="space-y-2" role="list" aria-label="Your goals">
              {GOALS.map((g) => (
                <li key={g.id} className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      g.done
                        ? "border-emerald-400 bg-emerald-400/20"
                        : "border-white/20 bg-transparent"
                    }`}
                    role="img"
                    aria-label={g.done ? "Goal completed" : "Goal pending"}
                  >
                    {g.done && (
                      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke="oklch(0.72 0.17 155)" strokeWidth="2" strokeLinecap="round" aria-hidden>
                        <path d="M2 5l2 2 4-4" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs ${g.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {g.text}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Account Info */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <UserRound className="h-4 w-4 text-muted-foreground" aria-hidden />
              <h2 className="font-semibold text-foreground text-sm">Account Details</h2>
            </div>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="font-mono text-foreground/70 text-[10px]">{user?.id?.slice(0, 16) ?? "—"}…</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="text-foreground">{user?.email ?? "—"}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-muted-foreground">Account Created</dt>
                <dd className="text-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                </dd>
              </div>
            </dl>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
