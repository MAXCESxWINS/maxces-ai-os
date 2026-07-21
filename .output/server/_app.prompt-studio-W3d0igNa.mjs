import { o as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { D as Play, Dt as Check, J as Heart, L as LoaderCircle, g as Sparkles, n as WandSparkles, pt as Copy } from "./_libs/lucide-react.mjs";
import { t as TopBar } from "./_ssr/TopBar-COxNCqmT.mjs";
import { a as PageContainer } from "./_ssr/Primitives-dumi-uj1.mjs";
import { t as GeminiAIEngine } from "./_ssr/gemini-DGMQKfL-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.prompt-studio-W3d0igNa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATES = [
	{
		name: "Sales email · v3",
		cat: "Marketing",
		uses: 128,
		prompt: `You are MAXCES, an elite sales copywriter.
Task: Write a cold sales email for a premium product.

Product: [Enter your product name]
Target Audience: [Enter your target audience]

Rule: Keep it under 150 words. Avoid generic phrases like "I hope this email finds you well". Focus on a clear value proposition and a low-friction call-to-action.`
	},
	{
		name: "Bug triage prompt",
		cat: "Engineering",
		uses: 89,
		prompt: `You are a senior QA engineer. Analyze the following bug report:

Bug: [Enter bug details]
Environment: [Enter environment details]

Task: Provide a severity rating (Critical, High, Medium, Low), a root-cause hypothesis, and the exact steps to reproduce or fix.`
	},
	{
		name: "Design critique",
		cat: "Design",
		uses: 62,
		prompt: `You are a principal UI/UX designer. Critique the following component design:

Component: [Enter component name or description]
Aspects to evaluate: Typography, Spacing, Color contrast.

Task: Provide 3 actionable aesthetic improvements matching Stripe/Linear style.`
	},
	{
		name: "SQL to English",
		cat: "Data",
		uses: 218,
		prompt: `Translate the following SQL query into plain, non-technical English:

SELECT u.email, COUNT(p.id) as projects_count
FROM users u
LEFT JOIN projects p ON p.user_id = u.id
WHERE u.status = 'active'
GROUP BY u.email
HAVING COUNT(p.id) > 5;

Explain: What tables are queried, what filters are applied, and what the final output contains.`
	},
	{
		name: "Investor update",
		cat: "Business",
		uses: 26,
		prompt: `You are a startup founder. Write a concise monthly investor update.

Key wins: [Enter key wins]
Key metrics: [Enter key metrics]

Task: Highlight progress, mention runway, and end with a specific ask.`
	}
];
function PromptStudioPage() {
	const [selectedIdx, setSelectedIdx] = (0, import_react.useState)(0);
	const [promptContent, setPromptContent] = (0, import_react.useState)(TEMPLATES[0].prompt);
	const [output, setOutput] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [liked, setLiked] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		setPromptContent(TEMPLATES[selectedIdx].prompt);
	}, [selectedIdx]);
	const handleRun = async () => {
		if (!promptContent.trim()) return;
		setIsLoading(true);
		setOutput("");
		try {
			const res = await GeminiAIEngine.generateContent({
				prompt: promptContent,
				systemInstruction: "You are an expert AI prompt engineer assistant. Execute the prompt given by the user carefully and provide a premium, highly formatted output."
			});
			setOutput(res.text);
		} catch (err) {
			setOutput(`⚠️ **Execution Error**: ${err?.message || "Failed to run prompt"}`);
		} finally {
			setIsLoading(false);
		}
	};
	const handleCopy = () => {
		const textToCopy = output || promptContent;
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const toggleLike = (idx) => {
		setLiked((prev) => ({
			...prev,
			[idx]: !prev[idx]
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
		title: "Prompt Studio",
		subtitle: "Craft and execute prompts with real AI integration"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			className: "h-fit",
			hover: false,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-sm font-semibold text-foreground",
					children: "Library"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
					children: "Templates"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					role: "listbox",
					"aria-label": "Prompt Templates",
					children: TEMPLATES.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						role: "option",
						"aria-selected": selectedIdx === i,
						className: `group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${selectedIdx === i ? "bg-primary/15 text-foreground ring-1 ring-inset ring-primary/30" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`,
						onClick: () => setSelectedIdx(i),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium truncate",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground/70",
								children: [
									t.cat,
									" · ",
									t.uses,
									" runs"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: (e) => {
								e.stopPropagation();
								toggleLike(i);
							},
							"aria-label": liked[i] ? "Remove from favorites" : "Add to favorites",
							className: "p-1 rounded-lg hover:bg-white/10 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${liked[i] ? "text-red-500 fill-red-500" : ""}` })
						})]
					}, t.name))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			hover: false,
			className: "p-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-white/5 px-5 py-4 bg-white/[0.01]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4 text-cyan-glow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: TEMPLATES[selectedIdx].name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-medium text-purple-300",
							children: TEMPLATES[selectedIdx].cat
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleCopy,
						className: "flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors",
						"aria-label": "Copy prompt or output",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copied!" : "Copy"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleRun,
						disabled: isLoading || !promptContent.trim(),
						className: "flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50 hover:scale-[1.02] transition-transform",
						"aria-label": "Run prompt with Gemini",
						children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 fill-current" }), isLoading ? "Running…" : "Run"]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 p-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "prompt-textarea",
						className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2",
						children: "Prompt Editor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "prompt-textarea",
						value: promptContent,
						onChange: (e) => setPromptContent(e.target.value),
						placeholder: "Write your prompt strategy here...",
						className: "flex-1 min-h-[300px] rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-foreground/90 placeholder:text-muted-foreground/30 outline-none focus:border-purple-500/60 transition-all resize-y"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-cyan-glow" }), " Output Preview"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 min-h-[300px] rounded-xl border border-white/10 bg-white/[0.02] p-4 overflow-y-auto max-h-[500px]",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center h-full text-center py-10 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground shimmer-text",
								children: "Executing prompt with real-time Gemini pipeline..."
							})]
						}) : output ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: "text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap prose prose-invert",
							children: output
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center h-full text-center py-10 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-8 w-8 text-white/10 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs",
								children: "Click 'Run' to generate live AI response output."
							})]
						})
					})]
				})]
			})]
		})]
	})] });
}
//#endregion
export { PromptStudioPage as component };
