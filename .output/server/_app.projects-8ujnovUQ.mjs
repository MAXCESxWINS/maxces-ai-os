import { o as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as supabase, r as useAuth } from "./_ssr/useAuth-CJtFg47a.mjs";
import { t as motion } from "./_libs/motion.mjs";
import { t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { I as Lock, It as Activity, S as Search, T as Plus, et as Funnel, g as Sparkles, h as Star, y as ShieldCheck, yt as Clock } from "./_libs/lucide-react.mjs";
import { t as TopBar } from "./_ssr/TopBar-COxNCqmT.mjs";
import { a as PageContainer } from "./_ssr/Primitives-dumi-uj1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.projects-8ujnovUQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROJECTS = [
	{
		name: "MAXCES AI OS",
		stack: [
			"React 19",
			"Supabase",
			"Gemini 2.5"
		],
		progress: 95,
		health: 98,
		updated: "Just now",
		starred: true,
		tone: "from-purple-600 to-indigo-600"
	},
	{
		name: "Orbit CRM",
		stack: [
			"Next.js",
			"Postgres",
			"Stripe"
		],
		progress: 78,
		health: 96,
		updated: "2h ago",
		starred: true,
		tone: "from-indigo-600 to-cyan-500"
	},
	{
		name: "Halo Editor",
		stack: [
			"Tauri",
			"Rust",
			"React"
		],
		progress: 42,
		health: 88,
		updated: "Yesterday",
		starred: false,
		tone: "from-cyan-500 to-teal-500"
	},
	{
		name: "Northwind Analytics",
		stack: ["ClickHouse", "Remix"],
		progress: 91,
		health: 99,
		updated: "10m ago",
		starred: true,
		tone: "from-purple-500 to-cyan-400"
	}
];
function ProjectsPage() {
	const { user } = useAuth();
	const [agentLogs, setAgentLogs] = (0, import_react.useState)([]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [showBetaNotice, setShowBetaNotice] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user?.id) loadAgentLogs();
	}, [user?.id]);
	const loadAgentLogs = async () => {
		try {
			const { data } = await supabase.from("agent_execution_logs").select("*").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(5);
			if (data) setAgentLogs(data);
		} catch (err) {
			console.warn("Could not fetch agent logs:", err);
		}
	};
	const filteredProjects = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return PROJECTS;
		const q = searchQuery.toLowerCase();
		return PROJECTS.filter((p) => p.name.toLowerCase().includes(q) || p.stack.some((s) => s.toLowerCase().includes(q)));
	}, [searchQuery]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			title: "Projects & Health Dashboard",
			subtitle: `${PROJECTS.length} active projects · Multi-Agent Intelligence Monitored`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowBetaNotice(true),
				className: "hidden items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 sm:flex",
				"aria-label": "Create new project",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "h-4 w-4",
					"aria-hidden": true
				}), " New Project"]
			})
		}),
		showBetaNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
			className: "border border-purple-500/25 bg-purple-500/5 mb-6 p-4",
			hover: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-6 w-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-foreground",
						children: "Closed Beta Slot Constraint"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground mt-1 leading-relaxed",
						children: "Multiple active workspaces are locked in this beta release. All AI code generation, preview, and git commits operate on your primary project workspace slot."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowBetaNotice(false),
					className: "text-[10px] font-semibold text-muted-foreground hover:text-foreground shrink-0",
					children: "Dismiss"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			glow: true,
			className: "mb-6 border border-purple-500/30 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-base font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MAXCES Platform Health & Agent Status" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 font-semibold flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " 98% Optimal"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-5 gap-3 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase font-semibold",
							children: "UI / UX Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold text-purple-300 mt-1",
							children: "95/100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase font-semibold",
							children: "Performance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold text-cyan-300 mt-1",
							children: "92/100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase font-semibold",
							children: "SEO Rating"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold text-emerald-300 mt-1",
							children: "90/100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase font-semibold",
							children: "Security Level"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold text-pink-300 mt-1",
							children: "98/100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/5 p-3 col-span-2 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground uppercase font-semibold",
							children: "Code Quality"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold text-indigo-300 mt-1",
							children: "96/100"
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
			hover: false,
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm min-w-[220px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: "Search active projects…",
						className: "flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4" }), " Filters"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-6",
			children: filteredProjects.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: i * .05 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "group h-full p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `relative h-32 overflow-hidden rounded-t-2xl bg-gradient-to-br ${p.tone}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur bg-black/30 text-amber-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 ${p.starred ? "fill-amber-400" : ""}` })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-3 left-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] uppercase tracking-[0.2em] text-white/80",
								children: ["Updated ", p.updated]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold text-foreground",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, { value: p.health })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: p.stack.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground",
									children: t
								}, t))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex justify-between text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-foreground",
										children: [p.progress, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 overflow-hidden rounded-full bg-white/5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full rounded-full bg-gradient-to-r ${p.tone}`,
										style: { width: `${p.progress}%` }
									})
								})]
							})
						]
					})]
				})
			}, p.name))
		}),
		agentLogs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			hover: false,
			className: "p-5 border border-purple-500/20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 text-sm font-semibold flex items-center gap-2 text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recent Multi-Agent Execution Audit Stream" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: agentLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-300",
							children: [log.agent_name, " Agent"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: log.task_summary
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-muted-foreground text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(log.created_at).toLocaleTimeString() })]
					})]
				}, log.id))
			})]
		})
	] });
}
function ProgressRing({ value }) {
	const r = 18;
	const c = 2 * Math.PI * r;
	const off = c - value / 100 * c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid h-12 w-12 place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "absolute inset-0",
			viewBox: "0 0 44 44",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "22",
					cy: "22",
					r,
					stroke: "rgba(255,255,255,0.1)",
					strokeWidth: "3",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "22",
					cy: "22",
					r,
					stroke: "url(#ring)",
					strokeWidth: "3",
					fill: "none",
					strokeDasharray: c,
					strokeDashoffset: off,
					strokeLinecap: "round",
					transform: "rotate(-90 22 22)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "ring",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "#a855f7"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "#06b6d4"
					})]
				}) })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] font-semibold text-foreground",
			children: value
		})]
	});
}
//#endregion
export { ProjectsPage as component };
