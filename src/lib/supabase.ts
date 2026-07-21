import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          memory_type: 'fact' | 'preference' | 'decision' | 'goal' | 'lesson' | 'mistake';
          category: 'personal_preference' | 'technical_choice' | 'project_dna' | 'business_strategy';
          importance_score: number;
          confidence_level: number;
          source: 'conversation' | 'manual' | 'system' | 'imported';
          embedding: number[] | null;
          last_used_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          memory_type?: 'fact' | 'preference' | 'decision' | 'goal' | 'lesson' | 'mistake';
          category?: 'personal_preference' | 'technical_choice' | 'project_dna' | 'business_strategy';
          importance_score?: number;
          confidence_level?: number;
          source?: 'conversation' | 'manual' | 'system' | 'imported';
          embedding?: number[] | null;
          last_used_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          memory_type?: 'fact' | 'preference' | 'decision' | 'goal' | 'lesson' | 'mistake';
          category?: 'personal_preference' | 'technical_choice' | 'project_dna' | 'business_strategy';
          importance_score?: number;
          confidence_level?: number;
          source?: 'conversation' | 'manual' | 'system' | 'imported';
          embedding?: number[] | null;
          last_used_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          tech_stack: Json;
          architecture_notes: string | null;
          current_phase: string;
          status: string;
          project_goals: string | null;
          known_issues: string | null;
          future_features: string | null;
          important_decisions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          tech_stack?: Json;
          architecture_notes?: string | null;
          current_phase?: string;
          status?: string;
          project_goals?: string | null;
          known_issues?: string | null;
          future_features?: string | null;
          important_decisions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          tech_stack?: Json;
          architecture_notes?: string | null;
          current_phase?: string;
          status?: string;
          project_goals?: string | null;
          known_issues?: string | null;
          future_features?: string | null;
          important_decisions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_decisions: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          decision_title: string;
          decision_summary: string | null;
          reasoning: string | null;
          options_considered: Json;
          chosen_solution: string | null;
          impact_level: 'low' | 'medium' | 'high' | 'critical';
          future_reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          decision_title: string;
          decision_summary?: string | null;
          reasoning?: string | null;
          options_considered?: Json;
          chosen_solution?: string | null;
          impact_level?: 'low' | 'medium' | 'high' | 'critical';
          future_reference?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          decision_title?: string;
          decision_summary?: string | null;
          reasoning?: string | null;
          options_considered?: Json;
          chosen_solution?: string | null;
          impact_level?: 'low' | 'medium' | 'high' | 'critical';
          future_reference?: string | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          summary: string | null;
          important_messages: Json;
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title?: string;
          summary?: string | null;
          important_messages?: Json;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          summary?: string | null;
          important_messages?: Json;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          language_preference: string;
          communication_style: string;
          ui_preferences: Json;
          technical_preferences: Json;
          working_style: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          language_preference?: string;
          communication_style?: string;
          ui_preferences?: Json;
          technical_preferences?: Json;
          working_style?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          language_preference?: string;
          communication_style?: string;
          ui_preferences?: Json;
          technical_preferences?: Json;
          working_style?: string;
          updated_at?: string;
        };
      };
      workspace_files: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          file_path: string;
          file_content: string;
          file_type: 'code' | 'style' | 'json' | 'markdown' | 'asset';
          is_directory: boolean;
          version_number: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          file_path: string;
          file_content: string;
          file_type?: 'code' | 'style' | 'json' | 'markdown' | 'asset';
          is_directory?: boolean;
          version_number?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          file_path?: string;
          file_content?: string;
          file_type?: 'code' | 'style' | 'json' | 'markdown' | 'asset';
          is_directory?: boolean;
          version_number?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspace_file_versions: {
        Row: {
          id: string;
          file_id: string;
          user_id: string;
          version_number: number;
          file_content: string;
          change_summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_id: string;
          user_id: string;
          version_number: number;
          file_content: string;
          change_summary?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          file_id?: string;
          user_id?: string;
          version_number?: number;
          file_content?: string;
          change_summary?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
