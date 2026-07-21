import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  enableGuestMode: () => void;
  exitGuestMode: () => void;
  refetchProfile: () => Promise<void>;
}
