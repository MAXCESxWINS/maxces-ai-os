export type RuntimeStatus = 'Idle' | 'Installing' | 'Running' | 'Testing' | 'Completed' | 'Failed';

export interface RuntimeExecutionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source: 'RuntimeManager' | 'BuildEngine' | 'TestingAssistant' | 'ProjectHealthEngine' | 'TerminalBridge';
}

export interface RuntimeSession {
  sessionId: string;
  projectId: string;
  userId: string;
  status: RuntimeStatus;
  startedAt: string;
  completedAt?: string;
  logs: RuntimeExecutionLog[];
  activePort?: number;
  environmentVariables: Record<string, string>;
  runtimeCapabilities: {
    terminalBridgeActive: boolean;
    browserAutomationActive: boolean;
    visionModelActive: boolean;
  };
}
