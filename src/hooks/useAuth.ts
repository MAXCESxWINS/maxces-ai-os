import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { AuthContextType } from '@/types/auth';

/**
 * Custom hook to access MAXCES AI OS Authentication State
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};
