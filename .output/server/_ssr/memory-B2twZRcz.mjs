import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as supabase } from "./useAuth-CJtFg47a.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as cn } from "./GlassCard-IDSc0PTK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/memory-B2twZRcz.js
var import_jsx_runtime = require_jsx_runtime();
/**
* The floating AI orb — the heart of MAXCES.
* Multiple rotating rings + glow + breathing pulse.
*/
function AICore({ size = 260, className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative grid place-items-center", className),
		style: {
			width: size,
			height: size
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full blur-3xl opacity-70",
				style: {
					width: size * 1.4,
					height: size * 1.4,
					background: "radial-gradient(closest-side, oklch(0.55 0.24 295 / 55%), transparent 70%)"
				}
			}),
			[
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute rounded-full border border-primary/40 animate-pulse-ring",
				style: {
					width: size * .7,
					height: size * .7,
					animationDelay: `${i * 1}s`
				}
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full border border-white/15 animate-orb-rotate-slow",
				style: {
					width: size * .95,
					height: size * .95,
					borderStyle: "dashed"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full border-2 border-transparent animate-orb-rotate-fast",
				style: {
					width: size * .78,
					height: size * .78,
					background: "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.15 210 / 60%) 60deg, transparent 120deg, oklch(0.55 0.24 295 / 70%) 240deg, transparent 300deg)",
					WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
					mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				animate: { scale: [
					1,
					1.03,
					1
				] },
				transition: {
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut"
				},
				className: "relative overflow-hidden rounded-full",
				style: {
					width: size * .5,
					height: size * .5,
					background: "radial-gradient(circle at 30% 25%, oklch(0.85 0.14 260) 0%, oklch(0.55 0.24 295) 40%, oklch(0.18 0.08 285) 100%)",
					boxShadow: "0 0 60px oklch(0.55 0.24 295 / 60%), inset 0 0 60px oklch(0 0 0 / 60%), inset -10px -20px 40px oklch(0 0 0 / 40%)"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute rounded-full bg-white/70 blur-md",
					style: {
						width: "22%",
						height: "18%",
						top: "16%",
						left: "22%"
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-6 rounded-full opacity-70",
					style: { background: "radial-gradient(circle, oklch(0.82 0.15 210 / 60%), transparent 60%)" }
				})]
			}),
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-8 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground",
				children: label
			})
		]
	});
}
/**
* SENSITIVE DATA SCRUBBER
* Prevents saving API keys, secrets, passwords, or tokens into long-term AI memory.
*/
var SENSITIVE_PATTERNS = [
	/sk-[a-zA-Z0-9]{20,}/g,
	/sb_secret_[a-zA-Z0-9_]+/g,
	/sb_publishable_[a-zA-Z0-9_]+/g,
	/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
	/password\s*=\s*['"][^'"]+['"]/gi,
	/api[_-]?key\s*=\s*['"][^'"]+['"]/gi
];
function sanitizeMemoryContent(content) {
	let cleaned = content;
	for (const pattern of SENSITIVE_PATTERNS) cleaned = cleaned.replace(pattern, "[REDACTED_SECRET]");
	return cleaned.trim();
}
/**
* AUTOMATED IMPORTANCE SCORER & CATEGORIZER
*/
function scoreMemory(content, type) {
	let score = 50;
	let confidence = .9;
	const lower = content.toLowerCase();
	if (type === "preference" || lower.includes("prefer") || lower.includes("always use") || lower.includes("design")) {
		score = 85;
		confidence = .95;
	} else if (type === "decision" || lower.includes("decided") || lower.includes("chose") || lower.includes("rule")) {
		score = 90;
		confidence = .95;
	} else if (type === "goal" || lower.includes("goal") || lower.includes("objective")) {
		score = 80;
		confidence = .9;
	} else if (type === "mistake" || lower.includes("error") || lower.includes("bug") || lower.includes("avoid")) {
		score = 75;
		confidence = .85;
	} else if (lower.includes("today") || lower.includes("temp") || lower.includes("testing")) {
		score = 25;
		confidence = .6;
	}
	return {
		score,
		confidence
	};
}
/**
* MEMORY ENGINE SERVICE
*/
var MemoryEngine = class {
	/**
	* 1. Save an important user memory
	*/
	static async saveMemory(params) {
		try {
			const sanitized = sanitizeMemoryContent(params.content);
			if (!sanitized || sanitized.length < 3) return {
				success: false,
				error: "Memory content too short or invalid."
			};
			const memoryType = params.memoryType || "fact";
			const category = params.category || "technical_choice";
			const { score: defaultScore, confidence: defaultConfidence } = scoreMemory(sanitized, memoryType);
			const importanceScore = params.importanceScore ?? defaultScore;
			const confidenceLevel = params.confidenceLevel ?? defaultConfidence;
			const source = params.source || "conversation";
			const { data: existing } = await supabase.from("memories").select("*").eq("user_id", params.userId).eq("content", sanitized).maybeSingle();
			if (existing) {
				const { data: updated } = await supabase.from("memories").update({
					last_used_at: (/* @__PURE__ */ new Date()).toISOString(),
					importance_score: Math.max(existing.importance_score, importanceScore)
				}).eq("id", existing.id).select().single();
				return {
					success: true,
					memory: updated
				};
			}
			const { data: inserted, error } = await supabase.from("memories").insert({
				user_id: params.userId,
				content: sanitized,
				memory_type: memoryType,
				category,
				importance_score: importanceScore,
				confidence_level: confidenceLevel,
				source
			}).select().single();
			if (error) throw error;
			return {
				success: true,
				memory: inserted
			};
		} catch (err) {
			console.error("[MAXCES MemoryEngine] Error saving memory:", err);
			return {
				success: false,
				error: err?.message || "Failed to save memory."
			};
		}
	}
	/**
	* 2. Retrieve relevant memories for context injection
	*/
	static async fetchRelevantMemories(params) {
		try {
			const minImportance = params.minImportance ?? 40;
			const limit = params.limit ?? 15;
			let query = supabase.from("memories").select("*").eq("user_id", params.userId).gte("importance_score", minImportance).order("importance_score", { ascending: false }).order("confidence_level", { ascending: false }).order("last_used_at", { ascending: false }).limit(limit);
			if (params.category) query = query.eq("category", params.category);
			const { data, error } = await query;
			if (error) throw error;
			return data || [];
		} catch (err) {
			console.error("[MAXCES MemoryEngine] Error fetching memories:", err);
			return [];
		}
	}
	/**
	* 3. Delete a memory (User Isolation Enforced)
	*/
	static async deleteMemory(userId, memoryId) {
		try {
			const { error } = await supabase.from("memories").delete().eq("id", memoryId).eq("user_id", userId);
			if (error) throw error;
			return true;
		} catch (err) {
			console.error("[MAXCES MemoryEngine] Error deleting memory:", err);
			return false;
		}
	}
	/**
	* 4. Save or Update Project DNA Profile
	*/
	static async saveProjectDNA(params) {
		try {
			const { data: existing } = await supabase.from("projects").select("*").eq("user_id", params.userId).eq("name", params.name).maybeSingle();
			const payload = {
				user_id: params.userId,
				name: params.name,
				description: params.description ?? existing?.description ?? null,
				tech_stack: params.techStack ?? existing?.tech_stack ?? [],
				architecture_notes: params.architectureNotes ?? existing?.architecture_notes ?? null,
				current_phase: params.currentPhase ?? existing?.current_phase ?? "Phase 3: Core Brain",
				status: params.status ?? existing?.status ?? "active",
				project_goals: params.projectGoals ?? existing?.project_goals ?? null,
				known_issues: params.knownIssues ?? existing?.known_issues ?? null,
				future_features: params.futureFeatures ?? existing?.future_features ?? null,
				important_decisions: params.importantDecisions ?? existing?.important_decisions ?? null,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (existing) {
				const { data: updated, error } = await supabase.from("projects").update(payload).eq("id", existing.id).select().single();
				if (error) throw error;
				return {
					success: true,
					project: updated
				};
			} else {
				const { data: inserted, error } = await supabase.from("projects").insert(payload).select().single();
				if (error) throw error;
				return {
					success: true,
					project: inserted
				};
			}
		} catch (err) {
			console.error("[MAXCES MemoryEngine] Error saving project DNA:", err);
			return {
				success: false,
				error: err?.message || "Failed to save project DNA."
			};
		}
	}
	/**
	* 5. Get Project DNA Profile
	*/
	static async getProjectDNA(userId, projectName) {
		try {
			const { data, error } = await supabase.from("projects").select("*").eq("user_id", userId).eq("name", projectName).maybeSingle();
			if (error) throw error;
			return data || null;
		} catch (err) {
			console.error("[MAXCES MemoryEngine] Error fetching project DNA:", err);
			return null;
		}
	}
	/**
	* 6. Log AI Decision & Reasoning
	*/
	static async logAIDecision(params) {
		try {
			const { data, error } = await supabase.from("ai_decisions").insert({
				user_id: params.userId,
				project_id: params.projectId || null,
				decision_title: params.decisionTitle,
				decision_summary: params.decisionSummary || null,
				reasoning: params.reasoning || null,
				options_considered: params.optionsConsidered || [],
				chosen_solution: params.chosenSolution || null,
				impact_level: params.impactLevel || "medium",
				future_reference: params.futureReference || null
			}).select().single();
			if (error) throw error;
			return {
				success: true,
				decision: data
			};
		} catch (err) {
			console.error("[MAXCES MemoryEngine] Error logging AI decision:", err);
			return {
				success: false,
				error: err?.message || "Failed to log decision."
			};
		}
	}
};
//#endregion
export { MemoryEngine as n, AICore as t };
