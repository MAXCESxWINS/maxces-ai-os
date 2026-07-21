import { o as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./_ssr/useAuth-CJtFg47a.mjs";
import { t as PermissionContext } from "./_ssr/PermissionContext-DTFSoCbs.mjs";
import { t as motion } from "./_libs/motion.mjs";
import { n as cn, t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { t as AuroraBackground } from "./_ssr/AuroraBackground-EFRI5YUF.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as Palette, At as Brain, C as Rocket, I as Lock, L as LoaderCircle, N as MessageSquare, Ot as ChartColumn, Pt as ArrowRight, R as ListTodo, S as Search, V as LayoutDashboard, X as Globe, Z as Github, c as TriangleAlert, g as Sparkles, gt as CodeXml, i as UserRound, kt as Briefcase, mt as Command, n as WandSparkles, nt as FolderKanban, ot as FileText, x as Settings, yt as Clock } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-CiTk2Doe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		label: "Workspace",
		items: [
			{
				to: "/",
				label: "Dashboard",
				icon: LayoutDashboard
			},
			{
				to: "/chat",
				label: "AI Chat",
				icon: MessageSquare
			},
			{
				to: "/projects",
				label: "Projects",
				icon: FolderKanban
			},
			{
				to: "/memory",
				label: "Memory",
				icon: Brain
			},
			{
				to: "/tasks",
				label: "Tasks",
				icon: ListTodo
			}
		]
	},
	{
		label: "Studios",
		items: [
			{
				to: "/prompt-studio",
				label: "Prompt Studio",
				icon: WandSparkles
			},
			{
				to: "/code-builder",
				label: "Code Builder",
				icon: CodeXml
			},
			{
				to: "/website-review",
				label: "Website Review",
				icon: Globe
			},
			{
				to: "/ui-review",
				label: "UI Review",
				icon: Palette
			},
			{
				to: "/github",
				label: "GitHub Push",
				icon: Github
			},
			{
				to: "/deploy",
				label: "Deploy",
				icon: Rocket
			}
		]
	},
	{
		label: "Intelligence",
		items: [
			{
				to: "/business",
				label: "Business",
				icon: Briefcase
			},
			{
				to: "/research",
				label: "Research",
				icon: Search
			},
			{
				to: "/analytics",
				label: "Analytics",
				icon: ChartColumn
			},
			{
				to: "/timeline",
				label: "Timeline",
				icon: Clock
			},
			{
				to: "/files",
				label: "Files",
				icon: FileText
			}
		]
	},
	{
		label: "Account",
		items: [{
			to: "/profile",
			label: "Profile",
			icon: UserRound
		}, {
			to: "/settings",
			label: "Settings",
			icon: Settings
		}]
	}
];
function AppSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "sticky top-4 z-30 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col overflow-hidden rounded-3xl glass-strong lg:flex ml-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-5 pt-5 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl glow-purple",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-secondary to-cyan-glow opacity-90" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "relative z-10 h-5 w-5 text-white",
						strokeWidth: 2.4
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[15px] font-semibold tracking-tight text-foreground",
						children: "MAXCES"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: "AI Operating System"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mb-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-3.5 w-3.5" }), " Quick command"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
					className: "rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono",
					children: "⌘K"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 overflow-y-auto px-3 pb-4",
				children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 first:mt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70",
						children: section.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: section.items.map((item) => {
							const active = pathname === item.to;
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "relative",
								children: [active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									layoutId: "sidebar-active",
									className: "absolute inset-0 rounded-xl bg-gradient-to-r from-primary/25 to-secondary/10 ring-1 ring-inset ring-primary/30",
									transition: {
										type: "spring",
										stiffness: 380,
										damping: 30
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4 shrink-0 transition-colors", active ? "text-cyan-glow" : "text-muted-foreground") }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-medium",
											children: item.label
										}),
										active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-[0_0_10px_var(--cyan-glow)]" })
									]
								})]
							}, item.to);
						})
					})]
				}, section.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-white/5 p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary ring-2 ring-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 grid place-items-center text-xs font-semibold text-white",
								children: "MX"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium text-foreground",
								children: "Alex Maxwell"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[11px] text-muted-foreground",
								children: "Pro · Cortex plan"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-success shadow-[0_0_10px_var(--success)]" })
					]
				})
			})
		]
	});
}
/**
* Custom hook to access MAXCES AI OS Authorization & Permission state
*/
var usePermission = () => {
	const context = (0, import_react.useContext)(PermissionContext);
	if (!context) throw new Error("usePermission must be used within a <PermissionProvider>");
	return context;
};
var ProtectedRoute = ({ children }) => {
	const { user, isGuest, isLoading, error } = useAuth();
	const { canAccessRoute, getRouteMetadata } = usePermission();
	const routerState = useRouterState();
	const navigate = useNavigate();
	const currentPath = routerState.location.pathname;
	const isAllowed = canAccessRoute(currentPath);
	const routeMeta = getRouteMetadata(currentPath);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center p-4 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			glow: true,
			className: "flex flex-col items-center justify-center gap-4 p-8 text-center backdrop-blur-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full items-center justify-center rounded-[14px] bg-background/90",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6 text-purple-400" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm font-medium text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Restoring MAXCES AI Session..." })]
			})]
		})]
	});
	if (!user && !isGuest && currentPath !== "/login") {
		navigate({ to: "/login" });
		return null;
	}
	if (isGuest && !isAllowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center p-4 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			glow: true,
			className: "w-full max-w-md p-8 text-center backdrop-blur-2xl border border-purple-500/20 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-foreground",
					children: "Private Feature Restricted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-purple-300",
						children: routeMeta?.title || "This feature"
					}), " requires a personal MAXCES AI account. Sign up for free to unlock your personal AI memory, projects, and cloud synchronization."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => navigate({ to: "/login" }),
						className: "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Free Account / Sign In" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({ to: "/" }),
						className: "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all",
						children: "Return to Preview Dashboard"
					})]
				})
			]
		})]
	});
	if (error && error.message.includes("JWT")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center p-4 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			glow: true,
			className: "w-full max-w-md p-8 text-center backdrop-blur-2xl border border-amber-500/20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-foreground",
					children: "Session Expired"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: "Your security session has expired. Please sign in again to continue accessing your AI operating system."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/login" }),
					className: "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-semibold text-white shadow-lg hover:bg-purple-500 transition-all",
					children: "Return to Login"
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
};
function AppLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-screen max-w-[1600px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	}) });
}
//#endregion
export { AppLayout as component };
