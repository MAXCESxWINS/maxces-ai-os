import { n as AnimatePresence } from "../_libs/framer-motion.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as cn } from "./GlassCard-IDSc0PTK.mjs";
import { K as Inbox, S as Search, g as Sparkles, w as RefreshCw, wt as CircleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Primitives-dumi-uj1.js
var import_jsx_runtime = require_jsx_runtime();
/**
* MAXCES AI OS — Shared UI Primitives
* Premium empty states, loading skeletons, error banners, page loaders.
* Used across ALL pages. Do not duplicate these patterns.
*/
function EmptyState({ icon, title, description, action, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		className: cn("flex flex-col items-center justify-center text-center", size === "md" ? "py-16 gap-4" : "py-8 gap-3"),
		role: "status",
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-muted-foreground",
				children: icon
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-semibold text-foreground", size === "md" ? "text-base" : "text-sm"),
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground/80 max-w-xs leading-relaxed",
				children: description
			})] }),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2",
				children: action
			})
		]
	});
}
function SearchEmptyState({ query }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-6 w-6" }),
		title: `No results for "${query}"`,
		description: "Try adjusting your search terms or check spelling."
	});
}
function ErrorBanner({ title = "Something went wrong", message, onRetry, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: -8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .3 },
		role: "alert",
		"aria-live": "assertive",
		className: cn("flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/8 px-4 py-4", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
				className: "h-4 w-4 text-red-400 mt-0.5 shrink-0",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-red-300",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5 leading-relaxed",
					children: message
				})]
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onRetry,
				"aria-label": "Retry",
				className: "shrink-0 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/10 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
					className: "h-3 w-3",
					"aria-hidden": true
				}), "Retry"]
			})
		]
	});
}
var SHORTCUTS = [
	{
		keys: ["⌘", "K"],
		label: "Open command palette"
	},
	{
		keys: ["⌘", "B"],
		label: "Toggle sidebar"
	},
	{
		keys: ["⌘", "Enter"],
		label: "Send / Submit"
	},
	{
		keys: ["⌘", "/"],
		label: "Show shortcuts"
	},
	{
		keys: ["Esc"],
		label: "Close / Cancel"
	},
	{
		keys: ["⌘", "S"],
		label: "Save current file"
	},
	{
		keys: ["⌘", "Z"],
		label: "Undo last action"
	},
	{
		keys: [
			"⌘",
			"Shift",
			"Z"
		],
		label: "Redo"
	},
	{
		keys: ["Tab"],
		label: "Navigate forward"
	},
	{
		keys: ["Shift", "Tab"],
		label: "Navigate backward"
	}
];
function KeyboardShortcutsModal({ open, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .2 },
		className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
		onClick: onClose,
		"aria-hidden": true
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			scale: .95,
			y: 16
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			scale: .95,
			y: 16
		},
		transition: {
			duration: .25,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Keyboard Shortcuts",
		className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl glass-strong border border-white/12 p-6 shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold text-foreground text-base",
					children: "Keyboard Shortcuts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					"aria-label": "Close shortcuts modal",
					className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 16 16",
						className: "h-4 w-4 fill-current",
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.22 3.22a.75.75 0 011.06 0L8 6.94l3.72-3.72a.75.75 0 111.06 1.06L9.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 01-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 010-1.06z" })
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				role: "list",
				children: SHORTCUTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1",
						children: s.keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded-md border border-white/12 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-foreground",
							children: k
						}, k))
					})]
				}, s.label))
			})]
		})
	})] }) });
}
function OnboardingBanner({ username, onDismiss }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: -12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -12,
			height: 0
		},
		transition: {
			duration: .4,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		role: "region",
		"aria-label": "Welcome banner",
		className: "relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-cyan-600/10 p-6 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-5 w-5 text-white",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-bold text-foreground text-base",
					children: [
						"Welcome to MAXCES AI OS",
						username ? `, ${username}` : "",
						"! 👋"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-1 max-w-md leading-relaxed",
					children: [
						"Start by building a website in",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-purple-300 font-medium",
							children: "Code Builder"
						}),
						", or push an existing project to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-purple-300 font-medium",
							children: "GitHub"
						}),
						" and deploy it live in one click."
					]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onDismiss,
				"aria-label": "Dismiss welcome banner",
				className: "shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors",
				children: "Got it"
			})]
		})]
	});
}
function PageContainer({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		className,
		children
	});
}
var dotColors = {
	green: "bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]",
	yellow: "bg-amber-400 shadow-[0_0_8px_theme(colors.amber.400)]",
	red: "bg-red-400 shadow-[0_0_8px_theme(colors.red.400)]",
	blue: "bg-cyan-400 shadow-[0_0_8px_theme(colors.cyan.400)]",
	gray: "bg-slate-500"
};
function StatusDot({ color = "gray", pulse = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "presentation",
		className: cn("inline-block h-2 w-2 rounded-full shrink-0", dotColors[color], pulse && "animate-pulse")
	});
}
//#endregion
export { PageContainer as a, OnboardingBanner as i, ErrorBanner as n, SearchEmptyState as o, KeyboardShortcutsModal as r, StatusDot as s, EmptyState as t };
