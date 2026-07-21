import { supabase } from '@/lib/supabase';
import {
  AIMemory,
  ProjectDNA,
  AIDecisionLog,
  MemoryType,
  MemoryCategory,
  ImpactLevel,
  MemorySource,
} from '@/types/database';

/**
 * SENSITIVE DATA SCRUBBER
 * Prevents saving API keys, secrets, passwords, or tokens into long-term AI memory.
 */
const SENSITIVE_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/g, // OpenAI / Stripe style secret keys
  /sb_secret_[a-zA-Z0-9_]+/g, // Supabase secret keys
  /sb_publishable_[a-zA-Z0-9_]+/g, // Supabase keys
  /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, // JWT Tokens
  /password\s*=\s*['"][^'"]+['"]/gi,
  /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
];

function sanitizeMemoryContent(content: string): string {
  let cleaned = content;
  for (const pattern of SENSITIVE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '[REDACTED_SECRET]');
  }
  return cleaned.trim();
}

/**
 * AUTOMATED IMPORTANCE SCORER & CATEGORIZER
 */
function scoreMemory(content: string, type: MemoryType): { score: number; confidence: number } {
  let score = 50;
  let confidence = 0.9;

  const lower = content.toLowerCase();

  if (type === 'preference' || lower.includes('prefer') || lower.includes('always use') || lower.includes('design')) {
    score = 85;
    confidence = 0.95;
  } else if (type === 'decision' || lower.includes('decided') || lower.includes('chose') || lower.includes('rule')) {
    score = 90;
    confidence = 0.95;
  } else if (type === 'goal' || lower.includes('goal') || lower.includes('objective')) {
    score = 80;
    confidence = 0.9;
  } else if (type === 'mistake' || lower.includes('error') || lower.includes('bug') || lower.includes('avoid')) {
    score = 75;
    confidence = 0.85;
  } else if (lower.includes('today') || lower.includes('temp') || lower.includes('testing')) {
    score = 25; // Temporary memory
    confidence = 0.6;
  }

  return { score, confidence };
}

/**
 * MEMORY ENGINE SERVICE
 */
