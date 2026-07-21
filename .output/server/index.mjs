globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/arrow-right-5APcyb70.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d-yJzcQGZW+Dw3VsZ5TyxnEBnjY4c\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 157,
		"path": "../public/assets/arrow-right-5APcyb70.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-21T10:50:29.517Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/BarChart-C24a6W9U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ada-EowDwP64jONAfZxbeqXd5wISLKk\"",
		"mtime": "2026-07-21T16:18:58.668Z",
		"size": 6874,
		"path": "../public/assets/BarChart-C24a6W9U.js"
	},
	"/assets/arrow-up-DqFMzDrf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-/OpYh1Moh5Si1P+JSMHKsCIs9/k\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 154,
		"path": "../public/assets/arrow-up-DqFMzDrf.js"
	},
	"/assets/command-5aot2Cuf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-cjHQjlvWlo73BH4J+8qQVo99Ekw\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 174,
		"path": "../public/assets/command-5aot2Cuf.js"
	},
	"/assets/_app-CEnezt_9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28f5-P0W7vBemF1TSqkkdfQrZAfvc8Mo\"",
		"mtime": "2026-07-21T16:18:58.668Z",
		"size": 10485,
		"path": "../public/assets/_app-CEnezt_9.js"
	},
	"/assets/file-text-YLNqtaaR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"179-+IRyQEpekjvat6q1WhiZIqE14q8\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 377,
		"path": "../public/assets/file-text-YLNqtaaR.js"
	},
	"/assets/styles-CpZuK444.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"249fb-qaghe4tme2O3upLx4DC2tTQ8Cqo\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 150011,
		"path": "../public/assets/styles-CpZuK444.css"
	},
	"/assets/_app.files-BwkCoiW9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245c-YVqjS0T3KnZ8NZBygTmRZW1QT40\"",
		"mtime": "2026-07-21T16:18:58.669Z",
		"size": 9308,
		"path": "../public/assets/_app.files-BwkCoiW9.js"
	},
	"/assets/_app.analytics-CuL53h4D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"77c8-27QViL1FGHVkNKLl6k1IdxIlzFs\"",
		"mtime": "2026-07-21T16:18:58.668Z",
		"size": 30664,
		"path": "../public/assets/_app.analytics-CuL53h4D.js"
	},
	"/assets/login-baACI0j-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2690-bjuSJcr8HccJGQe+p2zJpixQ6g4\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 9872,
		"path": "../public/assets/login-baACI0j-.js"
	},
	"/assets/_app.business-D_VyWGdL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42d5-+e5neKhwlixlKuAjeQAoiXaUXtw\"",
		"mtime": "2026-07-21T16:18:58.669Z",
		"size": 17109,
		"path": "../public/assets/_app.business-D_VyWGdL.js"
	},
	"/assets/_app.projects-C7LBfylc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2586-g7uK6foomwJFzWI6o4UkAJs+M/Q\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 9606,
		"path": "../public/assets/_app.projects-C7LBfylc.js"
	},
	"/assets/_app.chat-DWeR19u6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b12-VaCvX/vE7lsesYQ8QxImT5AO5OI\"",
		"mtime": "2026-07-21T16:18:58.669Z",
		"size": 15122,
		"path": "../public/assets/_app.chat-DWeR19u6.js"
	},
	"/assets/_app.ui-review-CUG9RkK2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b11-/5nbXXznN8TtU6ij1b2yoPqiei0\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 6929,
		"path": "../public/assets/_app.ui-review-CUG9RkK2.js"
	},
	"/assets/sparkles-CpkfH9u8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26f1d-n8MfANP2iN8p5IgnHD/3jYj2VgA\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 159517,
		"path": "../public/assets/sparkles-CpkfH9u8.js"
	},
	"/assets/_app.prompt-studio-CYI8CvM5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1db0-kkZYL1pCQCwV8F0JZGZs8+rY4CA\"",
		"mtime": "2026-07-21T16:18:58.670Z",
		"size": 7600,
		"path": "../public/assets/_app.prompt-studio-CYI8CvM5.js"
	},
	"/assets/index-y6jDmtKQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12c0e6-QlDP1gTcUgtOeoCEHCfbinbDcwE\"",
		"mtime": "2026-07-21T16:18:58.668Z",
		"size": 1229030,
		"path": "../public/assets/index-y6jDmtKQ.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_nLqT8b = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_nLqT8b
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
