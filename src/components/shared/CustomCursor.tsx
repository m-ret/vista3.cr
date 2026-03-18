"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — ring + dot with mix-blend-mode: difference.
 * Automatically contrasts against all content underneath (text, images, backgrounds).
 * Scales up on hoverable elements, shrinks on click.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const hovering = useRef(false);
  const clicking = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  useEffect(() => {
    // Hide default cursor globally
    document.documentElement.style.cursor = "none";
    // Also hide on all interactive elements
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    let rafId: number;
    let hoverCheckThrottle = 0;

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        if (ringRef.current) ringRef.current.style.opacity = "1";
        if (dotRef.current) dotRef.current.style.opacity = "1";
      }
    };

    const onDown = () => { clicking.current = true; };
    const onUp = () => { clicking.current = false; };

    const onEnter = () => {
      visible.current = true;
      if (ringRef.current) ringRef.current.style.opacity = "1";
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };
    const onLeave = () => {
      visible.current = false;
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    const checkHover = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "a" || tag === "button") return true;
      if (el.closest("a, button, [role='button']")) return true;
      return getComputedStyle(el).cursor === "pointer";
    };

    const tick = () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) { rafId = requestAnimationFrame(tick); return; }

      // Smooth follow for ring
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);

      // Dot follows exactly
      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)${clicking.current ? " scale(0.5)" : ""}`;

      // Ring follows with lag
      const hoverScale = hovering.current ? 2 : 1;
      const clickScale = clicking.current ? 0.8 : 1;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${hoverScale * clickScale})`;

      // Check hover less frequently
      hoverCheckThrottle++;
      if (hoverCheckThrottle % 4 === 0) {
        hovering.current = checkHover(pos.current.x, pos.current.y);
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = "";
      style.remove();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Ring — blend difference makes it auto-contrast against everything */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-10 w-10 rounded-full border-2 border-white opacity-0"
        style={{ mixBlendMode: "difference", transition: "opacity 0.3s", willChange: "transform" }}
      />
      {/* Dot — same blend mode */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-2.5 w-2.5 rounded-full bg-white opacity-0"
        style={{ mixBlendMode: "difference", transition: "opacity 0.3s", willChange: "transform" }}
      />
    </>
  );
}
