import React from 'react';
import { GlassCard } from '@/components/maxces/GlassCard';
import { AuroraBackground } from '@/components/maxces/AuroraBackground';
import { ShieldAlert, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '@/lib/ai/tool-permissions';

interface ToolPermissionModalProps {
  toolDef: ToolDefinition;
  actionRequested: string;
  onApprove: () => void;
  onDeny: () => void;
}

export const ToolPermissionModal: React.FC<ToolPermissionModalProps> = ({
  toolDef,
  actionRequested,
  onApprove,
  onDeny,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <AuroraBackground />
      <GlassCard glow className="w-full max-w-lg p-8 border border-red-500/30 shadow-2xl backdrop-blur-2xl text-center">
        {/* Header Badge */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-lg shadow-red-500/20">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-300">
          <span>HIGH RISK TOOL ACTION REQUESTED</span>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-2">{toolDef.label}</h2>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          {toolDef.description}
        </p>

        {/* Details Box */}
        <div className="my-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Action Requested by AI Agent:
          </div>
          <div className="text-xs font-mono text-purple-300 bg-black/40 p-2.5 rounded-lg border border-white/5 break-all">
            {actionRequested}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDeny}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
          >
            <XCircle className="h-4 w-4 text-red-400" />
            <span>Deny Action</span>
          </button>

          <button
            onClick={onApprove}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-red-500/20 hover:opacity-95 transition-all"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Approve & Run</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
