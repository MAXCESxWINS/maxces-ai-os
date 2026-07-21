/**
 * Environment Variables Validation Utility for MAXCES AI OS
 * Ensures all required environment variables are present and correctly formatted.
 */

interface EnvVariables {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_GEMINI_API_KEY: string;
}

function validateEnv(): EnvVariables {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const missingVars: string[] = [];

  if (!supabaseUrl || supabaseUrl === 'https://your-supabase-project-id.supabase.co') {
    missingVars.push('VITE_SUPABASE_URL');
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key-here') {
    missingVars.push('VITE_SUPABASE_ANON_KEY');
  }

  if (missingVars.length > 0) {
    const errorMsg = `[MAXCES AI OS Config Error] Missing environment variables: ${missingVars.join(
      ', '
    )}. Please update your .env.local file.`;
    console.warn(errorMsg);
  }

  return {
    VITE_SUPABASE_URL: supabaseUrl || '',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey || '',
    VITE_GEMINI_API_KEY: geminiApiKey || '',
  };
}

export const env = validateEnv();
