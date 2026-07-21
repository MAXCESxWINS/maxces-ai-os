import { GeminiAIEngine } from './gemini';
import { MemoryEngine } from './memory';
import { WorkspaceEngine } from './workspace';
import { WorkspaceFile } from '@/types/workspace';

export interface CodeGenerationResult {
  success: boolean;
  projectSummary: string;
  createdFiles: WorkspaceFile[];
  nonCoderExplanation: {
    whatWeBuilt: string;
    whyThisApproach: string;
    techRecommendation: string;
    possibleDrawbacks: string;
    nextRecommendedStep: string;
  };
  rawAiResponse: string;
}

export class AICodeGenerator {
  /**
   * Generates modular React/TypeScript project files and saves them to virtual workspace
   */
  static async generateProjectCode(params: {
    userId: string;
    projectId: string;
    userPrompt: string;
    projectName?: string;
  }): Promise<CodeGenerationResult> {
    try {
      // 1. Fetch user memories & Project DNA for tailored context
      const memories = await MemoryEngine.fetchRelevantMemories({ userId: params.userId, limit: 5 });
      const projectDNA = await MemoryEngine.getProjectDNA(params.userId, params.projectName || 'MAXCES Project');

      let designPreference = 'Dark Glassmorphism with neon cyan & purple highlights';
      memories.forEach((m) => {
        if (m.content.toLowerCase().includes('design') || m.content.toLowerCase().includes('theme')) {
          designPreference = m.content;
        }
      });

      const systemInstruction = `
You are MAXCES AI OS — Lead AI Software Architect & Senior React Developer.
Your mission is to generate clean, production-grade modular TypeScript + React 19 components for non-programmer founders.

--- CORE QUALITY RULES ---
1. MODULAR FILE STRUCTURE: Never output a single huge file. Break code cleanly into:
   - src/components/ (Navbar.tsx, Hero.tsx, FeatureCard.tsx)
   - src/pages/ (Home.tsx, Dashboard.tsx)
   - src/lib/ (api.ts, utils.ts)
2. DESIGN SYSTEM: Follow user preference: "${designPreference}".
3. SECURITY: Never hardcode secrets, API keys, or tokens.
4. FORMAT: Return each file formatted as:

FILE: src/components/Navbar.tsx
\`\`\`tsx
// code here
\`\`\`
`.trim();

      const prompt = `
Generate a modular React 19 + TypeScript web application for:
"${params.userPrompt}"

Active Project DNA: ${projectDNA?.name || 'MAXCES Web App'}
Current Phase: ${projectDNA?.current_phase || 'Phase 4 Building'}

Include:
- src/components/Navbar.tsx
- src/components/Hero.tsx
- src/pages/Home.tsx
- src/lib/api.ts
`.trim();

      const aiResponse = await GeminiAIEngine.generateContent({
        prompt,
        systemInstruction,
        model: 'gemini-2.5-flash',
        temperature: 0.5,
      });

      const text = aiResponse.text;
      const createdFiles: WorkspaceFile[] = [];

      // Parse generated files from AI response (Regex match FILE: path \n ```code```)
      const fileBlocks = text.split(/FILE:\s*/g).filter(Boolean);

      for (const block of fileBlocks) {
        const lines = block.trim().split('\n');
        const filePath = lines[0].trim();
        const codeMatch = block.match(/```(?:tsx|ts|json|css|markdown)?\n([\s\S]*?)```/);

        if (filePath && codeMatch && codeMatch[1]) {
          const content = codeMatch[1].trim();
          const fileType = filePath.endsWith('.json')
            ? 'json'
            : filePath.endsWith('.css')
            ? 'style'
            : filePath.endsWith('.md')
            ? 'markdown'
            : 'code';

          const created = await WorkspaceEngine.createFile({
            userId: params.userId,
            projectId: params.projectId,
            filePath,
            content,
            fileType,
          });

          if (created) createdFiles.push(created);
        }
      }

      return {
        success: true,
        projectSummary: `Successfully generated ${createdFiles.length} project files for "${params.userPrompt}"`,
        createdFiles,
        nonCoderExplanation: {
          whatWeBuilt: `We generated a modular web application for "${params.userPrompt}".`,
          whyThisApproach: 'Breaking code into reusable components ensures high performance, clean design, and easy scalability.',
          techRecommendation: 'Built using React 19, TypeScript, and Tailwind CSS v4 styling tokens.',
          possibleDrawbacks: 'Remember to connect your backend API keys in environment settings.',
          nextRecommendedStep: 'Inspect the generated Navbar.tsx and Home.tsx in your Code Builder Workspace.',
        },
        rawAiResponse: text,
      };
    } catch (err: any) {
      console.error('[AICodeGenerator.generateProjectCode Error]:', err);
      return {
        success: false,
        projectSummary: `Failed to generate code: ${err?.message}`,
        createdFiles: [],
        nonCoderExplanation: {
          whatWeBuilt: 'Generation failed due to a system error.',
          whyThisApproach: 'N/A',
          techRecommendation: 'N/A',
          possibleDrawbacks: err?.message || 'Error occurred.',
          nextRecommendedStep: 'Retry prompt or check Gemini API key settings.',
        },
        rawAiResponse: err?.message || 'Error',
      };
    }
  }
}
