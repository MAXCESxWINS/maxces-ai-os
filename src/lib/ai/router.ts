import { GeminiMessage, GeminiResponse } from './gemini';
import { PromptOrchestrator } from './prompt-orchestrator';

export type AIIntent =
  | 'coding'
  | 'website_review'
  | 'file_analysis'
  | 'business'
  | 'learning'
  | 'research'
  | 'general';

export interface RoutingDecision {
  intent: AIIntent;
  confidence: number; // 0.0 - 1.0
  recommendedAgent: string;
  requiredContext: string[];
  systemInstructions: string;
  clarificationNeeded?: string;
}

export interface RouterParams {
  userId?: string;
  userPrompt: string;
  projectName?: string;
  conversationHistory?: GeminiMessage[];
  hasAttachedFiles?: boolean;
}

export class AIRouter {
  /**
   * Detects user intent and returns a RoutingDecision
   */
  static detectIntent(prompt: string, hasAttachedFiles = false): {
    intent: AIIntent;
    confidence: number;
    clarificationNeeded?: string;
  } {
    const lower = prompt.toLowerCase();

    // 1. File Analysis Intent
    if (hasAttachedFiles || lower.includes('.zip') || lower.includes('package.json') || lower.includes('folder structure')) {
      return { intent: 'file_analysis', confidence: 0.95 };
    }

    // 2. Website Review Intent
    if (lower.includes('http://') || lower.includes('https://') || lower.includes('review website') || lower.includes('audit site') || lower.includes('landing page')) {
      const hasUrl = /https?:\/\/[^\s]+/.test(prompt);
      return {
        intent: 'website_review',
        confidence: hasUrl ? 0.95 : 0.65, // Lower confidence if no URL provided
        clarificationNeeded: hasUrl ? undefined : 'Could you please share the URL of the website you would like me to audit?',
      };
    }

    // 3. Coding Mode Intent
    if (
      lower.includes('error') || lower.includes('bug') || lower.includes('code') ||
      lower.includes('react') || lower.includes('typescript') || lower.includes('component') ||
      lower.includes('build failed') || lower.includes('npm') || lower.includes('fix')
    ) {
      return { intent: 'coding', confidence: 0.9 };
    }

    // 4. Business & SaaS Strategy Intent
    if (
      lower.includes('saas') || lower.includes('pricing') || lower.includes('monetize') ||
      lower.includes('business') || lower.includes('startup') || lower.includes('growth') ||
      lower.includes('idea') || lower.includes('competitor')
    ) {
      return { intent: 'business', confidence: 0.85 };
    }

    // 5. Beginner / Learning Teacher Mode
    if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does') || lower.includes('teach me') || lower.includes('beginner')) {
      return { intent: 'learning', confidence: 0.85 };
    }

    // 6. Deep Research Intent
    if (lower.includes('research') || lower.includes('compare') || lower.includes('documentation') || lower.includes('latest version')) {
      return { intent: 'research', confidence: 0.8 };
    }

    // 7. General Founder Partner Mode
    return { intent: 'general', confidence: 0.8 };
  }

  /**
   * Routes the user request to the optimal agent and generates an orchestrated response
   */
  static async routeAndExecute(params: RouterParams): Promise<GeminiResponse> {
    const { intent, confidence, clarificationNeeded } = this.detectIntent(params.userPrompt, params.hasAttachedFiles);

    // Low confidence check: Ask clarification if URL or crucial info missing
    if (confidence < 0.70 && clarificationNeeded) {
      return {
        text: `🔍 **Clarification Request**: ${clarificationNeeded}`,
        success: true,
        modelUsed: 'router-clarification',
      };
    }

    // Delegate execution to PromptOrchestrator with sub-agent mode context
    return await PromptOrchestrator.generateOrchestratedResponse({
      userId: params.userId,
      userPrompt: `[SUB-AGENT MODE: ${intent.toUpperCase()}]\n${params.userPrompt}`,
      projectName: params.projectName,
      conversationHistory: params.conversationHistory,
    });
  }
}
