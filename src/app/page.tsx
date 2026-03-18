"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useLenis } from "@/hooks/useLenis";

const concepts = [
  {
    id: 1,
    title: "Quiet Prestige",
    subtitle: "Editorial Luxury",
    thesis:
      "Restrained elegance. Large photography, premium monochrome palette, refined typography, and intentional negative space. The safest commercially — but still distinctly expensive.",
    image: "/images/golden-view-1.jpg",
    bg: "bg-warm-900",
    text: "text-warm-100",
    accent: "text-warm-400",
  },
  {
    id: 2,
    title: "Monumental Type",
    subtitle: "Bold / Structural / Cinematic",
    thesis:
      "The brand name fills the viewport. Cinzel serif at 18vw, full-bleed project slides, clip-path reveals, gold accent. Architecture as monument — bold, confident, unforgettable.",
    image: "/images/golden-view-3.jpg",
    bg: "bg-charcoal",
    text: "text-white",
    accent: "text-amber-500",
  },
  {
    id: 3,
    title: "Spatial Immersion",
    subtitle: "Experimental Premium",
    thesis:
      "Depth, light, and materiality through WebGL. Abstract sculptural forms that evoke architecture as spatial experience. The boldest direction — still refined.",
    image: "/images/clifftop-oasis.webp",
    bg: "bg-deep",
    text: "text-warm-200",
    accent: "text-warm-400",
  },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLenis();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exp-title",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".exp-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6 }
      );
      gsap.fromTo(
        ".concept-card",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.2, ease: "power2.out", delay: 0.9 }
      );
      gsap.fromTo(
        ".exp-footer",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 1.8 }
      );
    }, containerRef);
    return () => ctx.kill();
  }, []);

  return (
    <div ref={containerRef} className="grain min-h-screen bg-off-white">
      {/* Header */}
      <header className="mx-auto flex max-w-[1400px] items-baseline justify-between px-6 pt-10 pb-20 md:px-16 md:pt-14">
        <div>
          <Image
            src="/images/logo-white.svg"
            alt="Vista 3"
            width={100}
            height={28}
            className="invert"
          />
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-warm-500 uppercase">
          Design Exploration
        </span>
      </header>

      {/* Title */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 md:px-16">
        <div className="max-w-3xl">
          <div className="overflow-hidden">
            <h1 className="exp-title font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-charcoal">
              Three directions for
              <br />
              Vista 3
            </h1>
          </div>
          <div className="mt-8 overflow-hidden">
            <p className="exp-sub max-w-lg font-body text-base leading-relaxed text-warm-500 md:text-lg">
              Each concept presents a distinct creative thesis for how Vista 3
              should appear, feel, and communicate online. They are meant to be
              compared — not combined.
            </p>
          </div>
        </div>
      </section>

      {/* Concept Cards */}
      <section className="mx-auto max-w-[1400px] px-6 pb-32 md:px-16">
        <div className="grid gap-5 md:grid-cols-3">
          {concepts.map((c) => (
            <Link key={c.id} href={`/${c.id}`} className="group block">
              <div className="concept-card">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-charcoal/10 transition-opacity duration-500 group-hover:opacity-0" />
                </div>

                {/* Text */}
                <div className="pt-6 pb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-warm-400 uppercase">
                      {String(c.id).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-warm-200" />
                  </div>

                  <h2 className="mt-3 font-display text-2xl font-light tracking-tight text-charcoal md:text-3xl">
                    {c.title}
                  </h2>
                  <p className="mt-1 font-heading text-xs font-medium tracking-wider text-warm-500 uppercase">
                    {c.subtitle}
                  </p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-warm-500">
                    {c.thesis}
                  </p>

                  <div className="mt-5 flex items-center gap-2 font-mono text-[10px] tracking-wider text-warm-400 uppercase transition-colors group-hover:text-charcoal">
                    View concept
                    <svg
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="exp-footer border-t border-warm-200 px-6 py-10 md:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 md:flex-row">
          <p className="font-body text-xs text-warm-400">
            Prepared for Isaac Leiva — Vista 3
          </p>
          <p className="font-body text-xs text-warm-400">
            Design exploration by Marcelo Retana · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
