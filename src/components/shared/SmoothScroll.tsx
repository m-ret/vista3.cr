"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    rafRef.current = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
    };
  }, [lenis]);

  return (
    <ReactLenis
      root
      options={{ lerp: 0.12, duration: 0.8, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}
