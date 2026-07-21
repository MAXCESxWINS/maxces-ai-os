import { o as __toESM } from "../_runtime.mjs";
import { t as env } from "./env-DOF6oWyh.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-CJtFg47a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: {
	persistSession: true,
	autoRefreshToken: true,
	detectSessionInUrl: true
} });
var AuthContext = (0, import_react.createContext)(void 0);
var GUEST_STORAGE_KEY = "maxces_guest_mode";
var AuthProvider = ({ children }) => {
	const [user, setUser] = (0, import_react.useState)(null);
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [isGuest, setIsGuest] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return sessionStorage.getItem(GUEST_STORAGE_KEY) === "true";
		return false;
	});
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const lastFetchedUserIdRef = (0, import_react.useRef)(null);
	const fetchProfile = (0, import_react.useCallback)(async (userId) => {
		if (lastFetchedUserIdRef.current === userId && profile) return;
		try {
			setError(null);
			const { data, error: fetchErr } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
			if (fetchErr) {
				console.error("[MAXCES Auth] Error fetching profile:", fetchErr.message);
				setError(new Error(fetchErr.message));
			} else if (data) {
				setProfile(data);
				lastFetchedUserIdRef.current = userId;
			}
		} catch (err) {
			console.error("[MAXCES Auth] Unexpected error fetching profile:", err);
			setError(err instanceof Error ? err : /* @__PURE__ */ new Error("Unknown profile fetch error"));
		}
	}, [profile]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!isMounted) return;
			setSession(session);
			setUser(session?.user ?? null);
			if (session?.user) {
				setIsGuest(false);
				sessionStorage.removeItem(GUEST_STORAGE_KEY);
				fetchProfile(session.user.id).finally(() => {
					if (isMounted) setIsLoading(false);
				});
			} else setIsLoading(false);
		}).catch((err) => {
			console.error("[MAXCES Auth] Error checking session:", err);
			if (isMounted) setIsLoading(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
			if (!isMounted) return;
			setSession(newSession);
			setUser(newSession?.user ?? null);
			if (newSession?.user) {
				setIsGuest(false);
				sessionStorage.removeItem(GUEST_STORAGE_KEY);
				await fetchProfile(newSession.user.id);
			} else {
				setProfile(null);
				lastFetchedUserIdRef.current = null;
			}
			setIsLoading(false);
		});
		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, [fetchProfile]);
	const enableGuestMode = (0, import_react.useCallback)(() => {
		setIsGuest(true);
		if (typeof window !== "undefined") sessionStorage.setItem(GUEST_STORAGE_KEY, "true");
	}, []);
	const exitGuestMode = (0, import_react.useCallback)(() => {
		setIsGuest(false);
		if (typeof window !== "undefined") sessionStorage.removeItem(GUEST_STORAGE_KEY);
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		try {
			setIsLoading(true);
			await supabase.auth.signOut();
			setUser(null);
			setSession(null);
			setProfile(null);
			setIsGuest(false);
			if (typeof window !== "undefined") sessionStorage.removeItem(GUEST_STORAGE_KEY);
			lastFetchedUserIdRef.current = null;
		} catch (err) {
			console.error("[MAXCES Auth] Sign out error:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);
	const refetchProfile = (0, import_react.useCallback)(async () => {
		if (user?.id) {
			lastFetchedUserIdRef.current = null;
			await fetchProfile(user.id);
		}
	}, [user?.id, fetchProfile]);
	const value = (0, import_react.useMemo)(() => ({
		user,
		session,
		profile,
		isGuest,
		isLoading,
		error,
		signOut,
		enableGuestMode,
		exitGuestMode,
		refetchProfile
	}), [
		user,
		session,
		profile,
		isGuest,
		isLoading,
		error,
		signOut,
		enableGuestMode,
		exitGuestMode,
		refetchProfile
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
};
/**
* Custom hook to access MAXCES AI OS Authentication State
*/
var useAuth = () => {
	const context = (0, import_react.useContext)(AuthContext);
	if (!context) throw new Error("useAuth must be used within an <AuthProvider>");
	return context;
};
//#endregion
export { supabase as n, useAuth as r, AuthProvider as t };
