/**
 * Virtual Workspace & File Intelligence Types for MAXCES AI OS (Phase 4)
 */

export type WorkspaceFileType = 'code' | 'style' | 'json' | 'markdown' | 'asset';
export type BuildStatus = 'clean' | 'error' | 'building' | 'untested';

export interface WorkspaceFile {
  id: string;
  user_id: string;
  project_id: string;
  file_path: string; // e.g. "src/components/Navbar.tsx"
  file_content: string;
  file_type: WorkspaceFileType;
  is_directory: boolean;
  version_number: number;
  created_at: string;
  updated_at: string;
}

export interface FileVersion {
  id: string;
  file_id: string;
  user_id: string;
  version_number: number;
  file_content: string;
  change_summary: string;
  created_at: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  fileType?: WorkspaceFileType;
  children?: FileNode[];
  content?: string;
  fileId?: string;
  versionNumber?: number;
}

export interface ProjectWorkspace {
  projectId: string;
  projectName: string;
  currentPhase: string;
  buildStatus: BuildStatus;
  lastAiAction?: string;
  files: WorkspaceFile[];
  fileTree: FileNode[];
  activeFile?: WorkspaceFile | null;
  errorLog?: string | null;
}

export interface CodeChangePlan {
  projectId: string;
  targetFile: string;
  changeSummary: string;
  proposedContent: string;
  riskAssessment: 'low' | 'medium' | 'high';
  explanation: {
    whatWeAreDoing: string;
    whyWeAreDoingIt: string;
    howItWorks: string;
    whatCanGoWrong: string;
    recommendedSolution: string;
  };
}
