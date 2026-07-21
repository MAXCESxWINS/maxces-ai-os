/**
 * Risk-Tiered Tool Permission Security Gateway for MAXCES AI OS
 * Ensures every tool action is evaluated against security risk tiers before execution.
 */

export type ToolRiskLevel = 'low' | 'medium' | 'high';

export interface ToolDefinition {
  name: string;
  label: string;
  riskLevel: ToolRiskLevel;
  description: string;
  requiresConfirmation: boolean;
  allowedRoles: ('user' | 'admin')[];
}

export interface ToolActionLog {
  id: string;
  userId?: string;
  toolName: string;
  riskLevel: ToolRiskLevel;
  actionRequested: string;
  status: 'approved' | 'denied' | 'auto_granted';
  timestamp: string;
  resultSummary?: string;
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  website_scan: {
    name: 'website_scan',
    label: 'Website Audit & URL Inspector',
    riskLevel: 'low',
    description: 'Inspects public website URL metadata, UI/UX, SEO, and visual performance.',
    requiresConfirmation: false,
    allowedRoles: ['user', 'admin'],
  },
  file_read: {
    name: 'file_read',
    label: 'File & Project Inspector',
    riskLevel: 'low',
    description: 'Reads uploaded package.json, code text, or project files for health audits.',
    requiresConfirmation: false,
    allowedRoles: ['user', 'admin'],
  },
  database_write: {
    name: 'database_write',
    label: 'AI Memory & Project DNA Storage',
    riskLevel: 'medium',
    description: 'Saves new AI memories, preferences, and project goals to your database.',
    requiresConfirmation: false,
    allowedRoles: ['user', 'admin'],
  },
  modify_files: {
    name: 'modify_files',
    label: 'Code & File Modifications',
    riskLevel: 'medium',
    description: 'Applies code patches or edits existing files in your project workspace.',
    requiresConfirmation: true,
    allowedRoles: ['user', 'admin'],
  },
  github_read: {
    name: 'github_read',
    label: 'GitHub Repository Reader',
    riskLevel: 'low',
    description: 'Reads repository commits, issues, and branch history.',
    requiresConfirmation: false,
    allowedRoles: ['user', 'admin'],
  },
  github_write: {
    name: 'github_write',
    label: 'GitHub Code Push & Commit',
    riskLevel: 'high',
    description: 'Creates new branches, commits, or opens Pull Requests on GitHub.',
    requiresConfirmation: true,
    allowedRoles: ['user', 'admin'],
  },
  deployment: {
    name: 'deployment',
    label: 'Cloud Deployment Trigger',
    riskLevel: 'high',
    description: 'Triggers production build deployments to Vercel or Cloudflare.',
    requiresConfirmation: true,
    allowedRoles: ['user', 'admin'],
  },
  database_schema_change: {
    name: 'database_schema_change',
    label: 'Database Table & Schema Migration',
    riskLevel: 'high',
    description: 'Alters PostgreSQL table structures or RLS policies.',
    requiresConfirmation: true,
    allowedRoles: ['admin'],
  },
};

export class ToolPermissionSecurityGateway {
  private static actionLogs: ToolActionLog[] = [];

  /**
   * Evaluates if a tool execution requires explicit user confirmation
   */
  static evaluatePermission(toolName: string): {
    requiresModal: boolean;
    toolDef?: ToolDefinition;
    autoGranted: boolean;
  } {
    const toolDef = TOOL_REGISTRY[toolName];
    if (!toolDef) {
      // Unknown tools default to High Risk confirmation
      return { requiresModal: true, autoGranted: false };
    }

    if (toolDef.riskLevel === 'high' || toolDef.requiresConfirmation) {
      return { requiresModal: true, toolDef, autoGranted: false };
    }

    return { requiresModal: false, toolDef, autoGranted: true };
  }

  /**
   * Logs a tool action execution for security audit trails
   */
  static logAction(params: {
    userId?: string;
    toolName: string;
    actionRequested: string;
    status: 'approved' | 'denied' | 'auto_granted';
    resultSummary?: string;
  }): ToolActionLog {
    const toolDef = TOOL_REGISTRY[params.toolName];
    const log: ToolActionLog = {
      id: Math.random().toString(36).substring(2, 9),
      userId: params.userId,
      toolName: params.toolName,
      riskLevel: toolDef?.riskLevel || 'high',
      actionRequested: params.actionRequested,
      status: params.status,
      timestamp: new Date().toISOString(),
      resultSummary: params.resultSummary || 'Action completed successfully.',
    };

    this.actionLogs.unshift(log);
    if (this.actionLogs.length > 50) this.actionLogs.pop(); // Keep last 50 logs
    return log;
  }

  static getActionHistory(): ToolActionLog[] {
    return this.actionLogs;
  }
}
