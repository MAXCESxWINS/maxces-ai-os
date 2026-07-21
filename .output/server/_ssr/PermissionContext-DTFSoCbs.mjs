import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./useAuth-CJtFg47a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PermissionContext-DTFSoCbs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROUTE_CONFIG = {
	"/login": {
		path: "/login",
		title: "Login & Access",
		description: "Authenticate to MAXCES AI OS",
		requiredTier: "public",
		sidebarVisible: false,
		module: "auth"
	},
	"/": {
		path: "/",
		title: "Command Center",
		description: "Main AI Operating System Dashboard",
		requiredTier: "guest",
		sidebarVisible: true,
		module: "dashboard"
	},
	"/_app/chat": {
		path: "/_app/chat",
		title: "AI Chat Core",
		description: "Conversational Intelligence Assistant",
		requiredTier: "guest",
		sidebarVisible: true,
		module: "chat"
	},
	"/_app/memory": {
		path: "/_app/memory",
		title: "AI Memory Bank",
		description: "Long-term Knowledge & Context Store",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "memory"
	},
	"/_app/projects": {
		path: "/_app/projects",
		title: "Projects Hub",
		description: "Personal Projects & Workspace Tracker",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "projects"
	},
	"/_app/tasks": {
		path: "/_app/tasks",
		title: "Task Orchestrator",
		description: "Autonomous Task Tracking & Workflow Execution",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "tasks"
	},
	"/_app/files": {
		path: "/_app/files",
		title: "File Manager & ZIP Analyzer",
		description: "Project Code Inspector & File Vault",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "files"
	},
	"/_app/code-builder": {
		path: "/_app/code-builder",
		title: "AI Code Builder",
		description: "Autonomous Code Generation & Diff Review",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "code-builder"
	},
	"/_app/website-review": {
		path: "/_app/website-review",
		title: "Website Inspector",
		description: "Live Site Performance & Audit Engine",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "website-review"
	},
	"/_app/ui-review": {
		path: "/_app/ui-review",
		title: "UI/UX Consultant",
		description: "Design System & Component Auditor",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "ui-review"
	},
	"/_app/business": {
		path: "/_app/business",
		title: "Business Advisor",
		description: "SaaS Strategy & Monetization Planner",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "business"
	},
	"/_app/prompt-studio": {
		path: "/_app/prompt-studio",
		title: "Prompt Studio",
		description: "Prompt Engineering & Testing Ground",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "prompt-studio"
	},
	"/_app/research": {
		path: "/_app/research",
		title: "Research Assistant",
		description: "Web & Documentation Intelligence Engine",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "research"
	},
	"/_app/analytics": {
		path: "/_app/analytics",
		title: "System Analytics",
		description: "Token Usage & Performance Metrics",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "analytics"
	},
	"/_app/timeline": {
		path: "/_app/timeline",
		title: "Activity Timeline",
		description: "System Operation & Audit Logs",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "timeline"
	},
	"/_app/profile": {
		path: "/_app/profile",
		title: "User Profile",
		description: "Personal Identity & Workspace Role",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "profile"
	},
	"/_app/settings": {
		path: "/_app/settings",
		title: "System Settings",
		description: "AI Models, API Keys & Preferences",
		requiredTier: "authenticated",
		sidebarVisible: true,
		module: "settings"
	}
};
/**
* Tier Hierarchy Weight Map for Role Checking
*/
var TIER_WEIGHTS = {
	public: 0,
	guest: 1,
	authenticated: 2,
	premium: 3,
	team: 4,
	enterprise: 5,
	admin: 6,
	owner: 7
};
var PermissionContext = (0, import_react.createContext)(void 0);
var PermissionProvider = ({ children }) => {
	const { user, profile, isGuest } = useAuth();
	const currentTier = (0, import_react.useMemo)(() => {
		if (profile?.role === "admin") return "admin";
		if (user) return "authenticated";
		if (isGuest) return "guest";
		return "public";
	}, [
		user,
		profile,
		isGuest
	]);
	const canAccessTier = (requiredTier) => {
		return (TIER_WEIGHTS[currentTier] ?? 0) >= (TIER_WEIGHTS[requiredTier] ?? 0);
	};
	const canAccessRoute = (pathname) => {
		const routeInfo = ROUTE_CONFIG[pathname];
		if (!routeInfo) return true;
		return canAccessTier(routeInfo.requiredTier);
	};
	const getRouteMetadata = (pathname) => {
		return ROUTE_CONFIG[pathname];
	};
	const value = (0, import_react.useMemo)(() => ({
		currentTier,
		canAccessTier,
		canAccessRoute,
		getRouteMetadata
	}), [currentTier]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PermissionContext.Provider, {
		value,
		children
	});
};
//#endregion
export { PermissionProvider as n, PermissionContext as t };
