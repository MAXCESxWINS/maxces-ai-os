import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe, Languages, Palette, Plug, Shield, User, Lock, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { GitHubIntegrationEngine } from "@/lib/integrations/github";
import { PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "MAXCES · Settings" }] }),
  component: SettingsPage,
});

type SettingsTab = "appearance" | "integrations" | "locked";

interface AccentConfig {
  primary: string;
  secondary: string;
}

const ACCENTS: Record<string, AccentConfig> = {
  Royal: { primary: "oklch(0.55 0.24 295)", secondary: "oklch(0.65 0.22 260)" },
  Cyan: { primary: "oklch(0.60 0.18 200)", secondary: "oklch(0.70 0.15 180)" },
  Emerald: { primary: "oklch(0.65 0.20 150)", secondary: "oklch(0.75 0.16 165)" },
  Amber: { primary: "oklch(0.70 0.22 75)", secondary: "oklch(0.75 0.18 60)" },
};

export function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [lockedSectionName, setLockedSectionName] = useState<string | null>(null);

  // Accent Selection
  const [currentAccent, setCurrentAccent] = useState("Royal");

  // GitHub integration status
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);

  // Motion Settings
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    // Load persisted accent
    const savedAccent = localStorage.getItem("maxces_accent");
    if (savedAccent && ACCENTS[savedAccent]) {
      setCurrentAccent(savedAccent);
      applyAccent(savedAccent);
    }

    // Load persisted motion
    const savedMotion = localStorage.getItem("maxces_motion");
    if (savedMotion !== null) {
      const isMotionOn = savedMotion === "true";
      setMotionEnabled(isMotionOn);
      applyMotion(isMotionOn);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      GitHubIntegrationEngine.getGitHubStatus(user.id).then((status) => {
        setGithubConnected(status.isConnected);
        setGithubUsername(status.github_username || null);
      });
    }
  }, [user]);

  const applyAccent = (name: string) => {
    const config = ACCENTS[name];
    if (config) {
      document.documentElement.style.setProperty("--primary", config.primary);
      document.documentElement.style.setProperty("--secondary", config.secondary);
    }
  };

  const handleAccentChange = (name: string) => {
    setCurrentAccent(name);
    applyAccent(name);
    localStorage.setItem("maxces_accent", name);
  };

  const applyMotion = (on: boolean) => {
    if (on) {
      document.body.classList.remove("reduce-motion");
    } else {
      document.body.classList.add("reduce-motion");
    }
  };

  const handleMotionToggle = (on: boolean) => {
    setMotionEnabled(on);
    applyMotion(on);
    localStorage.setItem("maxces_motion", String(on));
  };

  const sections = [
    { id: "account" as const, icon: User, title: "Account", desc: "Name, avatar, email", type: "locked" as const },
    { id: "appearance" as const, icon: Palette, title: "Appearance", desc: "Theme, density, accent", type: "appearance" as const },
    { id: "notifications" as const, icon: Bell, title: "Notifications", desc: "Slack, email, digest", type: "locked" as const },
    { id: "language" as const, icon: Languages, title: "Language", desc: "English (US)", type: "locked" as const },
    { id: "workspace" as const, icon: Globe, title: "Workspace", desc: "Team of 4 · Cortex plan", type: "locked" as const },
    { id: "integrations" as const, icon: Plug, title: "Integrations", desc: "GitHub, Linear, Notion", type: "integrations" as const },
    { id: "security" as const, icon: Shield, title: "Security", desc: "2FA, sessions, keys", type: "locked" as const },
  ];

  const handleTabClick = (s: typeof sections[number]) => {
    if (s.type === "locked") {
      setLockedSectionName(s.title);
      setActiveTab("locked");
    } else {
      setActiveTab(s.type);
      setLockedSectionName(null);
    }
  };

  return (
    <PageContainer>
      <TopBar title="Settings" subtitle="Configure theme, appearance and integration adapters" />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left Navigation Card */}
        <GlassCard className="h-fit p-3" hover={false}>
          <ul className="space-y-1" role="tablist" aria-label="Settings Categories">
            {sections.map((s) => {
              const isSelected =
                (s.type === "locked" && activeTab === "locked" && lockedSectionName === s.title) ||
                (s.type !== "locked" && activeTab === s.type);

              return (
                <li key={s.title} role="presentation">
                  <button
                    onClick={() => handleTabClick(s)}
                    role="tab"
                    aria-selected={isSelected}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                      isSelected
                        ? "bg-primary/15 ring-1 ring-inset ring-primary/30 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <s.icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-cyan-glow" : ""}`} aria-hidden />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{s.title}</div>
                        <div className="truncate text-[10px] text-muted-foreground/70">{s.desc}</div>
                      </div>
                    </div>
                    {s.type === "locked" && (
                      <Lock className="h-3 w-3 text-muted-foreground/40 shrink-0 ml-2" aria-label="Locked feature" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        {/* Right Settings Pane */}
        <main aria-label="Configuration Settings" aria-live="polite">
          {activeTab === "appearance" && (
            <GlassCard hover={false} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  MAXCES is dark by default. Choose your theme accent color and layout behaviors.
                </p>
              </div>

              {/* Accents Selector */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Theme Accent</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Select accent color">
                  {Object.entries(ACCENTS).map(([name, config]) => {
                    const isSelected = currentAccent === name;
                    const gradientCls =
                      name === "Royal" ? "from-purple-500 to-indigo-500" :
                      name === "Cyan" ? "from-cyan-400 to-blue-500" :
                      name === "Emerald" ? "from-emerald-400 to-teal-500" :
                      "from-amber-400 to-orange-500";

                    return (
                      <button
                        key={name}
                        onClick={() => handleAccentChange(name)}
                        role="radio"
                        aria-checked={isSelected}
                        className={`group relative h-16 overflow-hidden rounded-xl transition-all focus:outline-none ${
                          isSelected
                            ? "ring-2 ring-cyan-glow scale-[1.02]"
                            : "ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.01]"
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientCls}`} />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <span className="absolute inset-x-0 bottom-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md select-none">
                          {name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-black/60 flex items-center justify-center border border-white/20">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="border-t border-white/5 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Interface Options</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Motion Toggle — fully functional */}
                  <ToggleRow
                    label="Ambient Motion"
                    desc="Enable interface page transitions & micro-animations"
                    on={motionEnabled}
                    onChange={handleMotionToggle}
                  />

                  {/* Sounds Toggle — Locked/Coming Soon */}
                  <ToggleRow
                    label="Subtle Sounds"
                    desc="Audio feedback on clicks & operations"
                    on={false}
                    disabled
                    comingSoonText="Beta 2.0"
                  />

                  {/* Cursor Glow Toggle — Locked/Coming Soon */}
                  <ToggleRow
                    label="Cursor Glow Light"
                    desc="Aesthetic background glow follow mouse cursor"
                    on={false}
                    disabled
                    comingSoonText="Beta 2.0"
                  />

                  {/* Density Toggle — Locked/Coming Soon */}
                  <ToggleRow
                    label="Compact Layout"
                    desc="Tighter workspace sidebar padding and list items"
                    on={false}
                    disabled
                    comingSoonText="Beta 2.0"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "integrations" && (
            <GlassCard hover={false} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage external connection adapters and platform tokens.
                </p>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2" role="list">
                {/* GitHub integration status */}
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
                      GH
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">GitHub Integration</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {githubConnected
                          ? `Connected as @${githubUsername || "user"}`
                          : "Configure OAuth tokens to push repositories"
                        }
                      </div>
                    </div>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${githubConnected ? "bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]" : "bg-white/20"}`} />
                </div>

                {/* Vercel Integration */}
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-4 opacity-75">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-muted-foreground">
                      VC
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        Vercel Deployments
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        Tokens configured per deployment in Deploy tab
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-300 shrink-0">
                    Active
                  </span>
                </div>

                {/* Netlify Integration */}
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-4 opacity-75">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-muted-foreground">
                      NL
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        Netlify Deployments
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        Tokens configured per deployment in Deploy tab
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-300 shrink-0">
                    Active
                  </span>
                </div>

                {/* Locked / Upcoming Integrations */}
                {["Linear", "Notion", "Slack"].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.01] p-4 opacity-40 select-none">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/5 text-xs font-semibold text-muted-foreground">
                        {i.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          {i} Adapter
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Integration locked in closed beta
                        </div>
                      </div>
                    </div>
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === "locked" && (
            <GlassCard hover={false} className="border border-purple-500/20 min-h-[280px] flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 h-14 w-14 rounded-2xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-base font-bold text-foreground">{lockedSectionName} Configuration</h2>
              <p className="text-xs text-muted-foreground/80 max-w-xs leading-relaxed mt-2">
                This configuration panel is locked during the Closed Beta release of MAXCES AI OS. 
                Full support will be enabled in a future beta update.
              </p>
              <button
                onClick={() => setActiveTab("appearance")}
                className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
              >
                Return to Appearance settings
              </button>
            </GlassCard>
          )}
        </main>
      </div>
    </PageContainer>
  );
}

interface ToggleRowProps {
  label: string;
  desc: string;
  on: boolean;
  onChange?: (on: boolean) => void;
  disabled?: boolean;
  comingSoonText?: string;
}

function ToggleRow({ label, desc, on, onChange, disabled = false, comingSoonText }: ToggleRowProps) {
  return (
    <div className={`flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-all ${disabled ? "opacity-50 select-none cursor-not-allowed" : ""}`}>
      <div className="min-w-0 pr-3">
        <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          {label}
          {comingSoonText && (
            <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[8.5px] font-bold text-purple-300">
              {comingSoonText}
            </span>
          )}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</div>
      </div>
      <button
        onClick={() => !disabled && onChange && onChange(!on)}
        disabled={disabled}
        aria-label={`Toggle ${label}`}
        aria-checked={on}
        role="checkbox"
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none ${
          on ? "bg-gradient-to-r from-primary to-secondary" : "bg-white/10"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
