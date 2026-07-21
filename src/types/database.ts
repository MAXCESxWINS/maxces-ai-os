/**
 * Supabase Database TypeScript Schemas for MAXCES AI OS (Phase 3 Core Brain)
 */

export type MemoryType = 'fact' | 'preference' | 'decision' | 'goal' | 'lesson' | 'mistake';
export type MemoryCategory = 'personal_preference' | 'technical_choice' | 'project_dna' | 'business_strategy';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';
export type MemorySource = 'conversation' | 'manual' | 'system' | 'imported';

export interface AIMemory {
  id: string;
  user_id: string;
  content: string;
  memory_type: MemoryType;
  category: MemoryCategory;
  importance_score: number; // 0 - 100
  confidence_level: number; // 0.0 - 1.0
  source: MemorySource;
  embedding?: number[] | null;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDNA {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  tech_stack: string[];
  architecture_notes?: string | null;
  current_phase: string;
  status: string;
  project_goals?: string | null;
  known_issues?: string | null;
  future_features?: string | null;
  important_decisions?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIDecisionLog {
  id: string;
  user_id: string;
  project_id?: string | null;
  decision_title: string;
  decision_summary?: string | null;
  reasoning?: string | null;
  options_considered: string[];
  chosen_solution?: string | null;
  impact_level: ImpactLevel;
  future_reference?: string | null;
  created_at: string;
}

export interface ConversationMemory {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  summary?: string | null;
  important_messages: any[];
  embedding?: number[] | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  language_preference: string;
  communication_style: string;
  ui_preferences: Record<string, any>;
  technical_preferences: Record<string, any>;
  working_style: string;
  updated_at: string;
}
