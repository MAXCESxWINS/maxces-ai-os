export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  type: 'stdout' | 'stderr' | 'system' | 'command';
  text: string;
}

export type ProcessStatus = 'Idle' | 'Installing' | 'Running' | 'Success' | 'Failed';

export interface ProcessSession {
  processId: string;
  command: string;
  status: ProcessStatus;
  startedAt: string;
  completedAt?: string;
  exitCode?: number;
  logs: TerminalLogEntry[];
  webcontainerActive: boolean;
}

export class TerminalEngine {
  private static activeSessions: Map<string, ProcessSession> = new Map();
  private static logListeners: ((logs: TerminalLogEntry[]) => void)[] = [];

  /**
   * Spawns a new terminal process session
   */
  static spawnProcess(command: string): ProcessSession {
    const processId = `proc_${Math.random().toString(36).substring(2, 9)}`;
    const session: ProcessSession = {
      processId,
      command,
      status: 'Installing',
      startedAt: new Date().toISOString(),
      logs: [
        {
          id: Math.random().toString(36).substring(2, 7),
          timestamp: new Date().toISOString(),
          type: 'command',
          text: `$ ${command}`,
        },
        {
          id: Math.random().toString(36).substring(2, 7),
          timestamp: new Date().toISOString(),
          type: 'system',
          text: `[MAXCES Runtime] Initiating process execution: ${command}`,
        },
      ],
      webcontainerActive: false, // Architecture Ready for WebContainer API
    };

    this.activeSessions.set(processId, session);
    return session;
  }

  /**
   * Appends stdout / stderr logs to a running session
   */
  static appendLog(processId: string, type: 'stdout' | 'stderr' | 'system', text: string) {
    const session = this.activeSessions.get(processId);
    if (!session) return;

    const entry: TerminalLogEntry = {
      id: Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      type,
      text,
    };

    session.logs.push(entry);
    this.notifyListeners(session.logs);
  }

  /**
   * Completes process session with exit code
   */
  static completeProcess(processId: string, exitCode: number) {
    const session = this.activeSessions.get(processId);
    if (!session) return;

    session.exitCode = exitCode;
    session.status = exitCode === 0 ? 'Success' : 'Failed';
    session.completedAt = new Date().toISOString();

    this.appendLog(
      processId,
      exitCode === 0 ? 'system' : 'stderr',
      `Process ${session.command} exited with code ${exitCode}`
    );
  }

  /**
   * Subscribes to terminal output updates
   */
  static subscribe(listener: (logs: TerminalLogEntry[]) => void) {
    this.logListeners.push(listener);
    return () => {
      this.logListeners = this.logListeners.filter((l) => l !== listener);
    };
  }

  private static notifyListeners(logs: TerminalLogEntry[]) {
    this.logListeners.forEach((listener) => listener(logs));
  }
}
