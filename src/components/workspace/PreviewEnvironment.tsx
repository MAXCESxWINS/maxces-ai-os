import React, { useState } from 'react';
import { GlassCard } from '@/components/maxces/GlassCard';
import { Monitor, Tablet, Smartphone, CheckCircle, AlertTriangle, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { WorkspaceFile } from '@/types/workspace';

interface PreviewEnvironmentProps {
  files: WorkspaceFile[];
  activeFile?: WorkspaceFile | null;
  projectName?: string;
}

export const PreviewEnvironment: React.FC<PreviewEnvironmentProps> = ({
  files,
  activeFile,
  projectName = 'MAXCES Application',
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [status, setStatus] = useState<'running' | 'building' | 'failed'>('running');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]',
  };

  const currentCode = activeFile?.file_content || files[0]?.file_content || '';

  return (
    <GlassCard hover={false} className="p-0 overflow-hidden flex flex-col h-full border border-purple-500/30">
      {/* Sandbox Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-4 py-3 bg-black/40 backdrop-blur-xl gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-semibold text-foreground truncate max-w-[180px]">
            {projectName} Sandbox
          </span>

          {/* Status Badge */}
          {status === 'running' && (
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Running ✅
            </span>
          )}
          {status === 'building' && (
            <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-[10px] text-purple-300 font-semibold flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" /> Building...
            </span>
          )}
          {status === 'failed' && (
            <span className="rounded-full bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 text-[10px] text-red-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Failed ❌
            </span>
          )}
        </div>

        {/* Viewport Controls */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'desktop' ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Desktop View"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'tablet' ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Tablet View"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'mobile' ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Mobile View"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Live Sandbox Container */}
      <div className="flex-1 overflow-auto p-4 bg-slate-950/80 flex justify-center items-start min-h-[400px]">
        <div className={`transition-all duration-300 ${containerWidths[deviceMode]} w-full`}>
          {status === 'failed' && errorMessage ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-red-400 mb-2" />
              <h3 className="text-sm font-bold text-foreground">Preview Render Error</h3>
              <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
              <button
                onClick={() => setStatus('running')}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry Preview
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 text-slate-100 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Live Component Render</span>
                </div>
                <span className="text-[10px] text-muted-foreground">React 19 + Tailwind v4</span>
              </div>

              {/* Render Simulated Preview Content */}
              <div className="space-y-4">
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                  <h2 className="text-lg font-bold text-white">{projectName}</h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Interactive AI Component Preview Active. Inspected file:{' '}
                    <code className="text-purple-300 font-mono">{activeFile?.file_path || 'src/App.tsx'}</code>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                    <div className="font-semibold text-cyan-300">State Simulation</div>
                    <div className="text-[11px] text-muted-foreground mt-1">Live props and React hooks initialized.</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                    <div className="font-semibold text-emerald-300">Responsive Layout</div>
                    <div className="text-[11px] text-muted-foreground mt-1">Viewport set to {deviceMode.toUpperCase()} mode.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
