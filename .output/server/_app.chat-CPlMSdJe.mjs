import { o as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./_ssr/useAuth-CJtFg47a.mjs";
import { t as motion } from "./_libs/motion.mjs";
import { t as GlassCard } from "./_ssr/GlassCard-IDSc0PTK.mjs";
import { L as LoaderCircle, M as Mic, Mt as ArrowUp, O as Pin, S as Search, T as Plus, g as Sparkles, k as Paperclip, mt as Command, pt as Copy, w as RefreshCw } from "./_libs/lucide-react.mjs";
import { t as TopBar } from "./_ssr/TopBar-COxNCqmT.mjs";
import { n as MemoryEngine, t as AICore } from "./_ssr/memory-B2twZRcz.mjs";
import { t as GeminiAIEngine } from "./_ssr/gemini-DGMQKfL-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.chat-CPlMSdJe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HINGLISH_KEYWORDS = [
	"bhai",
	"kaise",
	"kya",
	"banani",
	"hai",
	"karo",
	"kar",
	"batao",
	"ye",
	"sahi",
	"mujhe",
	"bol",
	"mera",
	"meri",
	"karna",
	"karke",
	"ho",
	"gaya",
	"bana",
	"dikhao"
];
function isHinglishInput(text) {
	const lower = text.toLowerCase();
	return HINGLISH_KEYWORDS.some((kw) => lower.includes(kw));
}
var PromptOrchestrator = class {
	/**
	* Builds the context-infused System Instruction string
	*/
	static buildSystemPrompt(params) {
		const { memories, projectDNA, isHinglish } = params;
		let languageRule = isHinglish ? "The user is communicating in Hinglish (Hindi + English). Respond in natural, friendly, conversational Hinglish while keeping all technical terms, code, framework names, and architectural terms strictly in English." : "Default Language: Clear, professional, non-programmer-friendly English.";
		let memoryContextSection = "";
		if (memories.length > 0) memoryContextSection = `\n--- LONG-TERM MEMORIES & USER PREFERENCES ---\n` + memories.map((m) => `- [${m.category.toUpperCase()}] ${m.content} (Importance: ${m.importance_score}/100)`).join("\n") + `\n---------------------------------------------\n`;
		let projectContextSection = "";
		if (projectDNA) projectContextSection = `\n--- ACTIVE PROJECT DNA: ${projectDNA.name.toUpperCase()} ---\n- Current Phase: ${projectDNA.current_phase}\n- Tech Stack: ${Array.isArray(projectDNA.tech_stack) ? projectDNA.tech_stack.join(", ") : "Not specified"}\n- Architecture Notes: ${projectDNA.architecture_notes || "Standard"}\n- Goals: ${projectDNA.project_goals || "Building production SaaS"}\n-----------------------------------------------\n`;
		return `
You are MAXCES AI OS — an elite personal AI Operating System, CTO, Lead Architect, Product Manager, and Founder Co-Pilot.

--- YOUR CORE PHILOSOPHY & OPERATING RULES ---
1. NON-PROGRAMMER FRIENDLY: The user is a founder and product owner, not a traditional developer. Never assume they know complex syntax. Always explain "What we are doing", "Why we are doing it", and "What can go wrong" before providing solution options.
2. TONE & LANGUAGE: ${languageRule} Be calm, respectful, encouraging, highly strategic, and practical.
3. 7-STAGE CTO THINKING PIPELINE:
   - Understand: Identify the true user goal and experience level.
   - Challenge & Protect: Respectfully challenge bad ideas, security risks, or unscalable decisions. Offer safer/better alternatives.
   - Option Generation: Present Option A (Fast & Simple) vs Option B (Professional & Scalable) vs Option C (Enterprise).
   - Clear Recommendations: Explain WHY you recommend the best choice.
   - 10x Improvement: Suggest how the user's vision can become 10x better.
4. UI & AESTHETICS: Preserve dark glassmorphism, fluid animations, Radix UI, and clean full-stack architecture principles.

${memoryContextSection}
${projectContextSection}

Execute your response formatted in clean GitHub Markdown with clear headings and bullet points.
`.trim();
	}
	/**
	* Generates a fully orchestrated AI response with automatic memory retrieval and auto-learning
	*/
	static async generateOrchestratedResponse(params) {
		try {
			const isHinglish = params.forceHinglish || isHinglishInput(params.userPrompt);
			const userId = params.userId;
			const projectName = params.projectName || "MAXCES AI OS";
			let memories = [];
			let projectDNA = null;
			if (userId) {
				memories = await MemoryEngine.fetchRelevantMemories({
					userId,
					limit: 10
				});
				projectDNA = await MemoryEngine.getProjectDNA(userId, projectName);
			}
			const systemInstruction = this.buildSystemPrompt({
				memories,
				projectDNA,
				isHinglish
			});
			const aiResponse = await GeminiAIEngine.generateContent({
				prompt: params.userPrompt,
				systemInstruction,
				history: params.conversationHistory,
				model: "gemini-2.5-flash",
				temperature: .7
			});
			if (userId && aiResponse.success && params.userPrompt.length > 15) this.extractAndSaveMemoriesInBackground(userId, params.userPrompt, aiResponse.text);
			return aiResponse;
		} catch (err) {
			console.error("[MAXCES PromptOrchestrator Error]:", err);
			return {
				text: `⚠️ **AI Orchestrator Error**: ${err?.message || "Failed to process request."}`,
				success: false,
				modelUsed: "none",
				error: err?.message
			};
		}
	}
	/**
	* Background Memory Learner (Extracts preferences or choices automatically)
	*/
	static extractAndSaveMemoriesInBackground(userId, userPrompt, aiAnswer) {
		setTimeout(async () => {
			const lowerPrompt = userPrompt.toLowerCase();
			if (lowerPrompt.includes("prefer") || lowerPrompt.includes("always use") || lowerPrompt.includes("my preference")) await MemoryEngine.saveMemory({
				userId,
				content: userPrompt,
				memoryType: "preference",
				category: "personal_preference",
				importanceScore: 85
			});
			else if (lowerPrompt.includes("decided to") || lowerPrompt.includes("we will use")) await MemoryEngine.saveMemory({
				userId,
				content: userPrompt,
				memoryType: "decision",
				category: "technical_choice",
				importanceScore: 90
			});
		}, 100);
	}
};
var AIRouter = class {
	/**
	* Detects user intent and returns a RoutingDecision
	*/
	static detectIntent(prompt, hasAttachedFiles = false) {
		const lower = prompt.toLowerCase();
		if (hasAttachedFiles || lower.includes(".zip") || lower.includes("package.json") || lower.includes("folder structure")) return {
			intent: "file_analysis",
			confidence: .95
		};
		if (lower.includes("http://") || lower.includes("https://") || lower.includes("review website") || lower.includes("audit site") || lower.includes("landing page")) {
			const hasUrl = /https?:\/\/[^\s]+/.test(prompt);
			return {
				intent: "website_review",
				confidence: hasUrl ? .95 : .65,
				clarificationNeeded: hasUrl ? void 0 : "Could you please share the URL of the website you would like me to audit?"
			};
		}
		if (lower.includes("error") || lower.includes("bug") || lower.includes("code") || lower.includes("react") || lower.includes("typescript") || lower.includes("component") || lower.includes("build failed") || lower.includes("npm") || lower.includes("fix")) return {
			intent: "coding",
			confidence: .9
		};
		if (lower.includes("saas") || lower.includes("pricing") || lower.includes("monetize") || lower.includes("business") || lower.includes("startup") || lower.includes("growth") || lower.includes("idea") || lower.includes("competitor")) return {
			intent: "business",
			confidence: .85
		};
		if (lower.includes("explain") || lower.includes("what is") || lower.includes("how does") || lower.includes("teach me") || lower.includes("beginner")) return {
			intent: "learning",
			confidence: .85
		};
		if (lower.includes("research") || lower.includes("compare") || lower.includes("documentation") || lower.includes("latest version")) return {
			intent: "research",
			confidence: .8
		};
		return {
			intent: "general",
			confidence: .8
		};
	}
	/**
	* Routes the user request to the optimal agent and generates an orchestrated response
	*/
	static async routeAndExecute(params) {
		const { intent, confidence, clarificationNeeded } = this.detectIntent(params.userPrompt, params.hasAttachedFiles);
		if (confidence < .7 && clarificationNeeded) return {
			text: `🔍 **Clarification Request**: ${clarificationNeeded}`,
			success: true,
			modelUsed: "router-clarification"
		};
		return await PromptOrchestrator.generateOrchestratedResponse({
			userId: params.userId,
			userPrompt: `[SUB-AGENT MODE: ${intent.toUpperCase()}]\n${params.userPrompt}`,
			projectName: params.projectName,
			conversationHistory: params.conversationHistory
		});
	}
};
var pinned = [
	"MAXCES AI OS Launch Checklist",
	"Phase 3 Database & Memory Architecture",
	"Supabase & Gemini API Integration"
];
var recent = [
	{
		title: "Core Brain & Memory Layer",
		time: "Just now"
	},
	{
		title: "Layered Authorization Setup",
		time: "1h"
	},
	{
		title: "Supabase RLS Verification",
		time: "3h"
	},
	{
		title: "Lovable UI Integration",
		time: "Yesterday"
	},
	{
		title: "Project DNA Schema",
		time: "2d"
	}
];
var suggestions = [
	"Continue MAXCES AI OS development",
	"Explain my project architecture",
	"Audit my current database setup",
	"What is our next step in Phase 3?"
];
function ChatPage() {
	const { user } = useAuth();
	const [value, setValue] = (0, import_react.useState)("");
	const [isThinking, setIsThinking] = (0, import_react.useState)(false);
	const [chatMessages, setChatMessages] = (0, import_react.useState)([{
		role: "assistant",
		text: "Good day, Founder. I am MAXCES AI OS — your personal CTO, Lead Developer, and System Architect. I have loaded your long-term memories and project context. How shall we proceed with building today?",
		modelUsed: "gemini-2.5-flash"
	}]);
	const handleSendMessage = async (promptText) => {
		const textToSend = (promptText || value).trim();
		if (!textToSend || isThinking) return;
		const userMsg = {
			role: "user",
			text: textToSend
		};
		setChatMessages((prev) => [...prev, userMsg]);
		setValue("");
		setIsThinking(true);
		try {
			const history = chatMessages.slice(-6).map((m) => ({
				role: m.role === "user" ? "user" : "model",
				parts: [{ text: m.text }]
			}));
			const aiResult = await AIRouter.routeAndExecute({
				userId: user?.id,
				userPrompt: textToSend,
				projectName: "MAXCES AI OS",
				conversationHistory: history
			});
			const assistantMsg = {
				role: "assistant",
				text: aiResult.text,
				modelUsed: aiResult.modelUsed
			};
			setChatMessages((prev) => [...prev, assistantMsg]);
		} catch (err) {
			setChatMessages((prev) => [...prev, {
				role: "assistant",
				text: `⚠️ **System Error**: ${err?.message || "Failed to process prompt."}`
			}]);
		} finally {
			setIsThinking(false);
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};
	const handleNewChat = () => {
		setChatMessages([{
			role: "assistant",
			text: "New session initialized. How can I assist your MAXCES AI OS project?"
		}]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
		title: "AI Chat",
		subtitle: "Cortex Intelligence Engine"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleNewChat,
						className: "mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-transform hover:scale-[1.02]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New Conversation"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Search chats…",
							className: "flex-1 bg-transparent outline-none text-foreground"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
						children: "Pinned Contexts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mb-4 space-y-1",
						children: pinned.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground cursor-pointer transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: p
							})]
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-1 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
						children: "Recent Activity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground cursor-pointer transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: r.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-[10px] text-muted-foreground/60",
								children: r.time
							})]
						}, r.title))
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			className: "flex min-h-[72vh] flex-col p-0",
			hover: false,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-white/5 px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICore, { size: 44 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cortex Intelligence Engine" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] text-purple-300",
								children: "Gemini 2.5 Flash"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_var(--emerald-400)]" }), "Context-Aware · Memory Storage & Project DNA Sync Active"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kbd", {
							className: "rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "mr-1 inline h-3 w-3" }), "K"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6 overflow-y-auto px-6 py-8",
					children: [chatMessages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .2 },
						className: `flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ${m.role === "user" ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white ring-white/10" : "bg-gradient-to-br from-purple-500/30 to-cyan-500/20 ring-purple-500/30"}`,
							children: m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold",
								children: "MX"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-cyan-400" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `max-w-[80%] ${m.role === "user" ? "text-right" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20" : "border border-white/10 bg-white/[0.03] text-foreground/95"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "whitespace-pre-wrap",
									children: m.text
								})
							}), m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => navigator.clipboard.writeText(m.text),
									className: "flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Copy"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleSendMessage(chatMessages[i - 1]?.text),
									className: "flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Regenerate"]
								})]
							})]
						})]
					}, i)), isThinking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/20 ring-1 ring-purple-500/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-cyan-400" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MAXCES AI is retrieving memories & orchestrating CTO response..." })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 border-t border-white/5 px-6 pt-4",
					children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleSendMessage(s),
						disabled: isThinking,
						className: "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-purple-500/40 hover:bg-white/[0.06] hover:text-foreground disabled:opacity-50",
						children: s
					}, s))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative rounded-2xl border border-white/10 bg-white/[0.04] p-2 transition-colors focus-within:border-purple-500/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity group-focus-within:opacity-60",
								style: { background: "linear-gradient(90deg, oklch(0.55 0.24 295 / 40%), oklch(0.82 0.15 210 / 40%))" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value,
								onChange: (e) => setValue(e.target.value),
								onKeyDown: handleKeyDown,
								rows: 2,
								placeholder: "Ask MAXCES anything, or describe what you want to build (Press Enter to send)...",
								className: "w-full resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-2 pb-1 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleSendMessage(),
									disabled: !value.trim() || isThinking,
									className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 disabled:opacity-40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4 w-4" })
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-center text-[10px] text-muted-foreground",
						children: "MAXCES AI OS automatically queries your personal Supabase vector memories and Project DNA."
					})]
				})
			]
		})]
	})] });
}
//#endregion
export { ChatPage as component };
