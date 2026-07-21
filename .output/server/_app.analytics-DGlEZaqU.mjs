import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { I as Lock } from "./_libs/lucide-react.mjs";
import { t as TopBar } from "./_ssr/TopBar-COxNCqmT.mjs";
import { a as PageContainer } from "./_ssr/Primitives-dumi-uj1.mjs";
import { a as YAxis, d as Pie, f as Cell, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.analytics-DGlEZaqU.js
var import_jsx_runtime = require_jsx_runtime();
var hours = Array.from({ length: 12 }).map((_, i) => ({
	w: `W${i + 1}`,
	h: 20 + Math.round(Math.sin(i) * 8 + i * 2)
}));
var ai = Array.from({ length: 14 }).map((_, i) => ({
	d: i + 1,
	req: 100 + Math.round(Math.random() * 300)
}));
var share = [
	{
		name: "Chat",
		value: 46,
		fill: "oklch(0.55 0.24 295)"
	},
	{
		name: "Code",
		value: 24,
		fill: "oklch(0.65 0.22 260)"
	},
	{
		name: "Review",
		value: 18,
		fill: "oklch(0.82 0.15 210)"
	},
	{
		name: "Prompt",
		value: 12,
		fill: "oklch(0.72 0.17 155)"
	}
];
function AnalyticsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			title: "Analytics",
			subtitle: "What your last 90 days look like"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
			className: "border border-purple-500/20 bg-purple-500/5 mb-6 p-4",
			hover: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-5 w-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 mt-0.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold text-foreground",
					children: "Closed Beta Preview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground mt-0.5 leading-relaxed",
					children: "Analytics metrics and charts are currently generated from simulated workspace usage datasets. Full integration with Stripe, Segment, and Google Analytics adapters will be available in a future Beta update."
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-4",
			children: [
				{
					l: "Coding hours",
					v: "312h",
					d: "+22h"
				},
				{
					l: "Projects shipped",
					v: "9",
					d: "+3"
				},
				{
					l: "AI requests",
					v: "18.4K",
					d: "+41%"
				},
				{
					l: "Focus streak",
					v: "42d",
					d: "New record"
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
					children: s.l
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-3xl font-semibold",
					children: s.v
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs text-success",
					children: s.d
				})
			] }, s.l))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xl font-semibold",
						children: "AI usage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 text-xs text-muted-foreground",
						children: "Requests per day, last 14 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: ai,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "ai-grad",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "oklch(0.82 0.15 210)",
											stopOpacity: .6
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "oklch(0.82 0.15 210)",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(1 0 0 / 6%)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "d",
										tickLine: false,
										axisLine: false,
										tick: {
											fill: "oklch(0.68 0.02 260)",
											fontSize: 11
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tickLine: false,
										axisLine: false,
										tick: {
											fill: "oklch(0.68 0.02 260)",
											fontSize: 11
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "oklch(0.1 0.014 280 / 95%)",
										border: "1px solid oklch(1 0 0 / 10%)",
										borderRadius: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "req",
										stroke: "oklch(0.82 0.15 210)",
										strokeWidth: 2.5,
										fill: "url(#ai-grad)"
									})
								]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-xl font-semibold",
					children: "Time by surface"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 text-xs text-muted-foreground",
					children: "Where you spend attention"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: share,
							innerRadius: 50,
							outerRadius: 80,
							paddingAngle: 4,
							dataKey: "value",
							children: share.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								fill: s.fill,
								stroke: "transparent"
							}, s.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "oklch(0.1 0.014 280 / 95%)",
							border: "1px solid oklch(1 0 0 / 10%)",
							borderRadius: 12
						} })] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-2 gap-2 text-xs",
					children: share.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 w-2 rounded-full",
								style: { background: s.fill }
							}),
							" ",
							s.name,
							" · ",
							s.value,
							"%"
						]
					}, s.name))
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-xl font-semibold",
					children: "Deep-work hours"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 text-xs text-muted-foreground",
					children: "Weekly, last quarter"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: hours,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(1 0 0 / 6%)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "w",
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "oklch(0.68 0.02 260)",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "oklch(0.68 0.02 260)",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "oklch(0.1 0.014 280 / 95%)",
									border: "1px solid oklch(1 0 0 / 10%)",
									borderRadius: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "h",
									fill: "oklch(0.55 0.24 295)",
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						})
					})
				})
			] })
		})
	] });
}
//#endregion
export { AnalyticsPage as component };
