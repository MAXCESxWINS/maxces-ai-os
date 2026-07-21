import { o as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./_ssr/useAuth-CJtFg47a.mjs";
import { t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as Palette, Y as Grid3x3, g as Sparkles, lt as Eye, o as Type, t as Zap, wt as CircleAlert } from "./_libs/lucide-react.mjs";
import { t as TopBar } from "./_ssr/TopBar-COxNCqmT.mjs";
import { a as PageContainer, t as EmptyState } from "./_ssr/Primitives-dumi-uj1.mjs";
import { n as WorkspaceEngine, t as ProjectHealthEngine } from "./_ssr/workspace-CSqEQi1z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.ui-review-DMX05Egk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UIReviewPage() {
	const { user } = useAuth();
	const [files, setFiles] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const mockProjectId = "p1-maxces-app";
	(0, import_react.useEffect)(() => {
		if (user?.id) WorkspaceEngine.getProjectFiles({
			userId: user.id,
			projectId: mockProjectId
		}).then((res) => {
			setFiles(res);
		}).catch((err) => {
			console.error("Failed to load workspace files for UI review:", err);
		}).finally(() => {
			setIsLoading(false);
		});
		else setIsLoading(false);
	}, [user]);
	const healthReport = (0, import_react.useMemo)(() => {
		if (files.length === 0) return null;
		return ProjectHealthEngine.generateUnifiedHealthReport(files, "MAXCES Workspace Project");
	}, [files]);
	const scores = (0, import_react.useMemo)(() => {
		if (!healthReport) return [];
		const js = healthReport.judgeReport.scores;
		return [
			{
				label: "Typography",
				value: js.uiUxScore - 2,
				icon: Type
			},
			{
				label: "Spacing",
				value: js.maintainabilityScore - 5,
				icon: Grid3x3
			},
			{
				label: "Color Palette",
				value: js.uiUxScore,
				icon: Palette
			},
			{
				label: "Motion",
				value: js.animationScore,
				icon: Zap
			},
			{
				label: "Accessibility",
				value: js.accessibilityScore,
				icon: Eye
			}
		];
	}, [healthReport]);
	const grade = (0, import_react.useMemo)(() => {
		if (!healthReport) return "N/A";
		const score = healthReport.overallHealthScore;
		if (score >= 95) return "A+";
		if (score >= 90) return "A";
		if (score >= 85) return "A-";
		if (score >= 80) return "B+";
		if (score >= 75) return "B";
		if (score >= 70) return "C";
		return "D";
	}, [healthReport]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
		title: "UI Review",
		subtitle: "Loading design intelligence scores..."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader2$1, { className: "h-8 w-8 animate-spin text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground shimmer-text",
			children: "Analyzing component structure and auditing spacing..."
		})]
	})] });
	if (files.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
		title: "UI Review",
		subtitle: "Automated Design Quality Audit"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-6 w-6 text-purple-400" }),
		title: "No analysis available yet",
		description: "We found no files in your active workspace. Generate a website in the Code Builder first to run design audits.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/code-builder",
			className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:scale-105 transition-transform",
			children: "Go to Code Builder"
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
		title: "UI Review",
		subtitle: "Automated design review based on active workspace component files"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			hover: false,
			className: "p-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-[320px] bg-gradient-to-br from-primary/10 via-black to-secondary/5 border-b border-white/5 flex items-center justify-center p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-32 rounded bg-purple-400/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-purple-400/80 uppercase font-bold tracking-wider",
								children: "Active Workspace"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-full rounded bg-white/10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-3/4 rounded bg-white/10" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex flex-wrap gap-2",
							children: [files.slice(0, 3).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9.5px] font-mono rounded bg-white/5 border border-white/8 px-2 py-0.5 text-muted-foreground",
								children: f.file_path.split("/").pop()
							}, f.id)), files.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[9.5px] font-mono rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-purple-300",
								children: [
									"+",
									files.length - 3,
									" more"
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur",
					children: "Workspace Blueprint"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: "Overall Rating"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-4xl font-semibold tracking-tight text-foreground",
						children: grade
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-semibold text-gradient",
							children: healthReport?.overallHealthScore
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Composite health score"
						})]
					})]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [scores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "p-4",
				hover: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4 text-cyan-glow" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold text-foreground",
								children: [s.value, "/100"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-1.5 overflow-hidden rounded-full bg-white/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-primary to-cyan-glow",
								style: { width: `${s.value}%` }
							})
						})]
					})]
				})
			}, s.label)), healthReport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				hover: false,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-cyan-glow" }), " Cortex Audit Notes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-xs text-muted-foreground leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						healthReport.judgeReport.founderExplanation.whatWeBuilt,
						" ",
						healthReport.judgeReport.founderExplanation.whyItMatters
					] }), healthReport.unifiedRecommendations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-white/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-foreground mb-1.5",
							children: "Recommendations:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "list-disc pl-4 space-y-1",
							children: healthReport.unifiedRecommendations.map((rec, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: rec }, idx))
						})]
					})]
				})]
			})]
		})]
	})] });
}
function Loader2$1({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 24 24",
		className: `animate-spin ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "10",
			stroke: "currentColor",
			strokeWidth: "4",
			className: "opacity-25"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
			className: "opacity-75"
		})]
	});
}
//#endregion
export { UIReviewPage as component };
