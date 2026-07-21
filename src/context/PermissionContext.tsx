import React, { createContext, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AccessTier, ROUTE_CONFIG, TIER_WEIGHTS, RouteMetadata } from '@/types/permissions';

export interface PermissionContextType {
  currentTier: AccessTier;
  canAccessTier: (requiredTier: AccessTier) => boolean;
  canAccessRoute: (pathname: string) => boolean;
  getRouteMetadata: (pathname: string) => RouteMetadata | undefined;
}

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isGuest } = useAuth();

  // Compute current access tier
  const currentTier = useMemo<AccessTier>(() => {
    if (profile?.role === 'admin') {
      return 'admin';
    }
    if (user) {
      return 'authenticated';
    }
    if (isGuest) {
      return 'guest';
    }
    return 'public';
  }, [user, profile, isGuest]);

  const canAccessTier = (requiredTier: AccessTier): boolean => {
    const userWeight = TIER_WEIGHTS[currentTier] ?? 0;
    const requiredWeight = TIER_WEIGHTS[requiredTier] ?? 0;
    return userWeight >= requiredWeight;
  };

  const canAccessRoute = (pathname: string): boolean => {
    const routeInfo = ROUTE_CONFIG[pathname];
    if (!routeInfo) {
      // Default fallback: allow if public or authenticated
      return true;
    }
    return canAccessTier(routeInfo.requiredTier);
  };

  const getRouteMetadata = (pathname: string): RouteMetadata | undefined => {
    return ROUTE_CONFIG[pathname];
  };

  const value = useMemo<PermissionContextType>(
    () => ({
      currentTier,
      canAccessTier,
      canAccessRoute,
      getRouteMetadata,
    }),
    [currentTier]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
