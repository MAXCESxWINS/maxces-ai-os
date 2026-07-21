import { RuntimeSession, RuntimeStatus, RuntimeExecutionLog } from '@/types/runtime';
import { WorkspaceFile } from '@/types/workspace';
import { AIBuildEngine } from './build-engine';
import { AITestingAssistant } from './testing-assistant';
import { ProjectHealthEngine } from './project-health-engine';

export class RuntimeManager {
  private static activeSessions: Map<string, RuntimeSession> = new Map();

  /**
   * Starts a new runtime validation & execution session for a project
   */
  static createSession(params: {
    projectId: string;
    userId: string;
    envVars?: Record<string, string>;
  }): RuntimeSession {
    const sessionId = `runtime_${Math.random().toString(36).substring(2, 9)}`;
    const session: RuntimeSession = {
      sessionId,
      projectId: params.projectId,
      userId: params.userId,
      status: 'Idle',
      startedAt: new Date().toISOString(),
      logs: [
        {
          id: Math.random().toString(36).substring(2, 7),
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Runtime execution session initialized (Session ID: ${sessionId}).`,
          source: 'RuntimeManager',
        },
      ],
      environmentVariables: params.envVars || {},
      runtimeCapabilities: {
        terminalBridgeActive: false, // Architecture Ready (Phase 11.2)
        browserAutomationActive: false, // Architecture Ready (Phase 11.3)
        visionModelActive: false, // Architecture Ready (Phase 11.4)
      },
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Executes full project validation session across BuildEngine, TestingAssistant, and ProjectHealthEngine
   */
  static async executeValidationCycle(params: {
    sessionId: string;
    files: WorkspaceFile[];
    projectName?: string;
  }): Promise<RuntimeSession> {
    const session = this.activeSessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session ${params.sessionId} not found.`);
    }

    try {
      // 1. Transition to Installing State
      this.updateStatus(session, 'Installing', 'Validating workspace structure and package dependencies...');

      // 2. Transition to Running / Build Check State
      this.updateStatus(session, 'Running', 'Executing static build syntax analysis...');
      const buildReport = await AIBuildEngine.validateWorkspaceBuild(params.files);

      if (buildReport.issues.length > 0) {
        this.addLog(session, 'warn', `Build check found ${buildReport.issues.length} potential issues.`, 'BuildEngine');
      } else {
        this.addLog(session, 'success', 'Build syntax check passed cleanly with 0 syntax errors.', 'BuildEngine');
      }

      // 3. Transition to Testing State
      this.updateStatus(session, 'Testing', 'Running quality audits, accessibility, and SEO inspections...');
      const auditReport = await AITestingAssistant.auditWorkspaceFiles(params.files);
      const unifiedHealth = ProjectHealthEngine.generateUnifiedHealthReport(params.files, params.projectName);

      this.addLog(
        session,
        'success',
        `Unified Health Audit completed: Overall Score ${unifiedHealth.overallHealthScore}/100 (${unifiedHealth.summaryStatus}).`,
        'ProjectHealthEngine'
      );

      // 4. Complete Session
      this.updateStatus(session, 'Completed', 'Runtime validation cycle completed successfully.');
      session.completedAt = new Date().toISOString();
      return session;
    } catch (err: any) {
      this.updateStatus(session, 'Failed', `Runtime validation failed: ${err?.message || 'Execution error'}`);
      this.addLog(session, 'error', err?.message || 'Unknown runtime error', 'RuntimeManager');
      return session;
    }
  }

  /**
   * Retrieves active runtime session by ID
   */
  static getSession(sessionId: string): RuntimeSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  private static updateStatus(session: RuntimeSession, status: RuntimeStatus, logMessage: string) {
    session.status = status;
    this.addLog(session, status === 'Failed' ? 'error' : status === 'Completed' ? 'success' : 'info', logMessage, 'RuntimeManager');
  }

  private static addLog(
    session: RuntimeSession,
    level: 'info' | 'warn' | 'error' | 'success',
    message: string,
    source: RuntimeExecutionLog['source']
  ) {
    session.logs.push({
      id: Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
    });
  }
}
