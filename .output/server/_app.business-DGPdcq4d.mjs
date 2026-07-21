import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { Ft as ArrowDown, I as Lock, Mt as ArrowUp, f as Target, l as TrendingUp, z as Lightbulb } from "./_libs/lucide-react.mjs";
import { t as TopBar } from "./_ssr/TopBar-COxNCqmT.mjs";
import { a as PageContainer } from "./_ssr/Primitives-dumi-uj1.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.business-DGPdcq4d.js
var import_jsx_runtime = require_jsx_runtime();
var revenue = [
	{
		m: "Jan",
		you: 24,
		comp: 22
	},
	{
		m: "Feb",
		you: 32,
		comp: 25
	},
	{
		m: "Mar",
		you: 41,
		comp: 31
	},
	{
		m: "Apr",
		you: 48,
		comp: 34
	},
	{
		m: "May",
		you: 56,
		comp: 38
	},
	{
		m: "Jun",
		you: 71,
		comp: 44
	},
	{
		m: "Jul",
		you: 89,
		comp: 52
	}
];
var pros = [
	"Loyal power-users",
	"Fast release cadence",
	"Distinctive design",
	"Zero-config UX"
];
var cons = [
	"Small team",
	"No enterprise SSO yet",
	"Docs coverage 62%",
	"Limited integrations"
];
var ideas = [
	{
		t: "Team seats + billing",
		impact: 9,
		effort: 6
	},
	{
		t: "Weekly digest email",
		impact: 6,
		effort: 3
	},
	{
		t: "SSO / SCIM",
		impact: 8,
		effort: 8
	},
	{
		t: "Public API",
		impact: 7,
		effort: 7
	}
];
function BusinessPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			title: "Business",
			subtitle: "Your operating picture"
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
					children: "Business intelligence indicators, charts, and metrics are currently generated from simulated startup financial datasets. Full integration with Stripe and database billing schemas will be available in a future Beta update."
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-4",
			children: [
				{
					l: "MRR",
					v: "$89.4K",
					d: "+18%",
					up: true
				},
				{
					l: "Active users",
					v: "12,481",
					d: "+9%",
					up: true
				},
				{
					l: "Churn",
					v: "2.1%",
					d: "-0.4%",
					up: true
				},
				{
					l: "NPS",
					v: "62",
					d: "-3",
					up: false
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-1 inline-flex items-center gap-1 text-xs ${s.up ? "text-success" : "text-warning"}`,
					children: [
						s.up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3 w-3" }),
						" ",
						s.d
					]
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
						children: "You vs. Competitor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 text-xs text-muted-foreground",
						children: "Monthly revenue, thousands USD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: revenue,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(1 0 0 / 6%)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "m",
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "comp",
										stroke: "oklch(0.5 0.02 260)",
										strokeWidth: 2,
										dot: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "you",
										stroke: "oklch(0.55 0.24 295)",
										strokeWidth: 3,
										dot: {
											fill: "oklch(0.82 0.15 210)",
											r: 4
										}
									})
								]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-xl font-semibold",
				children: "Pros / Cons"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-success",
					children: "Pros"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: pros.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg border border-success/20 bg-success/5 px-2.5 py-1.5 text-foreground/90",
						children: p
					}, p))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-destructive",
					children: "Cons"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: cons.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg border border-destructive/20 bg-destructive/5 px-2.5 py-1.5 text-foreground/90",
						children: c
					}, c))
				})] })]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-2 text-xl font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-cyan-glow" }), " Priority matrix"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 text-xs text-muted-foreground",
						children: "Impact vs. effort"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: ideas,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(1 0 0 / 6%)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "t",
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
										dataKey: "impact",
										fill: "oklch(0.55 0.24 295)",
										radius: [
											6,
											6,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "effort",
										fill: "oklch(0.82 0.15 210)",
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
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2 text-xl font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 text-cyan-glow" }), " Growth ideas"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: [
					"Launch Product Hunt Sept 12",
					"Design partner beta w/ 5 studios",
					"Weekly retention teardown video",
					"Bundle w/ Cortex API"
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: i
					})]
				}, i))
			})] })]
		})
	] });
}
//#endregion
export { BusinessPage as component };
