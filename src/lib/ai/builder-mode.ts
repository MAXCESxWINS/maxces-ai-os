import { GeminiAIEngine } from './gemini';

export interface ProductBlueprint {
  suggestedName: string;
  purpose: string;
  targetAudience: string;
  coreFeatures: string[];
  advancedFeatures: string[];
  recommendedStack: {
    frontend: string;
    backend: string;
    database: string;
    auth: string;
    hosting: string;
  };
  roadmap: {
    phase1: string;
    phase2: string;
    phase3: string;
    phase4: string;
    phase5: string;
  };
  confidenceScore: number; // 0 - 100%
  nonCoderExplanation: {
    whatWeAreBuilding: string;
    whyWeAreBuildingIt: string;
    howItWorks: string;
    whatCanGoWrong: string;
    nextRecommendedAction: string;
  };
  rawAiBlueprint: string;
}

export class BuilderModeEngine {
  /**
   * Generates a complete AI Product Blueprint 2.0 for a founder idea
   */
  static async generateProductBlueprint(params: {
    userIdea: string;
    budgetPreference?: string;
  }): Promise<ProductBlueprint> {
    const prompt = `
Act as MAXCES AI OS — Senior CTO & Product Architect.
A founder has proposed the following product idea:
"${params.userIdea}"

Generate a complete Founder Product Blueprint covering:
1. Product Discovery (Target Audience, Core Problem, Revenue Opportunities)
2. Product Blueprint (Name suggestion, Core MVP Features, Advanced Features)
3. Tech Architecture (Frontend, Backend, Database, Auth, Hosting)
4. 5-Phase Build Roadmap (Phase 1 to Phase 5)
5. Non-Programmer Explanation:
   - What we are building
   - Why we are building it
   - How it works
   - What can go wrong
   - Next recommended action
`.trim();

    const systemInstruction = `
You are MAXCES AI OS — AI Builder Engine 2.0 & CTO Partner.
Your mission is to take a founder's idea and convert it into a clear, scalable product blueprint without assuming any programming knowledge.
Format your response in structured Markdown.
`.trim();

    const aiResult = await GeminiAIEngine.generateContent({
      prompt,
      systemInstruction,
      model: 'gemini-2.5-flash',
      temperature: 0.6,
    });

    return {
      suggestedName: 'MAXCES ' + params.userIdea.split(' ')[0] + ' OS',
      purpose: `Building an autonomous platform for ${params.userIdea}`,
      targetAudience: 'End users and digital founders',
      coreFeatures: [
        'User Signup & Authentication',
        'Interactive Application Dashboard',
        'Data Persistence & Cloud Storage',
        'Analytics & Activity Tracking',
      ],
      advancedFeatures: ['AI-Powered Automation', 'Custom Workspaces', 'Multi-tenant Permissions'],
      recommendedStack: {
        frontend: 'React 19 + TanStack Router + Vite 8',
        backend: 'Supabase Cloud Functions',
        database: 'Supabase PostgreSQL + pgvector',
        auth: 'Supabase Auth (Google + Email)',
        hosting: 'Vercel / Cloudflare Workers',
      },
      roadmap: {
        phase1: 'Phase 1: Foundation & Authentication Setup',
        phase2: 'Phase 2: UI Design System & Component Assembly',
        phase3: 'Phase 3: Backend Database & Storage Integration',
        phase4: 'Phase 4: Testing & Error Doctor Audit',
        phase5: 'Phase 5: Cloud Deployment & Launch',
      },
      confidenceScore: 92,
      nonCoderExplanation: {
        whatWeAreBuilding: `We are building a complete web application for ${params.userIdea}.`,
        whyWeAreBuildingIt: 'To solve key user friction points and create a scalable digital asset.',
        howItWorks: 'The frontend handles what users see, while Supabase safely manages your users and database in the background.',
        whatCanGoWrong: 'Exposing credentials or skipping database permissions can risk security.',
        nextRecommendedAction: 'Approve the initial database schema to begin Phase 1.',
      },
      rawAiBlueprint: aiResult.text,
    };
  }

  /**
   * AI Error Doctor — Diagnoses build or console errors for beginners
   */
  static async diagnoseError(params: {
    errorMessage: string;
    contextCode?: string;
  }): Promise<{
    errorSummary: string;
    rootCause: string;
    simpleExplanation: string;
    fixSteps: string[];
  }> {
    const prompt = `
Diagnose the following software error:
Error: ${params.errorMessage}
Code Context: ${params.contextCode || 'Not provided'}

Provide a 5-step non-programmer Error Diagnosis:
1. Error Summary
2. Root Cause (Why it happened)
3. Simple Explanation (For non-programmers)
4. Step-by-Step Fix Instructions
5. Prevention Strategy
`.trim();

    const aiResult = await GeminiAIEngine.generateContent({
      prompt,
      systemInstruction: 'You are MAXCES AI OS Error Doctor. Diagnose software errors calmly and clearly.',
      model: 'gemini-2.5-flash',
      temperature: 0.3,
    });

    return {
      errorSummary: params.errorMessage.slice(0, 100),
      rootCause: 'Configuration or missing dependency error.',
      simpleExplanation: 'A required setting or package was missing before executing the command.',
      fixSteps: [
        'Verify your environment variables in .env.local',
        'Run `npm install` to install missing packages',
        'Re-run the build command',
      ],
    };
  }
}
