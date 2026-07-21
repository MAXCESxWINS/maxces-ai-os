import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The floating AI orb — the heart of MAXCES.
 * Multiple rotating rings + glow + breathing pulse.
 */
export function AICore({
  size = 260,
  className,
  label,
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      {/* outer halo */}
      <div
        className="absolute rounded-full blur-3xl opacity-70"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background:
            "radial-gradient(closest-side, oklch(0.55 0.24 295 / 55%), transparent 70%)",
        }}
      />

      {/* pulse rings */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border border-primary/40 animate-pulse-ring"
          style={{
            width: size * 0.7,
            height: size * 0.7,
            animationDelay: `${i * 1}s`,
          }}
        />
      ))}

      {/* rotating rings */}
      <div
        className="absolute rounded-full border border-white/15 animate-orb-rotate-slow"
        style={{
          width: size * 0.95,
          height: size * 0.95,
          borderStyle: "dashed",
        }}
      />
      <div
        className="absolute rounded-full border-2 border-transparent animate-orb-rotate-fast"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.15 210 / 60%) 60deg, transparent 120deg, oklch(0.55 0.24 295 / 70%) 240deg, transparent 300deg)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
        }}
      />

      {/* orb */}
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background:
            "radial-gradient(circle at 30% 25%, oklch(0.85 0.14 260) 0%, oklch(0.55 0.24 295) 40%, oklch(0.18 0.08 285) 100%)",
          boxShadow:
            "0 0 60px oklch(0.55 0.24 295 / 60%), inset 0 0 60px oklch(0 0 0 / 60%), inset -10px -20px 40px oklch(0 0 0 / 40%)",
        }}
      >
        {/* highlight */}
        <div
          className="absolute rounded-full bg-white/70 blur-md"
          style={{ width: "22%", height: "18%", top: "16%", left: "22%" }}
        />
        {/* inner core */}
        <div
          className="absolute inset-6 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, oklch(0.82 0.15 210 / 60%), transparent 60%)",
          }}
        />
      </motion.div>

      {label && (
        <div className="absolute -bottom-8 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </div>
      )}
    </div>
  );
}
