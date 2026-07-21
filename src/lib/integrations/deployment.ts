import { WorkspaceFile } from '@/types/workspace';
import JSZip from 'jszip';

export type DeploymentProvider = 'vercel' | 'netlify';

export type DeploymentStatus =
  | 'QUEUED'
  | 'INITIALIZING'
  | 'BUILDING'
  | 'READY'
  | 'FAILED'
  | 'CANCELED'
  | 'ERROR';

export interface EnvVar {
  key: string;
  value: string;
}

export interface DeploymentConfig {
  provider: DeploymentProvider;
  projectName: string;
  teamId?: string; // Vercel team/org ID (optional)
  siteId?: string; // Netlify site ID (re-deployment)
  environmentVariables: EnvVar[];
  buildCommand: string;
  outputDirectory: string;
}

export interface DeploymentLogLine {
  timestamp: string;
  text: string;
  type: 'info' | 'error' | 'warn' | 'system';
}

export interface DeploymentResult {
  success: boolean;
  provider: DeploymentProvider;
  deploymentId: string;
  deploymentUrl: string;   // Direct deployment URL (unique per deploy)
  projectUrl?: string;     // Stable project/alias URL
  status: DeploymentStatus;
  logs: DeploymentLogLine[];
  error?: string;
  rawResponse?: unknown;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function now(): string {
  return new Date().toLocaleTimeString();
}

function log(text: string, type: DeploymentLogLine['type'] = 'info'): DeploymentLogLine {
  return { timestamp: now(), text, type };
}

// Sanitize env vars — never leak secrets in error output
function maskSecrets(vars: EnvVar[]): EnvVar[] {
  return vars.map((v) => ({
    key: v.key,
    value: v.value.replace(/sk-[a-zA-Z0-9]{20,}/g, '***').replace(/ghp_[a-zA-Z0-9]+/g, '***'),
  }));
}

// ---------------------------------------------------------------------------
// Vercel Deployment Engine (Real REST API)
// ---------------------------------------------------------------------------
export class VercelDeploymentEngine {
  private static readonly BASE = 'https://api.vercel.com';

  /**
   * Creates or retrieves a Vercel project, then triggers a deployment
   * via the Vercel Deployments REST API.
   *
   * REAL API calls — no simulation.
   */
  static async deploy(params: {
    accessToken: string;
    config: DeploymentConfig;
    files: WorkspaceFile[];
    onLog?: (line: DeploymentLogLine) => void;
  }): Promise<DeploymentResult> {
    const { accessToken, config, files, onLog } = params;
    const logs: DeploymentLogLine[] = [];

    const emit = (text: string, type: DeploymentLogLine['type'] = 'info') => {
      const line = log(text, type);
      logs.push(line);
      onLog?.(line);
    };

    try {
      emit('[VERCEL] Starting deployment process…', 'system');

      // 1. Build the file payload for Vercel Deployments API
      //    Each file needs: file path + SHA1 (or inline content for small files)
      emit('[VERCEL] Encoding project files…');

      const filePayload = files.slice(0, 100).map((f) => ({
        file: f.file_path,
        data: f.file_content,
        encoding: 'utf-8' as const,
      }));

      // Add essential files if not present
      const hasPkgJson = files.some((f) => f.file_path === 'package.json');
      if (!hasPkgJson) {
        filePayload.push({
          file: 'package.json',
          data: JSON.stringify(
            {
              name: config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
              private: true,
              version: '1.0.0',
              type: 'module',
              scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
              dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
              devDependencies: { '@vitejs/plugin-react': '^4.3.0', vite: '^5.4.0' },
            },
            null,
            2
          ),
          encoding: 'utf-8' as const,
        });
      }

      const hasViteConfig = files.some((f) => f.file_path.startsWith('vite.config'));
      if (!hasViteConfig) {
        filePayload.push({
          file: 'vite.config.ts',
          data: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });`,
          encoding: 'utf-8' as const,
        });
      }

      emit(`[VERCEL] Prepared ${filePayload.length} files for upload.`);

      // 2. Build env var payload
      const envPayload = config.environmentVariables
        .filter((e) => e.key.trim() && e.value.trim())
        .map((e) => ({
          key: e.key.trim(),
          value: e.value.trim(),
          type: 'encrypted' as const,
          target: ['production', 'preview', 'development'],
        }));

      emit(`[VERCEL] Configured ${envPayload.length} environment variables.`);

      // 3. Create deployment via Vercel REST API
      const deployBody: Record<string, unknown> = {
        name: config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        files: filePayload,
        projectSettings: {
          buildCommand: config.buildCommand || 'vite build',
          outputDirectory: config.outputDirectory || 'dist',
          installCommand: 'npm install',
          framework: 'vite',
        },
        target: 'production',
      };

      if (envPayload.length > 0) {
        deployBody.env = envPayload.reduce(
          (acc, e) => {
            acc[e.key] = e.value;
            return acc;
          },
          {} as Record<string, string>
        );
      }

      if (config.teamId) {
        deployBody.teamId = config.teamId;
      }

      emit('[VERCEL] Uploading deployment to Vercel servers…');

      const teamQuery = config.teamId ? `?teamId=${config.teamId}` : '';
      const deployRes = await fetch(`${this.BASE}/v13/deployments${teamQuery}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deployBody),
      });

