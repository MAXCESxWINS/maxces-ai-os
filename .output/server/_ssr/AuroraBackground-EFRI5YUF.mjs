import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuroraBackground-EFRI5YUF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Ambient aurora + particle background. Pure decorative layer.
* Mouse-reactive glow follows cursor with soft lag.
*/
function AuroraBackground() {
	const glowRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		let tx = 0, ty = 0, cx = 0, cy = 0;
		const onMove = (e) => {
			tx = e.clientX;
			ty = e.clientY;
		};
		const tick = () => {
			cx += (tx - cx) * .08;
			cy += (ty - cy) * .08;
			if (glowRef.current) glowRef.current.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
			raf = requestAnimationFrame(tick);
		};
		window.addEventListener("mousemove", onMove);
		raf = requestAnimationFrame(tick);
		return () => {
			window.removeEventListener("mousemove", onMove);
			cancelAnimationFrame(raf);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden noise",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -top-40 -left-40 h-[60rem] w-[60rem] rounded-full opacity-60 blur-3xl animate-aurora",
				style: { background: "radial-gradient(closest-side, oklch(0.55 0.24 295 / 55%), transparent 70%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1/3 -right-40 h-[50rem] w-[50rem] rounded-full opacity-50 blur-3xl animate-aurora",
				style: {
					background: "radial-gradient(closest-side, oklch(0.65 0.22 260 / 50%), transparent 70%)",
					animationDelay: "-8s"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-40 left-1/3 h-[55rem] w-[55rem] rounded-full opacity-40 blur-3xl animate-aurora",
				style: {
					background: "radial-gradient(closest-side, oklch(0.82 0.15 210 / 40%), transparent 70%)",
					animationDelay: "-14s"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-[0.05]",
				style: {
					backgroundImage: "linear-gradient(oklch(1 0 0 / 100%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 100%) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
				}
			}),
			Array.from({ length: 22 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute rounded-full bg-white/60 animate-float-slow",
				style: {
					width: `${1 + i % 3}px`,
					height: `${1 + i % 3}px`,
					left: `${i * 47 % 100}%`,
					top: `${i * 73 % 100}%`,
					opacity: .2 + i % 5 * .08,
					animationDelay: `${i % 7 * .8}s`,
					animationDuration: `${5 + i % 6}s`,
					filter: "blur(0.5px)"
				}
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: glowRef,
				className: "absolute h-[600px] w-[600px] rounded-full opacity-40 blur-3xl transition-transform",
				style: { background: "radial-gradient(closest-side, oklch(0.55 0.24 295 / 40%), transparent 70%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" })
		]
	});
}
//#endregion
export { AuroraBackground as t };
