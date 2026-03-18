"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

const concepts = [
  {
    id: 1,
    title: "Quiet Prestige",
    subtitle: "Editorial Luxury",
    thesis:
      "Restrained elegance. Large photography, premium monochrome palette, refined typography, and intentional negative space.",
    image: "/images/golden-view-1.jpg",
  },
  {
    id: 2,
    title: "Monumental Type",
    subtitle: "Bold / Structural",
    thesis:
      "The brand fills the viewport. Cinzel serif at 18vw, full-bleed slides, clip-path reveals. Architecture as monument.",
    image: "/images/golden-view-3.jpg",
  },
  {
    id: 3,
    title: "Spatial Immersion",
    subtitle: "Experimental Premium",
    thesis:
      "Depth, light, and materiality. Organic forms that evoke architecture as spatial experience. The boldest direction.",
    image: "/images/clifftop-oasis.webp",
  },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Stagger the hero text */
      gsap.fromTo(
        ".idx-line",
        { y: 100, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.12, ease: "power4.out", delay: 0.3 }
      );
      gsap.fromTo(
        ".idx-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1.2 }
      );
      /* Cards */
      gsap.fromTo(
        ".idx-card",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 1.5 }
      );
      /* Footer */
      gsap.fromTo(
        ".idx-footer",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 2.2 }
      );
    }, containerRef);
    return () => ctx.kill();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: "url('/images/bg-light-noise.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Grid lines — decorative */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="mx-auto flex h-full max-w-[1400px] justify-between px-6 md:px-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-full w-px bg-white/[0.04]" />
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-8 pb-0 md:px-16 md:pt-12">
        <Image
          src="/images/logo-white.svg"
          alt="Vista 3"
          width={120}
          height={32}
          className="opacity-70"
        />
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">
          Design Exploration
        </span>
      </nav>

      {/* Hero — massive text */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-20 md:px-16 md:pt-32 md:pb-28">
        <div className="overflow-hidden">
          <h1 className="idx-line font-display text-[clamp(3.5rem,11vw,12rem)] leading-[0.88] font-bold tracking-[-0.04em] uppercase text-white">
            Three
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="idx-line font-display text-[clamp(3.5rem,11vw,12rem)] leading-[0.88] font-bold tracking-[-0.04em] uppercase text-white/20">
            Directions
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="idx-line font-display text-[clamp(3.5rem,11vw,12rem)] leading-[0.88] font-bold tracking-[-0.04em] uppercase text-white/60">
            For Vista<span className="text-amber-500/80">3</span>
          </h1>
        </div>

        <div className="mt-12 max-w-lg overflow-hidden md:mt-16">
          <p className="idx-sub font-body text-base leading-[1.8] text-white/35 md:text-lg">
            Each concept presents a distinct creative thesis for how Vista 3
            should appear, feel, and communicate online. They are meant to be
            compared — not combined.
          </p>
        </div>

        {/* Prepared for line */}
        <div className="idx-sub mt-8 flex items-center gap-4">
          <div className="h-px w-12 bg-white/10" />
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/20">
            Prepared for Isaac Leiva
          </p>
        </div>
      </section>

      {/* Cards — 3 col bento */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32 md:px-16">
        <div className="grid gap-4 md:grid-cols-3">
          {concepts.map((c) => (
            <Link key={c.id} href={`/${c.id}`} className="group block">
              <div className="idx-card relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-[border-color,background-color] duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/20 to-transparent" />

                  {/* Number overlay */}
                  <div className="pointer-events-none absolute top-4 right-5">
                    <span className="font-display text-[4rem] leading-none font-bold tracking-wider text-white/[0.06]">
                      {String(c.id).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/25">
                      {String(c.id).padStart(2, "0")}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/20">
                      {c.subtitle}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-[0.95] font-bold tracking-[-0.02em] text-white">
                    {c.title}
                  </h2>

                  <p className="mt-4 font-body text-sm leading-[1.7] text-white/30">
                    {c.thesis}
                  </p>

                  <div className="mt-8 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase text-white/20 transition-[color] duration-300 group-hover:text-white/60">
                    View direction
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="idx-footer relative z-10 border-t border-white/[0.06] px-6 py-10 md:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/15">
            &copy; Vista 3 Architects {new Date().getFullYear()}
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/15">
            Design exploration by Marcelo Retana
          </p>
        </div>
      </footer>
    </div>
  );
}