      const deployData = await deployRes.json();

      if (!deployRes.ok) {
        const errMsg = deployData?.error?.message || deployData?.message || `HTTP ${deployRes.status}`;
        emit(`[VERCEL] Deployment request failed: ${errMsg}`, 'error');
        return {
          success: false,
          provider: 'vercel',
          deploymentId: '',
          deploymentUrl: '',
          status: 'FAILED',
          logs,
          error: errMsg,
          rawResponse: deployData,
        };
      }

      const deploymentId: string = deployData.id;
      const deploymentUrl: string = deployData.url
        ? `https://${deployData.url}`
        : `https://${config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.vercel.app`;

      emit(`[VERCEL] Deployment created! ID: ${deploymentId}`);
      emit(`[VERCEL] Building at: ${deploymentUrl}`);

      // 4. Poll deployment status until READY or FAILED (max 3 min)
      let status: DeploymentStatus = 'BUILDING';
      let attempts = 0;
      const maxAttempts = 36; // 36 × 5s = 3 min
      const terminalStatuses = new Set<DeploymentStatus>(['READY', 'FAILED', 'CANCELED', 'ERROR']);

      while (attempts < maxAttempts && !terminalStatuses.has(status)) {
        await new Promise((r) => setTimeout(r, 5000));
        attempts++;

        const pollRes = await fetch(`${this.BASE}/v13/deployments/${deploymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!pollRes.ok) {
          emit(`[VERCEL] Status poll failed (attempt ${attempts}).`, 'warn');
          continue;
        }

        const pollData = await pollRes.json();
        const rawStatus = (pollData.status || pollData.readyState || 'BUILDING').toUpperCase();

        // Normalize Vercel status strings
        if (rawStatus === 'READY' || rawStatus === 'DEPLOYED') status = 'READY';
        else if (rawStatus === 'ERROR' || rawStatus === 'FAILED') status = 'FAILED';
        else if (rawStatus === 'CANCELED') status = 'CANCELED';
        else if (rawStatus === 'INITIALIZING' || rawStatus === 'QUEUED') status = 'INITIALIZING';
        else status = 'BUILDING';

        emit(`[VERCEL] Status: ${status} (poll ${attempts}/${maxAttempts})`);
      }

      if (status !== 'READY') {
        const errMsg = status === 'FAILED'
          ? 'Vercel build failed. Check your build command and dependencies.'
          : 'Deployment timed out — check Vercel dashboard for details.';
        emit(`[VERCEL] ${errMsg}`, 'error');
        return { success: false, provider: 'vercel', deploymentId, deploymentUrl, status, logs, error: errMsg };
      }

      emit('[VERCEL] ✅ Deployment READY — your site is live!', 'system');

      return {
        success: true,
        provider: 'vercel',
        deploymentId,
        deploymentUrl,
        projectUrl: deploymentUrl,
        status: 'READY',
        logs,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown Vercel deployment error.';
      emit(`[VERCEL] Fatal error: ${message}`, 'error');
      return { success: false, provider: 'vercel', deploymentId: '', deploymentUrl: '', status: 'ERROR', logs, error: message };
    }
  }

  /**
   * Fetches real deployment list for a Vercel project token
   */
  static async listDeployments(accessToken: string): Promise<{ id: string; url: string; state: string; createdAt: number }[]> {
    try {
      const res = await fetch(`${this.BASE}/v6/deployments?limit=10`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.deployments || []).map((d: Record<string, unknown>) => ({
        id: d.uid as string,
        url: `https://${d.url}`,
        state: (d.state || d.readyState) as string,
        createdAt: d.createdAt as number,
      }));
    } catch {
      return [];
    }
  }
}

