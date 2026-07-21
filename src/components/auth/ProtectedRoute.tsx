import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useRouterState, useNavigate } from '@tanstack/react-router';
import { AuroraBackground } from '@/components/maxces/AuroraBackground';
import { GlassCard } from '@/components/maxces/GlassCard';
import { Loader2, Lock, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isGuest, isLoading, error } = useAuth();
  const { canAccessRoute, getRouteMetadata } = usePermission();
  const routerState = useRouterState();
  const navigate = useNavigate();

  const currentPath = routerState.location.pathname;
  const isAllowed = canAccessRoute(currentPath);
  const routeMeta = getRouteMetadata(currentPath);

  // 1. Loading State Screen — Zero UI Flash
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
        <AuroraBackground />
        <GlassCard glow className="flex flex-col items-center justify-center gap-4 p-8 text-center backdrop-blur-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background/90">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            <span>Restoring MAXCES AI Session...</span>
          </div>
        </GlassCard>
      </div>
    );
  }

  // 2. Unauthenticated Visitor attempting access -> Redirect to /login
  if (!user && !isGuest && currentPath !== '/login') {
    navigate({ to: '/login' });
    return null;
  }

  // 3. Guest User attempting to access a Private Feature
  if (isGuest && !isAllowed) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
        <AuroraBackground />
        <GlassCard glow className="w-full max-w-md p-8 text-center backdrop-blur-2xl border border-purple-500/20 shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Lock className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-foreground">Private Feature Restricted</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-purple-300">{routeMeta?.title || 'This feature'}</span> requires a personal MAXCES AI account. 
            Sign up for free to unlock your personal AI memory, projects, and cloud synchronization.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate({ to: '/login' })}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all"
            >
              <span>Create Free Account / Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate({ to: '/' })}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
            >
              Return to Preview Dashboard
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // 4. Session Expiry Error Handler Modal
  if (error && error.message.includes('JWT')) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
        <AuroraBackground />
        <GlassCard glow className="w-full max-w-md p-8 text-center backdrop-blur-2xl border border-amber-500/20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-foreground">Session Expired</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Your security session has expired. Please sign in again to continue accessing your AI operating system.
          </p>

          <button
            onClick={() => navigate({ to: '/login' })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-semibold text-white shadow-lg hover:bg-purple-500 transition-all"
          >
            Return to Login
          </button>
        </GlassCard>
      </div>
    );
  }

  return <>{children}</>;
};
