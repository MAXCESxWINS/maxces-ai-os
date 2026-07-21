import { WorkspaceFile } from '@/types/workspace';

export interface AccessibilityIssue {
  elementOrPath: string;
  problem: string;
  whyItMatters: string;
  wcagRule: string;
  recommendedFix: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AccessibilityAuditReport {
  score: number; // 0 - 100
  wcagComplianceLevel: 'AA' | 'AAA' | 'Needs Improvement';
  issues: AccessibilityIssue[];
}

export class AccessibilityEngine {
  /**
   * Performs an automated WCAG 2.1 accessibility audit on workspace JSX components
   */
  static auditAccessibility(files: WorkspaceFile[]): AccessibilityAuditReport {
    const issues: AccessibilityIssue[] = [];

    files.forEach((file) => {
      const content = file.file_content;

      // Check 1: Missing aria-label on icon buttons
      if (content.includes('<button') && !content.includes('aria-label') && !content.includes('children')) {
        issues.push({
          elementOrPath: file.file_path,
          problem: 'IconButton missing descriptive aria-label attribute.',
          whyItMatters: 'Screen readers cannot announce icon-only buttons to visually impaired users.',
          wcagRule: 'WCAG 2.1 SC 4.1.2 (Name, Role, Value)',
          recommendedFix: 'Add aria-label="Descriptive action" to <button>.',
          severity: 'medium',
        });
      }

      // Check 2: Missing alt tags on images
      if (content.includes('<img') && !content.includes('alt=')) {
        issues.push({
          elementOrPath: file.file_path,
          problem: 'Image tag missing alt text attribute.',
          whyItMatters: 'Search engines and screen readers require descriptive image text.',
          wcagRule: 'WCAG 2.1 SC 1.1.1 (Non-text Content)',
          recommendedFix: 'Add alt="Descriptive title" to <img>.',
          severity: 'medium',
        });
      }
    });

    const score = Math.max(0, 100 - issues.length * 10);

    return {
      score,
      wcagComplianceLevel: score >= 90 ? 'AA' : 'Needs Improvement',
      issues,
    };
  }
}