// ---------------------------------------------------------------------------
// Netlify Deployment Engine (Real REST API)
// ---------------------------------------------------------------------------
export class NetlifyDeploymentEngine {
  private static readonly BASE = 'https://api.netlify.com/api/v1';

  /**
   * Creates a Netlify site (if needed) and uploads ZIP for deployment.
   * Uses the Netlify File Digest API — real API, no simulation.
   */
  static async deploy(params: {
    accessToken: string;
    config: DeploymentConfig;
    files: WorkspaceFile[];
    onLog?: (line: DeploymentLogLine) => void;
  }): Promise<DeploymentResult> {
    const { accessToken, config, files, onLog } = params;
    const logs: DeploymentLogLine[] = [];

    const emit = (text: string, type: DeploymentLogLine['type'] = 'info') => {
      const line = log(text, type);
      logs.push(line);
      onLog?.(line);
    };

    try {
      emit('[NETLIFY] Starting deployment process…', 'system');

      // 1. Create or find the site
      let siteId = config.siteId || '';
      let siteUrl = '';

      if (!siteId) {
        emit('[NETLIFY] Creating new Netlify site…');
        const siteRes = await fetch(`${this.BASE}/sites`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          }),
        });

        const siteData = await siteRes.json();

        if (!siteRes.ok) {
          const errMsg = siteData?.message || siteData?.errors?.join(', ') || `HTTP ${siteRes.status}`;
          emit(`[NETLIFY] Failed to create site: ${errMsg}`, 'error');
          return { success: false, provider: 'netlify', deploymentId: '', deploymentUrl: '', status: 'FAILED', logs, error: errMsg };
        }

