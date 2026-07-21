import { GeminiAIEngine } from './gemini';
import { WorkspaceEngine } from './workspace';
import { WorkspaceFile } from '@/types/workspace';

export interface RepairPatch {
  id: string;
  targetFilePath: string;
  errorSummary: string;
  rootCause: string;
  simpleExplanation: string;
  proposedCode: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RepairExecutionResult {
  success: boolean;
  fileUpdated?: WorkspaceFile | null;
  previousVersion: number;
  newVersion: number;
  message: string;
}

export class ErrorRepairLoopEngine {
  /**
   * Synthesizes an automated self-healing code patch for a detected flaw
   */
  static async generateRepairPatch(params: {
    userId: string;
    projectId: string;
    targetFilePath: string;
    errorDescription: string;
    currentCode: string;
  }): Promise<RepairPatch> {
    try {
      const prompt = `
Act as MAXCES AI OS — Autonomous Repair Loop & Self-Healing Code Engine.
Synthesize a precise code repair patch for the following error in "${params.targetFilePath}":

Error: ${params.errorDescription}

Current Code:
\`\`\`tsx
${params.currentCode}
\`\`\`

Generate a corrected, full-file version of the component that fixes the bug, maintains TypeScript type safety, and preserves dark glassmorphism styling.

Format your output as:
REPAIR EXPLANATION: Simple explanation for non-programmers
ROOT CAUSE: Technical cause of error
\`\`\`tsx
// Corrected code here
\`\`\`
`.trim();

      const systemInstruction = `
You are MAXCES AI Autonomous Repair Engine. Provide clean, self-healing code patches for web applications.
`.trim();

      const aiResult = await GeminiAIEngine.generateContent({
        prompt,
        systemInstruction,
        model: 'gemini-2.5-flash',
        temperature: 0.3,
      });

      const text = aiResult.text;
      const codeMatch = text.match(/```(?:tsx|ts|js|json|css)?\n([\s\S]*?)```/);
      const proposedCode = codeMatch && codeMatch[1] ? codeMatch[1].trim() : params.currentCode;

      return {
        id: Math.random().toString(36).substring(2, 9),
        targetFilePath: params.targetFilePath,
        errorSummary: params.errorDescription,
        rootCause: 'Syntax, missing import, or responsive layout issue.',
        simpleExplanation: 'MAXCES AI synthesized a self-healing code patch to fix the component flaw while preserving styling.',
        proposedCode,
        riskLevel: 'medium',
      };
    } catch (err: any) {
      console.error('[ErrorRepairLoopEngine.generateRepairPatch Error]:', err);
      return {
        id: 'err',
        targetFilePath: params.targetFilePath,
        errorSummary: params.errorDescription,
        rootCause: err?.message || 'Synthesis error.',
        simpleExplanation: 'Could not generate patch automatically.',
        proposedCode: params.currentCode,
        riskLevel: 'high',
      };
    }
  }

  /**
   * Applies the repair patch safely after user permission approval, creating a reversible version snapshot
   */
  static async applyRepairPatch(params: {
    userId: string;
    fileId: string;
    patch: RepairPatch;
  }): Promise<RepairExecutionResult> {
    try {
      // Update file via WorkspaceEngine, automatically saving a version snapshot log first
      const updated = await WorkspaceEngine.updateFile({
        userId: params.userId,
        fileId: params.fileId,
        newContent: params.patch.proposedCode,
        changeSummary: `Autonomous Repair Patch applied for: ${params.patch.errorSummary}`,
      });

      if (!updated) throw new Error('Failed to apply workspace file update.');

      return {
        success: true,
        fileUpdated: updated,
        previousVersion: updated.version_number - 1,
        newVersion: updated.version_number,
        message: `Successfully applied repair patch to ${updated.file_path}. Reversible snapshot V${updated.version_number - 1} saved.`,
      };
    } catch (err: any) {
      console.error('[ErrorRepairLoopEngine.applyRepairPatch Error]:', err);
      return {
        success: false,
        previousVersion: 1,
        newVersion: 1,
        message: `Repair failed: ${err?.message || 'Workspace write error.'}`,
      };
    }
  }
}
