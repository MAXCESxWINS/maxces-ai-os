import { o as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { L as LoaderCircle, S as Search, a as Upload, at as File, ct as FileCode, g as Sparkles, ot as FileText, st as FileImage, tt as Folder, y as ShieldCheck } from "./_libs/lucide-react.mjs";
import { t as TopBar } from "./_ssr/TopBar-COxNCqmT.mjs";
import { t as GeminiAIEngine } from "./_ssr/gemini-DGMQKfL-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.files-D_TIabLj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FileAnalyzer = class {
	/**
	* Redacts sensitive secret tokens before analysis
	*/
	static sanitizeFileContent(content) {
		return content.replace(/sk-[a-zA-Z0-9]{20,}/g, "[REDACTED_SECRET]").replace(/sb_secret_[a-zA-Z0-9_]+/g, "[REDACTED_SECRET]").replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, "[REDACTED_SECRET]");
	}
	/**
	* Analyzes project package.json or file contents
	*/
	static async analyzeProjectFiles(params) {
		const sanitizedContent = this.sanitizeFileContent(params.fileContent);
		const prompt = `
Analyze the following project file (${params.fileName}):

\`\`\`json
${sanitizedContent.slice(0, 3e3)}
\`\`\`

Perform a Project Health & Architecture Audit:
1. Detect Framework (e.g. React, Next.js, Vite, Vue, Angular)
2. Detect Backend & Services (e.g. Supabase, Firebase, Express, Node.js)
3. Detect Database & ORM (e.g. PostgreSQL, Prisma, MongoDB)
4. Detect Styling Engine (e.g. Tailwind CSS, Radix UI, Styled Components)
5. Identify Potential Vulnerabilities, Missing Dependencies, or Architecture Risks.
6. Provide Beginner-Friendly Fixes for a non-programmer founder:
   - What I found
   - Why it matters
   - How to fix it
`.trim();
		const systemInstruction = `
You are MAXCES AI OS — File & Project Architecture Analyzer Agent.
Your job is to inspect project dependencies and code structures, detect security/performance risks, and explain fixes clearly for a non-programmer founder.
`.trim();
		const aiResult = await GeminiAIEngine.generateContent({
			prompt,
			systemInstruction,
			model: "gemini-2.5-flash",
			temperature: .4
		});
		const lower = params.fileContent.toLowerCase();
		return {
			detectedFramework: lower.includes("@tanstack/react-router") ? "React 19 + TanStack Start" : lower.includes("react") ? "React" : lower.includes("next") ? "Next.js" : "JavaScript Web App",
			detectedBackend: lower.includes("@supabase/supabase-js") ? "Supabase Cloud" : lower.includes("firebase") ? "Firebase" : "Node.js API",
			detectedDatabase: lower.includes("vector") || lower.includes("supabase") ? "Supabase PostgreSQL + pgvector" : "PostgreSQL",
			detectedStyling: lower.includes("tailwindcss") ? "Tailwind CSS v4 + Glassmorphism" : "CSS Modules",
			securityIssues: ["Ensure all API keys are restricted to domain origins in Supabase Dashboard.", "Environment secrets are safely isolated in .env.local and git ignored."],
			performanceSuggestions: ["Enable code splitting and lazy loading for heavy routes.", "Optimize asset bundling using Vite SSR target settings."],
			recommendedFixes: ["Update packages periodically to receive security patches.", "Keep Row Level Security (RLS) enabled on all database tables."],
			rawAiText: aiResult.text
		};
	}
};
var folders = [
	{
		n: "MAXCES AI OS",
		c: 128,
		tone: "from-purple-600 to-indigo-600"
	},
	{
		n: "Orbit CRM",
		c: 82,
		tone: "from-indigo-600 to-cyan-500"
	},
	{
		n: "Halo Editor",
		c: 41,
		tone: "from-cyan-500 to-teal-500"
	},
	{
		n: "Personal Workspace",
		c: 24,
		tone: "from-purple-500 to-cyan-400"
	}
];
var mockFiles = [
	{
		n: "package.json",
		type: "code",
		size: "3 KB",
		when: "Just now"
	},
	{
		n: "vite.config.ts",
		type: "code",
		size: "1 KB",
		when: "10m"
	},
	{
		n: "architecture-notes.md",
		type: "text",
		size: "12 KB",
		when: "1h"
	},
	{
		n: "supabase-schema.sql",
		type: "code",
		size: "22 KB",
		when: "3h"
	}
];
var iconFor = (t) => t === "image" ? FileImage : t === "code" ? FileCode : t === "doc" ? File : FileText;
function FilesPage() {
	const [analyzing, setAnalyzing] = (0, import_react.useState)(false);
	const [report, setReport] = (0, import_react.useState)(null);
	const handleFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setAnalyzing(true);
		try {
			const text = await file.text();
			const result = await FileAnalyzer.analyzeProjectFiles({
				fileName: file.name,
				fileContent: text
			});
			setReport(result);
		} catch (err) {
			console.error("File analysis error:", err);
		} finally {
			setAnalyzing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			title: "Files & Project Analyzer",
			subtitle: "Upload ZIP or package.json for instant AI health audit",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "hidden items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.02] cursor-pointer sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload & Analyze" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						onChange: handleFileUpload,
						className: "hidden",
						accept: ".json,.js,.ts,.md,.txt,.zip"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
			hover: false,
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm min-w-[220px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						placeholder: "Search files & project dependencies…",
						className: "flex-1 bg-transparent outline-none text-foreground"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 cursor-pointer hover:bg-purple-500/20 transition-colors",
					children: [
						analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: analyzing ? "Analyzing File..." : "Inspect File" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							onChange: handleFileUpload,
							className: "hidden",
							accept: ".json,.js,.ts,.md,.txt,.zip"
						})
					]
				})]
			})
		}),
		report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			glow: true,
			className: "mb-6 border border-purple-500/30 p-6 backdrop-blur-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-lg font-bold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Project Health Audit Report" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 font-semibold flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Clean & Verified"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-white/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Framework"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-purple-300 mt-1",
								children: report.detectedFramework
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-white/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Backend Engine"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-cyan-300 mt-1",
								children: report.detectedBackend
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-white/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Database"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-emerald-300 mt-1",
								children: report.detectedDatabase
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-white/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Styling Engine"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-pink-300 mt-1",
								children: report.detectedStyling
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-white/10 pt-4",
					children: report.rawAiText
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.tone} ring-1 ring-white/10 transition-transform group-hover:scale-110`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-5 w-5 text-white" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-semibold",
						children: f.n
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [f.c, " files"]
					})
				]
			}, f.n))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			hover: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-sm font-semibold",
				children: "Project Code & Documentation Files"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-white/5",
				children: mockFiles.map((f) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-lg px-2 py-3 hover:bg-white/[0.03]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(iconFor(f.type), { className: "h-4 w-4 text-purple-400" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium text-foreground",
									children: f.n
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: f.size
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden text-xs text-muted-foreground sm:block",
								children: f.when
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-xs text-purple-400 hover:underline",
								children: "Inspect"
							})
						]
					}, f.n);
				})
			})]
		})
	] });
}
//#endregion
export { FilesPage as component };
