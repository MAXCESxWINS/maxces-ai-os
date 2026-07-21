import { WorkspaceFile } from '@/types/workspace';
import { ProjectStructureValidator, StructureAuditReport } from './project-validator';
import { DependencyInspector, DependencyAuditReport } from './dependency-inspector';
import { AccessibilityEngine, AccessibilityAuditReport } from './accessibility-engine';
import { SeoEngine, SeoAuditReport } from './seo-engine';
import { ProjectQualityJudge, ProjectJudgeReport } from './quality-judge';

export interface UnifiedHealthReport {
  overallHealthScore: number; // 0 - 100
  structureAudit: StructureAuditReport;
  dependencyAudit: DependencyAuditReport;
  accessibilityAudit: AccessibilityAuditReport;
  seoAudit: SeoAuditReport;
  judgeReport: ProjectJudgeReport;
  summaryStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION';
  unifiedRecommendations: string[];
}

export class ProjectHealthEngine {
  /**
   * Consolidates all testing, accessibility, SEO, dependency, and build diagnostics into ONE unified report
   */
  static generateUnifiedHealthReport(files: WorkspaceFile[], projectName = 'MAXCES Application'): UnifiedHealthReport {
    const structureAudit = ProjectStructureValidator.validateStructure(files);
    const dependencyAudit = DependencyInspector.inspectDependencies(files);
    const accessibilityAudit = AccessibilityEngine.auditAccessibility(files);
    const seoAudit = SeoEngine.auditSeo(files, projectName);
    const judgeReport = ProjectQualityJudge.evaluateProjectQuality(files, projectName);

    const overallHealthScore = Math.round(
      (structureAudit.score + dependencyAudit.score + accessibilityAudit.score + seoAudit.score + judgeReport.scores.overallScore) / 5
    );

    const unifiedRecommendations: string[] = [
      ...structureAudit.issues.map((i) => i.recommendedFix),
      ...accessibilityAudit.issues.map((i) => i.recommendedFix),
      ...seoAudit.checks.filter((c) => c.status !== 'passed').map((c) => c.recommendation),
    ];

    return {
      overallHealthScore,
      structureAudit,
      dependencyAudit,
      accessibilityAudit,
      seoAudit,
      judgeReport,
      summaryStatus: overallHealthScore >= 90 ? 'EXCELLENT' : overallHealthScore >= 75 ? 'GOOD' : 'NEEDS_ATTENTION',
      unifiedRecommendations: unifiedRecommendations.slice(0, 5),
    };
  }
}
