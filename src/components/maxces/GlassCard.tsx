import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GlassCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
};

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass p-5",
        glow && "glow-purple",
        className,
      )}
      {...rest}
    >
      {/* subtle top highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      {children}
    </motion.div>
  );
}