export class MemoryEngine {
  /**
   * 1. Save an important user memory
   */
  static async saveMemory(params: {
    userId: string;
    content: string;
    memoryType?: MemoryType;
    category?: MemoryCategory;
    importanceScore?: number;
    confidenceLevel?: number;
    source?: MemorySource;
  }): Promise<{ success: boolean; memory?: AIMemory; error?: string }> {
    try {
      const sanitized = sanitizeMemoryContent(params.content);
      if (!sanitized || sanitized.length < 3) {
        return { success: false, error: 'Memory content too short or invalid.' };
      }

      const memoryType = params.memoryType || 'fact';
      const category = params.category || 'technical_choice';
      const { score: defaultScore, confidence: defaultConfidence } = scoreMemory(sanitized, memoryType);

      const importanceScore = params.importanceScore ?? defaultScore;
      const confidenceLevel = params.confidenceLevel ?? defaultConfidence;
      const source = params.source || 'conversation';

      // 1. Duplicate Check: If memory with same content exists for user, update timestamp
      const { data: existing } = await (supabase as any)
        .from('memories')
        .select('*')
        .eq('user_id', params.userId)
        .eq('content', sanitized)
        .maybeSingle();

      if (existing) {
        const { data: updated } = await (supabase as any)
          .from('memories')
          .update({
            last_used_at: new Date().toISOString(),
            importance_score: Math.max(existing.importance_score, importanceScore),
          })
          .eq('id', existing.id)
          .select()
          .single();

        return { success: true, memory: updated as AIMemory };
      }

      // 2. Insert New Memory
      const { data: inserted, error } = await (supabase as any)
        .from('memories')
        .insert({
          user_id: params.userId,
          content: sanitized,
          memory_type: memoryType,
          category,
          importance_score: importanceScore,
          confidence_level: confidenceLevel,
          source,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, memory: inserted as AIMemory };
    } catch (err: any) {
      console.error('[MAXCES MemoryEngine] Error saving memory:', err);
      return { success: false, error: err?.message || 'Failed to save memory.' };
    }
  }

  /**
   * 2. Retrieve relevant memories for context injection
   */
  static async fetchRelevantMemories(params: {
    userId: string;
    category?: MemoryCategory;
    minImportance?: number;
    limit?: number;
  }): Promise<AIMemory[]> {
    try {
      const minImportance = params.minImportance ?? 40; // Default filter: useful memories only (> 40)
      const limit = params.limit ?? 15;

      let query = (supabase as any)
        .from('memories')
        .select('*')
        .eq('user_id', params.userId)
        .gte('importance_score', minImportance)
        .order('importance_score', { ascending: false })
        .order('confidence_level', { ascending: false })
        .order('last_used_at', { ascending: false })
        .limit(limit);

      if (params.category) {
        query = query.eq('category', params.category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as AIMemory[];
    } catch (err) {
      console.error('[MAXCES MemoryEngine] Error fetching memories:', err);
      return [];
    }
  }

  /**
   * 3. Delete a memory (User Isolation Enforced)
   */
  static async deleteMemory(userId: string, memoryId: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('memories')
        .delete()
        .eq('id', memoryId)
        .eq('user_id', userId); // Strictly isolated by user_id

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[MAXCES MemoryEngine] Error deleting memory:', err);
      return false;
    }
  }

  /**
   * 4. Save or Update Project DNA Profile
   */
  static async saveProjectDNA(params: {
    userId: string;
    name: string;
    description?: string;
    techStack?: string[];
    architectureNotes?: string;
    currentPhase?: string;
    status?: string;
    projectGoals?: string;
    knownIssues?: string;
    futureFeatures?: string;
    importantDecisions?: string;
  }): Promise<{ success: boolean; project?: ProjectDNA; error?: string }> {
    try {
      // Check if project exists by name
      const { data: existing } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('user_id', params.userId)
        .eq('name', params.name)
        .maybeSingle();

      const payload = {
        user_id: params.userId,
        name: params.name,
        description: params.description ?? existing?.description ?? null,
        tech_stack: params.techStack ?? existing?.tech_stack ?? [],
        architecture_notes: params.architectureNotes ?? existing?.architecture_notes ?? null,
        current_phase: params.currentPhase ?? existing?.current_phase ?? 'Phase 3: Core Brain',
        status: params.status ?? existing?.status ?? 'active',
        project_goals: params.projectGoals ?? existing?.project_goals ?? null,
        known_issues: params.knownIssues ?? existing?.known_issues ?? null,
        future_features: params.futureFeatures ?? existing?.future_features ?? null,
        important_decisions: params.importantDecisions ?? existing?.important_decisions ?? null,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const { data: updated, error } = await (supabase as any)
          .from('projects')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return { success: true, project: updated as ProjectDNA };
      } else {
        const { data: inserted, error } = await (supabase as any)
          .from('projects')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return { success: true, project: inserted as ProjectDNA };
      }
    } catch (err: any) {
      console.error('[MAXCES MemoryEngine] Error saving project DNA:', err);
      return { success: false, error: err?.message || 'Failed to save project DNA.' };
    }
  }

  /**
   * 5. Get Project DNA Profile
   */
  static async getProjectDNA(userId: string, projectName: string): Promise<ProjectDNA | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('name', projectName)
        .maybeSingle();

      if (error) throw error;
      return (data as ProjectDNA) || null;
    } catch (err) {
      console.error('[MAXCES MemoryEngine] Error fetching project DNA:', err);
      return null;
    }
  }

  /**
   * 6. Log AI Decision & Reasoning
   */
  static async logAIDecision(params: {
    userId: string;
    projectId?: string;
    decisionTitle: string;
    decisionSummary?: string;
    reasoning?: string;
    optionsConsidered?: string[];
    chosenSolution?: string;
    impactLevel?: ImpactLevel;
    futureReference?: string;
  }): Promise<{ success: boolean; decision?: AIDecisionLog; error?: string }> {
    try {
      const { data, error } = await (supabase as any)
        .from('ai_decisions')
        .insert({
          user_id: params.userId,
          project_id: params.projectId || null,
          decision_title: params.decisionTitle,
          decision_summary: params.decisionSummary || null,
          reasoning: params.reasoning || null,
          options_considered: params.optionsConsidered || [],
          chosen_solution: params.chosenSolution || null,
          impact_level: params.impactLevel || 'medium',
          future_reference: params.futureReference || null,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, decision: data as AIDecisionLog };
    } catch (err: any) {
      console.error('[MAXCES MemoryEngine] Error logging AI decision:', err);
      return { success: false, error: err?.message || 'Failed to log decision.' };
    }
  }
}
