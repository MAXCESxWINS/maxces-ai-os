import { useContext } from 'react';
import { PermissionContext, PermissionContextType } from '@/context/PermissionContext';

/**
 * Custom hook to access MAXCES AI OS Authorization & Permission state
 */
export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a <PermissionProvider>');
  }
  return context;
};
