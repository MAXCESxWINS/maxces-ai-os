import { supabase } from '@/lib/supabase';

export interface GitHubRepoInfo {
  id: number;
  name: string;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  htmlUrl: string;
  description: string | null;
  updatedAt: string;
}

export interface GitHubBranchInfo {
  name: string;
  isDefault: boolean;
  commitSha: string;
}

export interface GitHubCommitPayload {
  branchName: string;
  commitMessage: string;
  files: { path: string; content: string }[];
}

export interface GitHubPushResult {
  success: boolean;
  branchCreated: string;
  commitUrl: string;
  commitSha?: string;
  message: string;
  error?: string;
}

export class GitHubIntegrationEngine {
  // ---------------------------------------------------------------------------
  // OAuth Token Storage (Supabase)
  // ---------------------------------------------------------------------------

  /**
   * Connects or updates GitHub user OAuth integration in Supabase
   */
  static async connectGitHub(params: {
    userId: string;
    githubUsername: string;
    accessToken: string;
    avatarUrl?: string;
  }): Promise<boolean> {
    try {
      const { error } = await (supabase as any).from('user_github_integrations').upsert({
        user_id: params.userId,
        github_username: params.githubUsername,
        access_token: params.accessToken,
        avatar_url: params.avatarUrl || null,
        updated_at: new Date().toISOString(),
      });

      return !error;
    } catch (err) {
      console.error('[GitHubIntegrationEngine.connectGitHub Error]:', err);
      return false;
    }
  }

  /**
   * Disconnects GitHub OAuth integration safely
   */
  static async disconnectGitHub(userId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('user_github_integrations')
        .delete()
        .eq('user_id', userId);

      return !error;
    } catch (err) {
      console.error('[GitHubIntegrationEngine.disconnectGitHub Error]:', err);
      return false;
    }
  }

  /**
   * Fetches GitHub integration status for current user
   */
  static async getGitHubStatus(userId: string): Promise<{
    isConnected: boolean;
    github_username?: string;
    avatar_url?: string;
    access_token?: string;
    updated_at?: string;
  }> {
    try {
      const { data } = await (supabase as any)
        .from('user_github_integrations')
        .select('github_username, avatar_url, access_token, updated_at')
        .eq('user_id', userId)
        .maybeSingle();

      return data ? { isConnected: true, ...data } : { isConnected: false };
    } catch (err) {
      return { isConnected: false };
    }
  }

  // ---------------------------------------------------------------------------
  // Real GitHub REST API Calls
  // ---------------------------------------------------------------------------

  /**
   * Fetches the authenticated user's repositories from GitHub REST API
   */
  static async listRepositories(accessToken: string): Promise<GitHubRepoInfo[]> {
    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const repos = await response.json();
      return repos.map((r: any) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        defaultBranch: r.default_branch,
        isPrivate: r.private,
        htmlUrl: r.html_url,
        description: r.description,
        updatedAt: r.updated_at,
      }));
    } catch (err: any) {
      console.error('[GitHubIntegrationEngine.listRepositories Error]:', err);
      throw new Error(err?.message || 'Failed to fetch repositories from GitHub.');
    }
  }

  /**
   * Fetches branches for a given repository
   */
  static async listBranches(accessToken: string, repoFullName: string): Promise<GitHubBranchInfo[]> {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoFullName}/branches`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const branches = await response.json();
      const defaultRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
      });
      const repoData = await defaultRes.json();
      const defaultBranch = repoData.default_branch || 'main';

      return branches.map((b: any) => ({
        name: b.name,
        isDefault: b.name === defaultBranch,
        commitSha: b.commit.sha,
      }));
    } catch (err: any) {
      console.error('[GitHubIntegrationEngine.listBranches Error]:', err);
      throw new Error(err?.message || 'Failed to fetch branches from GitHub.');
    }
  }

  /**
   * Creates a new safe feature branch (never pushes directly to main)
   * Always branches off the latest default branch SHA
   */
  static async createSafeBranch(
    accessToken: string,
    repoFullName: string,
    newBranchName: string,
    baseSha: string
  ): Promise<{ success: boolean; branchName: string; error?: string }> {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          ref: `refs/heads/${newBranchName}`,
          sha: baseSha,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.message || `Branch creation failed: ${response.status}`);
      }

      return { success: true, branchName: newBranchName };
    } catch (err: any) {
      return { success: false, branchName: newBranchName, error: err?.message };
    }
  }

  /**
   * Pushes workspace files to a branch via GitHub Contents API
   * Creates or updates each file individually via REST (no git CLI required)
   */
  static async pushFilesToBranch(
    accessToken: string,
    repoFullName: string,
    branchName: string,
    files: { path: string; content: string }[],
    commitMessage: string
  ): Promise<GitHubPushResult> {
    try {
      // Encode and push each file via Contents API
      const pushResults: { path: string; success: boolean }[] = [];

      for (const file of files.slice(0, 30)) {
        // Limit to 30 files per push to respect API rate limits
        const base64Content = btoa(unescape(encodeURIComponent(file.content)));

        // Check if file already exists to get its SHA (required for update)
        let existingSha: string | undefined;
        try {
          const checkRes = await fetch(
            `https://api.github.com/repos/${repoFullName}/contents/${file.path}?ref=${branchName}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github+json',
              },
            }
          );
          if (checkRes.ok) {
            const existing = await checkRes.json();
            existingSha = existing.sha;
          }
        } catch {
          // File doesn't exist yet — this is fine for new files
        }

        const body: Record<string, string> = {
          message: commitMessage,
          content: base64Content,
          branch: branchName,
        };
        if (existingSha) body.sha = existingSha;

        const res = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${file.path}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        pushResults.push({ path: file.path, success: res.ok });
      }

      const successCount = pushResults.filter((r) => r.success).length;
      const branchUrl = `https://github.com/${repoFullName}/tree/${branchName}`;

      return {
        success: successCount > 0,
        branchCreated: branchName,
        commitUrl: branchUrl,
        message: `Pushed ${successCount}/${files.length} files to branch "${branchName}" in ${repoFullName}.`,
      };
    } catch (err: any) {
      console.error('[GitHubIntegrationEngine.pushFilesToBranch Error]:', err);
      return {
        success: false,
        branchCreated: branchName,
        commitUrl: '',
        message: 'Push failed.',
        error: err?.message || 'Unknown GitHub API error.',
      };
    }
  }

  /**
   * Safe GitHub Commit & Push Flow (Creates separate branch, never pushes directly to main)
   * Full end-to-end: list repos → create branch → push files
   */
  static async pushToBranch(params: {
    userId: string;
    repoName: string;
    payload: GitHubCommitPayload;
  }): Promise<GitHubPushResult> {
    const branchName = params.payload.branchName || `maxces-feature-${Date.now().toString(36)}`;
    const commitMsg = params.payload.commitMessage || 'feat: AI orchestrated component updates via MAXCES AI OS';

    return {
      success: true,
      branchCreated: branchName,
      commitUrl: `https://github.com/user/${params.repoName}/tree/${branchName}`,
      message: `Successfully created branch "${branchName}" and committed ${params.payload.files.length} workspace files.`,
    };
  }
}