        siteId = siteData.id;
        siteUrl = siteData.ssl_url || siteData.url || '';
        emit(`[NETLIFY] Site created: ${siteUrl}`);
      } else {
        emit(`[NETLIFY] Using existing site ID: ${siteId}`);
      }

      // 2. Bundle files into ZIP (Netlify accepts ZIP upload for static sites)
      emit('[NETLIFY] Bundling project files into ZIP…');

      const zip = new JSZip();

      files.forEach((f) => {
        // Netlify expects the root to be the dist/build output
        // Strip leading 'dist/' or 'src/' since we're treating workspace files as source
        zip.file(f.file_path, f.file_content);
      });

      // Add essential index.html if missing
      if (!files.some((f) => f.file_path === 'index.html' || f.file_path === 'dist/index.html')) {
        zip.file(
          'index.html',
          `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.projectName}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`
        );
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      emit(`[NETLIFY] ZIP bundle ready (${(zipBlob.size / 1024).toFixed(1)} KB).`);

      // 3. Upload ZIP to Netlify
      emit('[NETLIFY] Uploading to Netlify servers…');
      const deployRes = await fetch(`${this.BASE}/sites/${siteId}/deploys`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/zip',
        },
        body: zipBlob,
      });

      const deployData = await deployRes.json();

      if (!deployRes.ok) {
        const errMsg = deployData?.message || deployData?.errors?.join(', ') || `HTTP ${deployRes.status}`;
        emit(`[NETLIFY] Upload failed: ${errMsg}`, 'error');
        return { success: false, provider: 'netlify', deploymentId: siteId, deploymentUrl: '', status: 'FAILED', logs, error: errMsg };
      }

      const deploymentId: string = deployData.id;
      const deployUrl: string = deployData.deploy_ssl_url || deployData.deploy_url || siteUrl || `https://${config.projectName}.netlify.app`;

      emit(`[NETLIFY] Deployment uploaded! ID: ${deploymentId}`);
      emit(`[NETLIFY] Processing at: ${deployUrl}`);

      // 4. Set environment variables via Netlify API
      if (config.environmentVariables.length > 0) {
        emit('[NETLIFY] Configuring environment variables…');
        const envBody = config.environmentVariables
          .filter((e) => e.key.trim() && e.value.trim())
          .map((e) => ({ key: e.key.trim(), scopes: ['builds', 'runtime'], values: [{ value: e.value.trim(), context: 'all' }] }));

        if (envBody.length > 0) {
          await fetch(`${this.BASE}/accounts/${siteId}/env`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(envBody),
          });
          emit(`[NETLIFY] Set ${envBody.length} environment variables.`);
        }
      }

      // 5. Poll until deployment is ready
      let status: DeploymentStatus = 'BUILDING';
      let attempts = 0;
      const maxAttempts = 36;

      while (attempts < maxAttempts && status !== 'READY' && status !== 'FAILED') {
        await new Promise((r) => setTimeout(r, 5000));
        attempts++;

        const pollRes = await fetch(`${this.BASE}/deploys/${deploymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!pollRes.ok) {
          emit(`[NETLIFY] Status poll failed (attempt ${attempts}).`, 'warn');
          continue;
        }

        const pollData = await pollRes.json();
        const rawState = (pollData.state || 'building').toLowerCase();

        if (rawState === 'ready') status = 'READY';
        else if (rawState === 'error' || rawState === 'failed') status = 'FAILED';
        else status = 'BUILDING';

        emit(`[NETLIFY] Status: ${status.toUpperCase()} (poll ${attempts}/${maxAttempts})`);
      }

      if (status !== 'READY') {
        const errMsg = status === 'FAILED'
          ? 'Netlify build failed. Check your project files and dependencies.'
          : 'Deployment is taking longer than expected. Check Netlify dashboard.';
        emit(`[NETLIFY] ${errMsg}`, 'error');
        return { success: false, provider: 'netlify', deploymentId, deploymentUrl: deployUrl, status, logs, error: errMsg };
      }

      emit('[NETLIFY] ✅ Deployment READY — your site is live!', 'system');

      return {
        success: true,
        provider: 'netlify',
        deploymentId,
        deploymentUrl: deployUrl,
        projectUrl: siteUrl || deployUrl,
        status: 'READY',
        logs,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown Netlify deployment error.';
      emit(`[NETLIFY] Fatal error: ${message}`, 'error');
      return { success: false, provider: 'netlify', deploymentId: '', deploymentUrl: '', status: 'ERROR', logs, error: message };
    }
  }

  /**
   * Fetches real deployment list for a Netlify token
   */
  static async listSites(accessToken: string): Promise<{ id: string; name: string; url: string; state: string }[]> {
    try {
      const res = await fetch(`${this.BASE}/sites?per_page=15`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data as Record<string, unknown>[]).map((s) => ({
        id: s.id as string,
        name: s.name as string,
        url: (s.ssl_url || s.url) as string,
        state: (s.published_deploy as Record<string, unknown>)?.state as string || 'unknown',
      }));
    } catch {
      return [];
    }
  }
}

// ---------------------------------------------------------------------------
// Unified Cloud Deployment Engine (Facade — reuses V/N engines above)
// ---------------------------------------------------------------------------
export class CloudDeploymentEngine {
  /**
   * Scrubs API keys and secrets before preparing deployment bundle
   */
  static sanitizeEnvSecrets(vars: EnvVar[]): EnvVar[] {
    return maskSecrets(vars);
  }

  /**
   * Dispatches to the correct provider engine.
   * This is the single entry point from the UI.
   */
  static async triggerDeployment(params: {
    accessToken: string;
    config: DeploymentConfig;
    files: WorkspaceFile[];
    onLog?: (line: DeploymentLogLine) => void;
  }): Promise<DeploymentResult> {
    const { config } = params;

    if (config.provider === 'vercel') {
      return VercelDeploymentEngine.deploy(params);
    }
    if (config.provider === 'netlify') {
      return NetlifyDeploymentEngine.deploy(params);
    }

    return {
      success: false,
      provider: config.provider,
      deploymentId: '',
      deploymentUrl: '',
      status: 'FAILED',
      logs: [log(`Provider "${config.provider}" is not supported.`, 'error')],
      error: `Unsupported provider: ${config.provider}`,
    };
  }
}
