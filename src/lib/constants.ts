/**
 * Application Constants for MAXCES AI OS
 */

export const APP_CONFIG = {
  name: 'MAXCES AI OS',
  version: '1.0.0-phase2',
  auth: {
    loginRoute: '/login',
    defaultRedirectRoute: '/',
  },
  roles: {
    USER: 'user',
    ADMIN: 'admin',
  } as const,
};
