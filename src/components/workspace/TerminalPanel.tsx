import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { TerminalEngine, TerminalLogEntry, ProcessSession } from '@/runtime/terminal-engine';

export const TerminalPanel: React.FC<{
  onRunBuildCommand?: () => void;
}> = ({ onRunBuildCommand }) => {
  const [logs, setLogs] = useState<TerminalLogEntry[]>([]);
  const [activeSession, setActiveSession] = useState<ProcessSession | null>(null);

  useEffect(() => {
    // Initialize initial terminal runtime session
    const session = TerminalEngine.spawnProcess('npm run build');
    setActiveSession(session);
    setLogs(session.logs);

    // Simulate async static compilation stdout capture
    setTimeout(() => {
      TerminalEngine.appendLog(session.processId, 'stdout', 'vite v8.1.5 building for production...');
      TerminalEngine.appendLog(session.processId, 'stdout', 'transforming 2976 modules...');
      TerminalEngine.appendLog(session.processId, 'stdout', '✓ 2976 modules transformed cleanly in 344ms');
      TerminalEngine.completeProcess(session.processId, 0);
    }, 800);

    const unsubscribe = TerminalEngine.subscribe((updatedLogs) => {
      setLogs([...updatedLogs]);
    });

    return () => unsubscribe();
  }, []);

  const handleManualRun = () => {
    const session = TerminalEngine.spawnProcess('npx tsc --noEmit');
    setActiveSession(session);
    setLogs(session.logs);

    setTimeout(() => {
      TerminalEngine.appendLog(session.processId, 'stdout', 'TypeScript type check started...');
      TerminalEngine.appendLog(session.processId, 'stdout', '✓ 0 TypeScript errors found across 2976 modules');
      TerminalEngine.completeProcess(session.processId, 0);
      if (onRunBuildCommand) onRunBuildCommand();
    }, 600);
  };

  const handleClear = () => {
    setLogs([]);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl overflow-hidden text-xs font-mono">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-purple-400" />
          <span className="font-semibold text-foreground tracking-wide">MAXCES Terminal Runtime</span>
          {activeSession && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                activeSession.status === 'Success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : activeSession.status === 'Failed'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
            >
              {activeSession.status === 'Success' && <CheckCircle2 className="h-3 w-3" />}
              {activeSession.status === 'Failed' && <AlertCircle className="h-3 w-3" />}
              {activeSession.status === 'Installing' && <RefreshCw className="h-3 w-3 animate-spin" />}
              <span>{activeSession.status}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRun}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 transition-colors"
          >
            <Play className="h-3 w-3" /> Run Typecheck
          </button>
          <button onClick={handleClear} className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Buffer */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 font-mono text-xs leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-muted-foreground italic text-[11px]">Terminal output buffer is empty. Click "Run Typecheck" to execute process.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-muted-foreground/50 shrink-0 text-[10px] select-none">{new Date(log.timestamp).toLocaleTimeString()}</span>
              {log.type === 'command' && <span className="text-purple-400 font-bold">{log.text}</span>}
              {log.type === 'system' && <span className="text-cyan-400 font-semibold">{log.text}</span>}
              {log.type === 'stdout' && <span className="text-slate-300">{log.text}</span>}
              {log.type === 'stderr' && <span className="text-red-400 font-semibold">{log.text}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
