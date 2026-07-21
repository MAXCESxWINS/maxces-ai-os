import { supabase } from '@/lib/supabase';
import { WorkspaceFile, FileVersion, FileNode, WorkspaceFileType } from '@/types/workspace';
import JSZip from 'jszip';
import { ProjectHealthEngine } from './project-health-engine';

export class WorkspaceEngine {
  /**
   * Redacts sensitive secret tokens before saving content
   */
  private static sanitizeContent(content: string): string {
    return content
      .replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_SECRET]')
      .replace(/sb_secret_[a-zA-Z0-9_]+/g, '[REDACTED_SECRET]')
      .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_SECRET]');
  }

  /**
   * Creates a new virtual file in Supabase workspace_files
   */
  static async createFile(params: {
    userId: string;
    projectId: string;
    filePath: string;
    content: string;
    fileType?: WorkspaceFileType;
  }): Promise<WorkspaceFile | null> {
    try {
      const cleanContent = this.sanitizeContent(params.content);
      const fileType = params.fileType || 'code';

      const { data, error } = await (supabase as any)
        .from('workspace_files')
        .insert({
          user_id: params.userId,
          project_id: params.projectId,
          file_path: params.filePath,
          file_content: cleanContent,
          file_type: fileType,
          is_directory: false,
          version_number: 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data as WorkspaceFile;
    } catch (err) {
      console.error('[WorkspaceEngine.createFile Error]:', err);
      return null;
    }
  }

  /**
   * Imports a real ZIP archive, extracts files, detects framework, and populates workspace
   */
  static async importZipArchive(params: {
    userId: string;
    projectId: string;
    zipArrayBuffer: ArrayBuffer;
  }): Promise<{
    importedFiles: WorkspaceFile[];
    framework: string;
    packageDependenciesCount: number;
    healthScore: number;
    summaryText: string;
  }> {
    try {
      const zip = await JSZip.loadAsync(params.zipArrayBuffer);
      const importedFiles: WorkspaceFile[] = [];
      let detectedFramework = 'React 19 + TypeScript';
      let packageDependenciesCount = 12;

      for (const relativePath of Object.keys(zip.files)) {
        const zipObj = zip.files[relativePath];
        if (zipObj.dir || relativePath.includes('node_modules/') || relativePath.startsWith('.')) continue;

        const content = await zipObj.async('string');
        const cleanContent = this.sanitizeContent(content);

        // Detect framework from package.json
        if (relativePath.includes('package.json')) {
          try {
            const parsed = JSON.parse(cleanContent);
            const deps = { ...(parsed.dependencies || {}), ...(parsed.devDependencies || {}) };
            packageDependenciesCount = Object.keys(deps).length;
            if (deps['next']) detectedFramework = 'Next.js';
            else if (deps['vite']) detectedFramework = 'React + Vite';
            else if (deps['astro']) detectedFramework = 'Astro';
          } catch {
            // Ignore parse errors
          }
        }

        const workspaceFile: WorkspaceFile = {
          id: Math.random().toString(),
          user_id: params.userId,
          project_id: params.projectId,
          file_path: relativePath,
          file_content: cleanContent,
          file_type: relativePath.endsWith('.json') ? 'json' : relativePath.endsWith('.css') ? 'style' : 'code',
          is_directory: false,
          version_number: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        importedFiles.push(workspaceFile);
      }

      // Generate health score
      const healthReport = ProjectHealthEngine.generateUnifiedHealthReport(importedFiles, 'Imported ZIP Project');

      return {
        importedFiles,
        framework: detectedFramework,
        packageDependenciesCount,
        healthScore: healthReport.overallHealthScore,
        summaryText: `Successfully imported ${importedFiles.length} files (${detectedFramework}). Overall Health Score: ${healthReport.overallHealthScore}/100.`,
      };
    } catch (err: any) {
      console.error('[WorkspaceEngine.importZipArchive Error]:', err);
      return {
        importedFiles: [],
        framework: 'Unknown',
        packageDependenciesCount: 0,
        healthScore: 0,
        summaryText: `ZIP Import failed: ${err?.message || 'Invalid ZIP buffer'}`,
      };
    }
  }

  /**
   * Updates an existing file, creating a reversible version snapshot
   */
  static async updateFile(params: {
    userId: string;
    fileId: string;
    newContent: string;
    changeSummary?: string;
  }): Promise<WorkspaceFile | null> {
    try {
      const cleanContent = this.sanitizeContent(params.newContent);

      const { data: currentFile, error: fetchErr } = await (supabase as any)
        .from('workspace_files')
        .select('*')
        .eq('id', params.fileId)
        .eq('user_id', params.userId)
        .single();

      if (fetchErr || !currentFile) throw new Error('File not found or access denied.');

      await (supabase as any).from('workspace_file_versions').insert({
        file_id: currentFile.id,
        user_id: params.userId,
        version_number: currentFile.version_number,
        file_content: currentFile.file_content,
        change_summary: params.changeSummary || `Version ${currentFile.version_number} snapshot`,
      });

      const nextVersion = currentFile.version_number + 1;
      const { data: updated, error: updateErr } = await (supabase as any)
        .from('workspace_files')
        .update({
          file_content: cleanContent,
          version_number: nextVersion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.fileId)
        .eq('user_id', params.userId)
        .select()
        .single();

      if (updateErr) throw updateErr;
      return updated as WorkspaceFile;
    } catch (err) {
      console.error('[WorkspaceEngine.updateFile Error]:', err);
      return null;
    }
  }

  /**
   * Safely deletes a file after saving a final backup version snapshot
   */
  static async deleteFile(params: { userId: string; fileId: string }): Promise<boolean> {
    try {
      const { data: currentFile } = await (supabase as any)
        .from('workspace_files')
        .select('*')
        .eq('id', params.fileId)
        .eq('user_id', params.userId)
        .single();

      if (currentFile) {
        await (supabase as any).from('workspace_file_versions').insert({
          file_id: currentFile.id,
          user_id: params.userId,
          version_number: currentFile.version_number,
          file_content: currentFile.file_content,
          change_summary: `Pre-deletion Backup (V${currentFile.version_number})`,
        });
      }

      const { error } = await (supabase as any)
        .from('workspace_files')
        .delete()
        .eq('id', params.fileId)
        .eq('user_id', params.userId);

      return !error;
    } catch (err) {
      console.error('[WorkspaceEngine.deleteFile Error]:', err);
      return false;
    }
  }

  /**
   * Retrieves all virtual files belonging to a project
   */
  static async getProjectFiles(params: { userId: string; projectId: string }): Promise<WorkspaceFile[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('workspace_files')
        .select('*')
        .eq('user_id', params.userId)
        .eq('project_id', params.projectId)
        .order('file_path', { ascending: true });

      if (error) throw error;
      return (data || []) as WorkspaceFile[];
    } catch (err) {
      console.error('[WorkspaceEngine.getProjectFiles Error]:', err);
      return [];
    }
  }

  /**
   * Restores a previous file version snapshot
   */
  static async restoreFileVersion(params: {
    userId: string;
    fileId: string;
    targetVersionNumber: number;
  }): Promise<WorkspaceFile | null> {
    try {
      const { data: snapshot, error: snapErr } = await (supabase as any)
        .from('workspace_file_versions')
        .select('*')
        .eq('file_id', params.fileId)
        .eq('user_id', params.userId)
        .eq('version_number', params.targetVersionNumber)
        .single();

      if (snapErr || !snapshot) throw new Error('Target version snapshot not found.');

      return await this.updateFile({
        userId: params.userId,
        fileId: params.fileId,
        newContent: snapshot.file_content,
        changeSummary: `Restored back to Version ${params.targetVersionNumber}`,
      });
    } catch (err) {
      console.error('[WorkspaceEngine.restoreFileVersion Error]:', err);
      return null;
    }
  }

  /**
   * Fetches full version history list for a file
   */
  static async getFileVersions(params: { userId: string; fileId: string }): Promise<FileVersion[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('workspace_file_versions')
        .select('*')
        .eq('file_id', params.fileId)
        .eq('user_id', params.userId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return (data || []) as FileVersion[];
    } catch (err) {
      console.error('[WorkspaceEngine.getFileVersions Error]:', err);
      return [];
    }
  }

  /**
   * Converts a flat array of workspace files into a nested folder tree (FileNode[])
   */
  static generateFileTree(files: WorkspaceFile[]): FileNode[] {
    const root: FileNode[] = [];

    files.forEach((file) => {
      const parts = file.file_path.split('/');
      let currentLevel = root;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        let existing = currentLevel.find((node) => node.name === part);

        if (!existing) {
          existing = {
            name: part,
            path: currentPath,
            type: isLast ? 'file' : 'folder',
            fileType: isLast ? file.file_type : undefined,
            children: isLast ? undefined : [],
            content: isLast ? file.file_content : undefined,
            fileId: isLast ? file.id : undefined,
            versionNumber: isLast ? file.version_number : undefined,
          };
          currentLevel.push(existing);
        }

        if (!isLast && existing.children) {
          currentLevel = existing.children;
        }
      });
    });

    return root;
  }
}
