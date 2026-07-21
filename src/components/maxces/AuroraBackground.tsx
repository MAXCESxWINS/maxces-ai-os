import { useEffect, useRef } from "react";

/**
 * Ambient aurora + particle background. Pure decorative layer.
 * Mouse-reactive glow follows cursor with soft lag.
 */
export function AuroraBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden noise"
    >
      {/* Animated aurora blobs */}
      <div className="absolute -top-40 -left-40 h-[60rem] w-[60rem] rounded-full opacity-60 blur-3xl animate-aurora"
           style={{ background: "radial-gradient(closest-side, oklch(0.55 0.24 295 / 55%), transparent 70%)" }} />
      <div className="absolute top-1/3 -right-40 h-[50rem] w-[50rem] rounded-full opacity-50 blur-3xl animate-aurora"
           style={{ background: "radial-gradient(closest-side, oklch(0.65 0.22 260 / 50%), transparent 70%)", animationDelay: "-8s" }} />
      <div className="absolute -bottom-40 left-1/3 h-[55rem] w-[55rem] rounded-full opacity-40 blur-3xl animate-aurora"
           style={{ background: "radial-gradient(closest-side, oklch(0.82 0.15 210 / 40%), transparent 70%)", animationDelay: "-14s" }} />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 100%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 100%) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/60 animate-float-slow"
          style={{
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            left: `${(i * 47) % 100}%`,
            top: `${(i * 73) % 100}%`,
            opacity: 0.2 + (i % 5) * 0.08,
            animationDelay: `${(i % 7) * 0.8}s`,
            animationDuration: `${5 + (i % 6)}s`,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute h-[600px] w-[600px] rounded-full opacity-40 blur-3xl transition-transform"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.55 0.24 295 / 40%), transparent 70%)",
        }}
      />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
