import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as supabase, r as useAuth } from "./useAuth-CJtFg47a.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as GlassCard } from "./GlassCard-IDSc0PTK.mjs";
import { t as AuroraBackground } from "./AuroraBackground-EFRI5YUF.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as Lock, L as LoaderCircle, P as Mail, Pt as ArrowRight, St as CircleCheck, g as Sparkles, lt as Eye, r as User, ut as EyeOff, wt as CircleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BvCoadbC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCard() {
	const navigate = useNavigate();
	const { user, enableGuestMode } = useAuth();
	const [mode, setMode] = (0, import_react.useState)("login");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [successMsg, setSuccessMsg] = (0, import_react.useState)(null);
	const isPasswordStrong = password.length >= 6;
	const switchMode = (newMode) => {
		setMode(newMode);
		setErrorMsg(null);
		setSuccessMsg(null);
	};
	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			setErrorMsg(null);
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: `${window.location.origin}/` }
			});
			if (error) throw error;
		} catch (err) {
			setErrorMsg(err?.message || "Google sign in failed. Please try again.");
			setIsLoading(false);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMsg(null);
		setSuccessMsg(null);
		if (!email || !email.includes("@")) {
			setErrorMsg("Please enter a valid email address.");
			return;
		}
		if (mode !== "forgot" && !password) {
			setErrorMsg("Please enter your password.");
			return;
		}
		if (mode === "signup" && !isPasswordStrong) {
			setErrorMsg("Password must be at least 6 characters long.");
			return;
		}
		try {
			setIsLoading(true);
			if (mode === "login") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				navigate({ to: "/" });
			} else if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: { data: { full_name: displayName || email.split("@")[0] } }
				});
				if (error) throw error;
				if (data.session) {
					setSuccessMsg("Account created successfully! Logging you in...");
					setTimeout(() => navigate({ to: "/" }), 1e3);
				} else setSuccessMsg("Account created! Please check your email inbox to verify your account.");
			} else if (mode === "forgot") {
				const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
				if (error) throw error;
				setSuccessMsg("Password reset link has been sent to your email.");
			}
		} catch (err) {
			console.error("Auth error:", err);
			if (err.message?.includes("Invalid login credentials")) setErrorMsg("Invalid email or password. Please check your details.");
			else if (err.message?.includes("User already registered")) setErrorMsg("An account with this email already exists. Try logging in.");
			else setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleGuestAccess = () => {
		enableGuestMode();
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		glow: true,
		className: "w-full max-w-md border border-white/10 p-8 shadow-2xl backdrop-blur-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							scale: .8,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						transition: { duration: .4 },
						className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-full w-full items-center justify-center rounded-[14px] bg-background/90 backdrop-blur-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6 text-purple-400" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-bold tracking-tight text-foreground",
						children: ["MAXCES ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent",
							children: "AI OS"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							mode === "login" && "Welcome back! Sign in to access your personal AI operating system.",
							mode === "signup" && "Create your account to unlock your personal AI workspace.",
							mode === "forgot" && "Enter your email to receive a password reset link."
						]
					})
				]
			}),
			mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 rounded-xl bg-white/5 p-1 border border-white/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => switchMode("login"),
					className: `rounded-lg py-2 text-xs font-medium transition-all ${mode === "login" ? "bg-purple-600/30 text-white shadow-sm border border-purple-500/30" : "text-muted-foreground hover:text-white"}`,
					children: "Sign In"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => switchMode("signup"),
					className: `rounded-lg py-2 text-xs font-medium transition-all ${mode === "signup" ? "bg-purple-600/30 text-white shadow-sm border border-purple-500/30" : "text-muted-foreground hover:text-white"}`,
					children: "Create Account"
				})]
			}),
			errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: -6
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0 text-red-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
			}),
			successMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: -6
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMsg })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-medium text-muted-foreground",
						children: "Full Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: displayName,
							onChange: (e) => setDisplayName(e.target.value),
							placeholder: "Alex Mercer",
							className: "w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-medium text-muted-foreground",
						children: "Email Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "alex@example.com",
							className: "w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
						})]
					})] }),
					mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Password"
						}), mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => switchMode("forgot"),
							className: "text-[11px] text-purple-400 hover:text-purple-300 hover:underline",
							children: "Forgot password?"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showPassword ? "text" : "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "••••••••••••",
								className: "w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: isLoading,
						className: "mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:opacity-95 disabled:opacity-50",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-white" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							mode === "login" && "Sign In to Operating System",
							mode === "signup" && "Create Personal Workspace",
							mode === "forgot" && "Send Password Reset Email"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative my-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-white/10" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "relative bg-black/60 px-3 text-[10px] font-medium tracking-wider text-muted-foreground uppercase",
					children: "OR CONTINUE WITH"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleGoogleSignIn,
					disabled: isLoading,
					className: "flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20 disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "h-4 w-4",
						viewBox: "0 0 24 24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#EA4335",
								d: "M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#4285F4",
								d: "M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#FBBC05",
								d: "M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#34A853",
								d: "M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue with Google" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleGuestAccess,
					className: "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-transparent py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-white/30 hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore Preview Mode (Guest)" })
				})]
			}),
			mode === "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => switchMode("login"),
					className: "text-xs text-purple-400 hover:underline",
					children: "← Back to Sign In"
				})
			})
		]
	});
}
function LoginPage() {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!isLoading && user) navigate({ to: "/" });
	}, [
		user,
		isLoading,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "z-10 w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthCard, {})
		})]
	});
}
//#endregion
export { LoginPage as component };
