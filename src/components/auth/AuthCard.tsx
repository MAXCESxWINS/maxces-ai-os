import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/maxces/GlassCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

type AuthMode = 'login' | 'signup' | 'forgot';

export function AuthCard() {
  const navigate = useNavigate();
  const { user, enableGuestMode } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password strength validation
  const isPasswordStrong = password.length >= 6;

  // Clear messages on mode switch
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Google OAuth Login
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Email / Password Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot' && !password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (mode === 'signup' && !isPasswordStrong) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);

      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate({ to: '/' });
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName || email.split('@')[0],
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          setSuccessMsg('Account created successfully! Logging you in...');
          setTimeout(() => navigate({ to: '/' }), 1000);
        } else {
          setSuccessMsg('Account created! Please check your email inbox to verify your account.');
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setSuccessMsg('Password reset link has been sent to your email.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please check your details.');
      } else if (err.message?.includes('User already registered')) {
        setErrorMsg('An account with this email already exists. Try logging in.');
      } else {
        setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Guest Access Flow
  const handleGuestAccess = () => {
    enableGuestMode();
    navigate({ to: '/' });
  };

  return (
    <GlassCard glow className="w-full max-w-md border border-white/10 p-8 shadow-2xl backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20"
        >
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background/90 backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
        </motion.div>
        
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          MAXCES <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">AI OS</span>
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {mode === 'login' && 'Welcome back! Sign in to access your personal AI operating system.'}
          {mode === 'signup' && 'Create your account to unlock your personal AI workspace.'}
          {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
        </p>
      </div>

      {/* Auth Mode Toggle Tabs */}
      {mode !== 'forgot' && (
        <div className="mb-6 grid grid-cols-2 rounded-xl bg-white/5 p-1 border border-white/5">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`rounded-lg py-2 text-xs font-medium transition-all ${
              mode === 'login' 
                ? 'bg-purple-600/30 text-white shadow-sm border border-purple-500/30' 
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`rounded-lg py-2 text-xs font-medium transition-all ${
              mode === 'signup' 
                ? 'bg-purple-600/30 text-white shadow-sm border border-purple-500/30' 
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Success / Error Banners */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:opacity-95 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <>
              <span>
                {mode === 'login' && 'Sign In to Operating System'}
                {mode === 'signup' && 'Create Personal Workspace'}
                {mode === 'forgot' && 'Send Password Reset Email'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative bg-black/60 px-3 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          OR CONTINUE WITH
        </span>
      </div>

      {/* OAuth & Guest Options */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={handleGuestAccess}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-transparent py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-white/30 hover:text-foreground"
        >
          <span>Explore Preview Mode (Guest)</span>
        </button>
      </div>

      {/* Back to Login link if in forgot password mode */}
      {mode === 'forgot' && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className="text-xs text-purple-400 hover:underline"
          >
            ← Back to Sign In
          </button>
        </div>
      )}
    </GlassCard>
  );
}
