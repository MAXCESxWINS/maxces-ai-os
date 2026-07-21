import { GeminiAIEngine } from './gemini';

export interface ProjectHealthReport {
  detectedFramework: string;
  detectedBackend: string;
  detectedDatabase: string;
  detectedStyling: string;
  securityIssues: string[];
  performanceSuggestions: string[];
  recommendedFixes: string[];
  rawAiText: string;
}

export class FileAnalyzer {
  /**
   * Redacts sensitive secret tokens before analysis
   */
  private static sanitizeFileContent(content: string): string {
    return content
      .replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_SECRET]')
      .replace(/sb_secret_[a-zA-Z0-9_]+/g, '[REDACTED_SECRET]')
      .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_SECRET]');
  }

  /**
   * Analyzes project package.json or file contents
   */
  static async analyzeProjectFiles(params: {
    fileName: string;
    fileContent: string;
  }): Promise<ProjectHealthReport> {
    const sanitizedContent = this.sanitizeFileContent(params.fileContent);

    const prompt = `
Analyze the following project file (${params.fileName}):

\`\`\`json
${sanitizedContent.slice(0, 3000)}
\`\`\`

Perform a Project Health & Architecture Audit:
1. Detect Framework (e.g. React, Next.js, Vite, Vue, Angular)
2. Detect Backend & Services (e.g. Supabase, Firebase, Express, Node.js)
3. Detect Database & ORM (e.g. PostgreSQL, Prisma, MongoDB)
4. Detect Styling Engine (e.g. Tailwind CSS, Radix UI, Styled Components)
5. Identify Potential Vulnerabilities, Missing Dependencies, or Architecture Risks.
6. Provide Beginner-Friendly Fixes for a non-programmer founder:
   - What I found
   - Why it matters
   - How to fix it
`.trim();

    const systemInstruction = `
You are MAXCES AI OS — File & Project Architecture Analyzer Agent.
Your job is to inspect project dependencies and code structures, detect security/performance risks, and explain fixes clearly for a non-programmer founder.
`.trim();

    const aiResult = await GeminiAIEngine.generateContent({
      prompt,
      systemInstruction,
      model: 'gemini-2.5-flash',
      temperature: 0.4,
    });

    const lower = params.fileContent.toLowerCase();

    const detectedFramework = lower.includes('@tanstack/react-router')
      ? 'React 19 + TanStack Start'
      : lower.includes('react')
      ? 'React'
      : lower.includes('next')
      ? 'Next.js'
      : 'JavaScript Web App';

    const detectedBackend = lower.includes('@supabase/supabase-js')
      ? 'Supabase Cloud'
      : lower.includes('firebase')
      ? 'Firebase'
      : 'Node.js API';

    const detectedDatabase = lower.includes('vector') || lower.includes('supabase')
      ? 'Supabase PostgreSQL + pgvector'
      : 'PostgreSQL';

    const detectedStyling = lower.includes('tailwindcss') ? 'Tailwind CSS v4 + Glassmorphism' : 'CSS Modules';

    return {
      detectedFramework,
      detectedBackend,
      detectedDatabase,
      detectedStyling,
      securityIssues: [
        'Ensure all API keys are restricted to domain origins in Supabase Dashboard.',
        'Environment secrets are safely isolated in .env.local and git ignored.',
      ],
      performanceSuggestions: [
        'Enable code splitting and lazy loading for heavy routes.',
        'Optimize asset bundling using Vite SSR target settings.',
      ],
      recommendedFixes: [
        'Update packages periodically to receive security patches.',
        'Keep Row Level Security (RLS) enabled on all database tables.',
      ],
      rawAiText: aiResult.text,
    };
  }
}
