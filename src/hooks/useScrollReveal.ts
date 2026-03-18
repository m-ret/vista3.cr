"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    y = 30,
    x = 0,
    opacity = 0,
    duration = 0.6,
    delay = 0,
    stagger = 0.08,
    once = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const children = el.children.length > 0 ? Array.from(el.children) : [el];

    gsap.set(children, { y, x, opacity });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(children, {
              y: 0,
              x: 0,
              opacity: 1,
              duration,
              delay,
              stagger,
              ease: "power2.out",
            });
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [y, x, opacity, duration, delay, stagger, once]);

  return ref;
}
