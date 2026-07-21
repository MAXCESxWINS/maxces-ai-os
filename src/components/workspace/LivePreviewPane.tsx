import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { WorkspaceFile } from '@/types/workspace';

export const LivePreviewPane: React.FC<{
  activeFile: WorkspaceFile | null;
  files: WorkspaceFile[];
}> = ({ activeFile, files }) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const viewportWidths = {
    desktop: 'w-full max-w-6xl',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-semibold text-foreground tracking-wide">Live Visual Component Preview</span>
          <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Ready
          </span>
        </div>

        {/* Viewport Selector */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${viewport === 'desktop' ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
            title="Desktop (1440px)"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${viewport === 'tablet' ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
            title="Tablet (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${viewport === 'mobile' ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}
            title="Mobile (375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Rendered Component Viewport Container */}
      <div className="flex-1 p-6 overflow-auto grid place-items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-black">
        <div className={`transition-all duration-300 rounded-3xl border border-purple-500/30 bg-black/60 shadow-2xl shadow-purple-500/10 overflow-hidden ${viewportWidths[viewport]}`}>
          {/* Simulated Component Rendering Frame */}
          <div className="p-8 space-y-8">
            <header className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 grid place-items-center shadow-lg shadow-purple-500/20">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white tracking-wide">MAXCES SaaS</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                <span>Features</span>
                <span>Pricing</span>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform">
                  Launch Platform
                </button>
              </div>
            </header>

            {/* Hero Section Preview */}
            <div className="text-center py-12 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[11px] font-semibold text-purple-300">
                <Sparkles className="h-3 w-3" /> Luxury Design System Active
              </span>
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                Handcrafted Visual Quality for SaaS Founders
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Experience dark glassmorphism, Bento grid layouts, and Framer Motion spring interactions.
              </p>
            </div>

            {/* Bento Grid Component Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-2xl border border-purple-500/30 bg-white/[0.02] p-6 backdrop-blur-xl hover:border-purple-500/60 transition-all">
                <h3 className="text-base font-bold text-white mb-2">Bento Grid Layout</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Modular React 19 component structure with dark glassmorphism styling tokens.</p>
              </div>
              <div className="rounded-2xl border border-cyan-500/30 bg-white/[0.02] p-6 backdrop-blur-xl hover:border-cyan-500/60 transition-all">
                <h3 className="text-base font-bold text-white mb-2">3D Glass Cards</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Glowing radial background borders and responsive viewports.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
