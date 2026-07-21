import { GeminiAIEngine, GeminiMessage, GeminiResponse } from './gemini';
import { MemoryEngine } from './memory';
import { AIMemory, ProjectDNA } from '@/types/database';

export interface OrchestratorParams {
  userId?: string;
  userPrompt: string;
  projectName?: string;
  conversationHistory?: GeminiMessage[];
  forceHinglish?: boolean;
}

const HINGLISH_KEYWORDS = [
  'bhai', 'kaise', 'kya', 'banani', 'hai', 'karo', 'kar', 'batao', 'ye', 'sahi',
  'mujhe', 'bol', 'mera', 'meri', 'karna', 'karke', 'ho', 'gaya', 'bana', 'dikhao'
];

function isHinglishInput(text: string): boolean {
  const lower = text.toLowerCase();
  return HINGLISH_KEYWORDS.some((kw) => lower.includes(kw));
}

export class PromptOrchestrator {
  /**
   * Builds the context-infused System Instruction string
   */
  static buildSystemPrompt(params: {
    memories: AIMemory[];
    projectDNA?: ProjectDNA | null;
    isHinglish: boolean;
  }): string {
    const { memories, projectDNA, isHinglish } = params;

    let languageRule = isHinglish
      ? 'The user is communicating in Hinglish (Hindi + English). Respond in natural, friendly, conversational Hinglish while keeping all technical terms, code, framework names, and architectural terms strictly in English.'
      : 'Default Language: Clear, professional, non-programmer-friendly English.';

    let memoryContextSection = '';
    if (memories.length > 0) {
      memoryContextSection = `\n--- LONG-TERM MEMORIES & USER PREFERENCES ---\n` +
        memories.map((m) => `- [${m.category.toUpperCase()}] ${m.content} (Importance: ${m.importance_score}/100)`).join('\n') +
        `\n---------------------------------------------\n`;
    }

    let projectContextSection = '';
    if (projectDNA) {
      projectContextSection = `\n--- ACTIVE PROJECT DNA: ${projectDNA.name.toUpperCase()} ---\n` +
        `- Current Phase: ${projectDNA.current_phase}\n` +
        `- Tech Stack: ${Array.isArray(projectDNA.tech_stack) ? projectDNA.tech_stack.join(', ') : 'Not specified'}\n` +
        `- Architecture Notes: ${projectDNA.architecture_notes || 'Standard'}\n` +
        `- Goals: ${projectDNA.project_goals || 'Building production SaaS'}\n` +
        `-----------------------------------------------\n`;
    }

    return `
You are MAXCES AI OS — an elite personal AI Operating System, CTO, Lead Architect, Product Manager, and Founder Co-Pilot.

--- YOUR CORE PHILOSOPHY & OPERATING RULES ---
1. NON-PROGRAMMER FRIENDLY: The user is a founder and product owner, not a traditional developer. Never assume they know complex syntax. Always explain "What we are doing", "Why we are doing it", and "What can go wrong" before providing solution options.
2. TONE & LANGUAGE: ${languageRule} Be calm, respectful, encouraging, highly strategic, and practical.
3. 7-STAGE CTO THINKING PIPELINE:
   - Understand: Identify the true user goal and experience level.
   - Challenge & Protect: Respectfully challenge bad ideas, security risks, or unscalable decisions. Offer safer/better alternatives.
   - Option Generation: Present Option A (Fast & Simple) vs Option B (Professional & Scalable) vs Option C (Enterprise).
   - Clear Recommendations: Explain WHY you recommend the best choice.
   - 10x Improvement: Suggest how the user's vision can become 10x better.
4. UI & AESTHETICS: Preserve dark glassmorphism, fluid animations, Radix UI, and clean full-stack architecture principles.

${memoryContextSection}
${projectContextSection}

Execute your response formatted in clean GitHub Markdown with clear headings and bullet points.
`.trim();
  }

  /**
   * Generates a fully orchestrated AI response with automatic memory retrieval and auto-learning
   */
  static async generateOrchestratedResponse(params: OrchestratorParams): Promise<GeminiResponse> {
    try {
      const isHinglish = params.forceHinglish || isHinglishInput(params.userPrompt);
      const userId = params.userId;
      const projectName = params.projectName || 'MAXCES AI OS';

      let memories: AIMemory[] = [];
      let projectDNA: ProjectDNA | null = null;

      // 1. Fetch relevant memories & project DNA if user is authenticated
      if (userId) {
        memories = await MemoryEngine.fetchRelevantMemories({ userId, limit: 10 });
        projectDNA = await MemoryEngine.getProjectDNA(userId, projectName);
      }

      // 2. Build System Prompt
      const systemInstruction = this.buildSystemPrompt({
        memories,
        projectDNA,
        isHinglish,
      });

      // 3. Call Gemini AI Engine
      const aiResponse = await GeminiAIEngine.generateContent({
        prompt: params.userPrompt,
        systemInstruction,
        history: params.conversationHistory,
        model: 'gemini-2.5-flash',
        temperature: 0.7,
      });

      // 4. Auto-Learning Memory Extractor (Background non-blocking learning)
      if (userId && aiResponse.success && params.userPrompt.length > 15) {
        this.extractAndSaveMemoriesInBackground(userId, params.userPrompt, aiResponse.text);
      }

      return aiResponse;
    } catch (err: any) {
      console.error('[MAXCES PromptOrchestrator Error]:', err);
      return {
        text: `⚠️ **AI Orchestrator Error**: ${err?.message || 'Failed to process request.'}`,
        success: false,
        modelUsed: 'none',
        error: err?.message,
      };
    }
  }

  /**
   * Background Memory Learner (Extracts preferences or choices automatically)
   */
  private static extractAndSaveMemoriesInBackground(userId: string, userPrompt: string, aiAnswer: string) {
    setTimeout(async () => {
      const lowerPrompt = userPrompt.toLowerCase();
      if (lowerPrompt.includes('prefer') || lowerPrompt.includes('always use') || lowerPrompt.includes('my preference')) {
        await MemoryEngine.saveMemory({
          userId,
          content: userPrompt,
          memoryType: 'preference',
          category: 'personal_preference',
          importanceScore: 85,
        });
      } else if (lowerPrompt.includes('decided to') || lowerPrompt.includes('we will use')) {
        await MemoryEngine.saveMemory({
          userId,
          content: userPrompt,
          memoryType: 'decision',
          category: 'technical_choice',
          importanceScore: 90,
        });
      }
    }, 100);
  }
}
