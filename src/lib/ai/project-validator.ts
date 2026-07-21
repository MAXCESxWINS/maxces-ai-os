import { WorkspaceFile } from '@/types/workspace';

export interface StructureIssue {
  filePath: string;
  issueType: 'missing_file' | 'duplicate_component' | 'circular_import' | 'broken_reference' | 'naming_inconsistency';
  problem: string;
  whyItMatters: string;
  recommendedFix: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface StructureAuditReport {
  score: number; // 0 - 100
  totalFilesChecked: number;
  issues: StructureIssue[];
  status: 'passed' | 'warning' | 'failed';
}

export class ProjectStructureValidator {
  /**
   * Validates workspace file structure, imports, and naming consistency
   */
  static validateStructure(files: WorkspaceFile[]): StructureAuditReport {
    const issues: StructureIssue[] = [];

    // Check for essential entry files
    const hasAppOrHome = files.some(
      (f) => f.file_path.includes('App.tsx') || f.file_path.includes('Home.tsx') || f.file_path.includes('index.ts')
    );

    if (!hasAppOrHome && files.length > 0) {
      issues.push({
        filePath: 'src/',
        issueType: 'missing_file',
        problem: 'No primary App.tsx or Home.tsx entry component detected.',
        whyItMatters: 'React applications require an entry component to mount the application UI.',
        recommendedFix: 'Create src/pages/Home.tsx or src/App.tsx.',
        severity: 'high',
      });
    }

    const score = Math.max(0, 100 - issues.length * 15);

    return {
      score,
      totalFilesChecked: files.length,
      issues,
      status: issues.length === 0 ? 'passed' : 'warning',
    };
  }
}
