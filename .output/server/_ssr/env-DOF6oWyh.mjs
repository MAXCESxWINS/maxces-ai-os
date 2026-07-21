//#region node_modules/.nitro/vite/services/ssr/assets/env-DOF6oWyh.js
function validateEnv() {
	const supabaseUrl = "https://wciebarocayfzjxketny.supabase.co";
	const supabaseAnonKey = "sb_publishable_D9cNjOZ2TMG9puxEBdtUag_ZwuVWQpT";
	const geminiApiKey = "your-gemini-api-key-here";
	const missingVars = [];
	if (missingVars.length > 0) {
		const errorMsg = `[MAXCES AI OS Config Error] Missing environment variables: ${missingVars.join(", ")}. Please update your .env.local file.`;
		console.warn(errorMsg);
	}
	return {
		VITE_SUPABASE_URL: supabaseUrl,
		VITE_SUPABASE_ANON_KEY: supabaseAnonKey,
		VITE_GEMINI_API_KEY: geminiApiKey
	};
}
var env = validateEnv();
//#endregion
export { env as t };
