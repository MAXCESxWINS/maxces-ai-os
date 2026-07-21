import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlassCard-IDSc0PTK.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function GlassCard({ children, className, hover = true, glow = false, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		whileHover: hover ? { y: -3 } : void 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24
		},
		className: cn("relative overflow-hidden rounded-2xl glass p-5", glow && "glow-purple", className),
		...rest,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
		}), children]
	});
}
//#endregion
export { cn as n, GlassCard as t };
