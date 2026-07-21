/**
 * Centralized Route Permission Metadata Schema for MAXCES AI OS
 */

export type AccessTier =
  | 'public'
  | 'guest'
  | 'authenticated'
  | 'premium'
  | 'team'
  | 'enterprise'
  | 'admin'
  | 'owner';

export interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  requiredTier: AccessTier;
  sidebarVisible: boolean;
  module: string;
}

export const ROUTE_CONFIG: Record<string, RouteMetadata> = {
  '/login': {
    path: '/login',
    title: 'Login & Access',
    description: 'Authenticate to MAXCES AI OS',
    requiredTier: 'public',
    sidebarVisible: false,
    module: 'auth',
  },
  '/': {
    path: '/',
    title: 'Command Center',
    description: 'Main AI Operating System Dashboard',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'dashboard',
  },
  '/_app/chat': {
    path: '/_app/chat',
    title: 'AI Chat Core',
    description: 'Conversational Intelligence Assistant',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'chat',
  },
  '/_app/memory': {
    path: '/_app/memory',
    title: 'AI Memory Bank',
    description: 'Long-term Knowledge & Context Store',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'memory',
  },
  '/_app/projects': {
    path: '/_app/projects',
    title: 'Projects Hub',
    description: 'Personal Projects & Workspace Tracker',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'projects',
  },
  '/_app/tasks': {
    path: '/_app/tasks',
    title: 'Task Orchestrator',
    description: 'Autonomous Task Tracking & Workflow Execution',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'tasks',
  },
  '/_app/files': {
    path: '/_app/files',
    title: 'File Manager & ZIP Analyzer',
    description: 'Project Code Inspector & File Vault',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'files',
  },
  '/_app/code-builder': {
    path: '/_app/code-builder',
    title: 'AI Code Builder',
    description: 'Autonomous Code Generation & Diff Review',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'code-builder',
  },
  '/_app/website-review': {
    path: '/_app/website-review',
    title: 'Website Inspector',
    description: 'Live Site Performance & Audit Engine',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'website-review',
  },
  '/_app/ui-review': {
    path: '/_app/ui-review',
    title: 'UI/UX Consultant',
    description: 'Design System & Component Auditor',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'ui-review',
  },
  '/_app/business': {
    path: '/_app/business',
    title: 'Business Advisor',
    description: 'SaaS Strategy & Monetization Planner',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'business',
  },
  '/_app/prompt-studio': {
    path: '/_app/prompt-studio',
    title: 'Prompt Studio',
    description: 'Prompt Engineering & Testing Ground',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'prompt-studio',
  },
  '/_app/research': {
    path: '/_app/research',
    title: 'Research Assistant',
    description: 'Web & Documentation Intelligence Engine',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'research',
  },
  '/_app/analytics': {
    path: '/_app/analytics',
    title: 'System Analytics',
    description: 'Token Usage & Performance Metrics',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'analytics',
  },
  '/_app/timeline': {
    path: '/_app/timeline',
    title: 'Activity Timeline',
    description: 'System Operation & Audit Logs',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'timeline',
  },
  '/_app/profile': {
    path: '/_app/profile',
    title: 'User Profile',
    description: 'Personal Identity & Workspace Role',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'profile',
  },
  '/_app/settings': {
    path: '/_app/settings',
    title: 'System Settings',
    description: 'AI Models, API Keys & Preferences',
    requiredTier: 'guest',
    sidebarVisible: true,
    module: 'settings',
  },
};

/**
 * Tier Hierarchy Weight Map for Role Checking
 */
export const TIER_WEIGHTS: Record<AccessTier, number> = {
  public: 0,
  guest: 1,
  authenticated: 2,
  premium: 3,
  team: 4,
  enterprise: 5,
  admin: 6,
  owner: 7,
};
