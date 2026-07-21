import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as Search, jt as Bell, t as Zap } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TopBar-COxNCqmT.js
var import_jsx_runtime = require_jsx_runtime();
function TopBar({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pb-6 sm:flex sm:flex-wrap sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80",
				children: ["MAXCES / ", title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
				children: subtitle ?? title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 rounded-full glass px-3.5 py-2 text-sm text-muted-foreground md:flex w-[280px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Search anything, ask MAXCES…",
							className: "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground",
							children: "⌘K"
						})
					]
				}),
				actions,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "relative grid h-10 w-10 place-items-center rounded-full glass transition-transform hover:scale-105",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-glow shadow-[0_0_10px_var(--cyan-glow)]" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), "Upgrade"]
				})
			]
		})]
	});
}
//#endregion
export { TopBar as t };
