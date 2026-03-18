"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  projects,
  services,
  testimonials,
  contact,
  stats,
} from "@/data/projects";

export default function Concept03() {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      /* ── HERO — Brand reveal ── */
      gsap.fromTo(
        ".c3-hero-brand > *",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        ".c3-hero-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 1 }
      );
      gsap.fromTo(
        ".c3-hero-nav a",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 1.2 }
      );

      /* ── HERO — Rotating word (DSK-style blur reveal) ── */
      const WORDS = ["ARCHITECTURE", "DESIGN", "CONSTRUCTION", "DEVELOPMENT"];
      let wordIdx = 0;
      let wordActive = true;

      const animateWord = () => {
        if (!wordActive) return;
        const container = containerRef.current?.querySelector(".c3-rotating-word");
        if (!container) return;
        const word = WORDS[wordIdx];
        container.innerHTML = word
          .split("")
          .map(
            (l) =>
              `<span style="display:inline-block;opacity:0;filter:blur(12px);transition:none">${l}</span>`
          )
          .join("");
        const letters = container.querySelectorAll("span");
        const tl = gsap.timeline({
          onComplete: () => {
            wordIdx = (wordIdx + 1) % WORDS.length;
            animateWord();
          },
        });
        tl.to(letters, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.35,
          stagger: 0.04,
          ease: "power2.out",
        }).to(
          letters,
          { opacity: 0, filter: "blur(8px)", duration: 0.3, stagger: 0.02 },
          "+=3"
        );
      };
      gsap.delayedCall(1.5, animateWord);

      /* ── COLLAGE PARALLAX — each image drifts at its own speed ── */
      gsap.utils.toArray<HTMLElement>(".c3-collage-img").forEach((img) => {
        const speed = parseFloat(img.dataset.speed || "-50");
        gsap.fromTo(img,
          { y: -speed * 0.6 },
          {
            y: speed * 2.5,
            ease: "none",
            scrollTrigger: {
              trigger: "#studio",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      /* ── 2. PIN the 3 cards so Heritage scrolls over them ── */
      ScrollTrigger.create({
        trigger: ".c3-principles",
        start: "top top",
        endTrigger: ".c3-heritage",
        end: "top top",
        pin: true,
        pinSpacing: false,
      });

      /* ── 5. SERVICES — Scroll accordion ── */
      const svcItems = gsap.utils.toArray<HTMLElement>(".c3-svc-item");
      const firstDesc = svcItems[0]?.querySelector(
        ".c3-svc-desc"
      ) as HTMLElement;
      const firstLine = svcItems[0]?.querySelector(
        ".c3-svc-line"
      ) as HTMLElement;
      if (firstDesc) gsap.set(firstDesc, { height: "auto", opacity: 1 });
      if (firstLine) gsap.set(firstLine, { scaleX: 1 });

      let activeSvc = 0;
      ScrollTrigger.create({
        trigger: ".c3-services-list",
        start: "top 50%",
        end: "bottom 50%",
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * svcItems.length),
            svcItems.length - 1
          );
          if (idx === activeSvc) return;
          activeSvc = idx;
          svcItems.forEach((item, i) => {
            const desc = item.querySelector(".c3-svc-desc") as HTMLElement;
            const line = item.querySelector(".c3-svc-line") as HTMLElement;
            if (!desc || !line) return;
            if (i === idx) {
              gsap.to(desc, {
                height: "auto",
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
              });
              gsap.to(line, {
                scaleX: 1,
                duration: 0.6,
                ease: "power2.out",
              });
            } else {
              gsap.to(desc, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
              });
              gsap.to(line, { scaleX: 0, duration: 0.3, ease: "power2.in" });
            }
          });
        },
      });

      /* ── GENERIC SCROLL REVEALS ── */
      ScrollTrigger.batch(".c3-reveal", {
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power2.out",
            }
          ),
        start: "top 88%",
      });

      return () => {
        wordActive = false;
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0d0d0d] text-white"
      style={
        {
          "--font-display": "'DM Sans', sans-serif",
          "--font-body": "'DM Sans', sans-serif",
        } as React.CSSProperties
      }
    >
      {/* ── NAV — minimal, DSK-style ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="relative z-[60]">
            <Image src="/images/logo-white.svg" alt="Vista 3" width={110} height={30} />
          </Link>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-[60] flex cursor-pointer items-center text-white/70 transition-[color] duration-300 hover:text-white"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="relative flex h-4 w-5 flex-col justify-center gap-1">
                <span className={`h-px w-full bg-current transition-transform duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
                <span className={`h-px w-full bg-current transition-transform duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── FULLSCREEN MENU ── */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-40 flex flex-col bg-[#0a0f0d] transition-[opacity,visibility] duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-1 flex-col justify-center px-6 md:px-12">
          <div className="mx-auto w-full max-w-[1440px]">
            {[
              { label: "Work", href: "#work" },
              { label: "Studio", href: "#studio" },
              { label: "Services", href: "#services" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group block border-b border-white/10"
              >
                <div className="flex items-baseline justify-between py-4 md:py-5">
                  <span className="font-body text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-bold tracking-[-0.04em] uppercase text-white/80 transition-[color,transform] duration-300 group-hover:text-white group-hover:translate-x-4">
                    {item.label}
                  </span>
                  <svg aria-hidden="true" className="h-6 w-6 text-white/30 transition-[color] duration-300 group-hover:text-white md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="px-6 pb-8 md:px-12">
          <p className="font-mono text-[10px] tracking-wider text-white/30">
            {contact.email} &middot; {contact.phone}
          </p>
        </div>
      </div>

      {/* ── HERO — DSK-style: blueprint bg + brand + rotating word ── */}
      <section className="relative h-screen overflow-hidden bg-[#0d0d0d]">
        {/* Architectural drawing background */}
        <div className="absolute inset-0">
          <Image
            src="/images/drawing-pool-plan.png"
            alt=""
            fill
            className="object-cover opacity-[0.18] invert"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/50 via-transparent to-[#0d0d0d]/70" />

        {/* Center brand text block */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="c3-hero-brand text-left">
            <h1 className="font-body text-[clamp(5rem,12vw,11rem)] leading-[0.85] font-bold tracking-[-0.02em] uppercase text-white">
              Vista <span className="text-white/60">3</span>
            </h1>
            <div
              className="c3-rotating-word mt-1 h-[1.15em] font-body text-[clamp(2rem,4.5vw,4.2rem)] font-medium tracking-[0.1em] uppercase text-white"
              aria-live="polite"
            />
          </div>
        </div>

        {/* Description box — bottom left */}
        <div className="c3-hero-desc absolute bottom-16 left-6 right-6 border-l border-white/20 bg-white/[0.04] px-6 py-5 backdrop-blur-sm md:bottom-20 md:left-10 md:right-auto md:max-w-md">
          <p className="font-body text-[13px] leading-[1.75] font-light text-white/70">
            Vista 3 designs and constructs exceptional residences in Costa Rica
            — from timeless homes to future-focused developments, our work
            shapes lasting impact.
          </p>
        </div>

        {/* Bottom nav bar */}
        <div className="c3-hero-nav absolute bottom-0 left-0 right-0 border-t border-white/10">
          <div className="mx-auto hidden max-w-[1440px] items-center justify-between px-6 py-3.5 md:flex md:px-10">
            {["Work", "Studio", "Services", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="font-body text-[13px] tracking-[0.04em] text-white/50 transition-colors hover:text-white md:text-sm"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="grain">
        {/* ══════ BLOCK 1: Sticky title + full-screen cards ══════ */}
        <section id="studio" className="relative" style={{ backgroundColor: "#f0f0ec" }}>
          {/* Drawing collage bg — dense, blended, parallax */}
          <div className="c3-collage pointer-events-none absolute inset-0 hidden overflow-hidden opacity-[0.18] md:block" style={{ mixBlendMode: "multiply" }}>
            {/* Row 1 — top */}
            <div className="c3-collage-img absolute -top-[5%] -left-[8%] w-[48%]" data-speed="-80">
              <Image src="/images/drawing-3.png" alt="" width={800} height={1000}
                className="rotate-[-3deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="c3-collage-img absolute -top-[2%] left-[30%] w-[42%]" data-speed="-50">
              <Image src="/images/sketch-house-1.png" alt="" width={800} height={500}
                className="rotate-[2deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="c3-collage-img absolute -top-[8%] -right-[5%] w-[45%]" data-speed="-100">
              <Image src="/images/drawing-pool-plan.png" alt="" width={800} height={400}
                className="rotate-[-1deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Row 2 — middle */}
            <div className="c3-collage-img absolute top-[28%] -left-[3%] w-[35%]" data-speed="-40">
              <Image src="/images/sketch-architect.png" alt="" width={700} height={400}
                className="rotate-[2deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="c3-collage-img absolute top-[25%] left-[25%] w-[38%]" data-speed="-70">
              <Image src="/images/sketch-meeting.png" alt="" width={800} height={500}
                className="rotate-[-2deg] object-cover drop-shadow-[0_6px_24px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="c3-collage-img absolute top-[22%] right-[-3%] w-[42%]" data-speed="-55">
              <Image src="/images/sketch-house-2.png" alt="" width={800} height={500}
                className="rotate-[3deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]" />
            </div>

            {/* Row 3 — lower */}
            <div className="c3-collage-img absolute top-[52%] -left-[5%] w-[44%]" data-speed="-90">
              <Image src="/images/drawing-site-plan.png" alt="" width={800} height={500}
                className="rotate-[-1deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="c3-collage-img absolute top-[50%] left-[10%] w-[80%]" data-speed="-30">
              <Image src="/images/sketch-table.png" alt="" width={1200} height={300}
                className="rotate-[0.5deg] object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="c3-collage-img absolute top-[48%] -right-[5%] w-[40%]" data-speed="-60">
              <Image src="/images/sketch-site.png" alt="" width={800} height={1000}
                className="rotate-[-2.5deg] object-cover drop-shadow-[0_6px_24px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Row 4 — bottom */}
            <div className="c3-collage-img absolute -bottom-[8%] -left-[5%] w-[40%]" data-speed="-45">
              <Image src="/images/sketch-house-1b.png" alt="" width={800} height={500}
                className="rotate-[2deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="c3-collage-img absolute -bottom-[5%] left-[28%] w-[38%]" data-speed="-75">
              <Image src="/images/arch-sketch-v2.png" alt="" width={800} height={1000}
                className="rotate-[-1.5deg] object-cover drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="c3-collage-img absolute -bottom-[10%] -right-[5%] w-[42%]" data-speed="-95">
              <Image src="/images/arch-sketch.png" alt="" width={800} height={1000}
                className="rotate-[2.5deg] object-cover drop-shadow-[0_6px_24px_rgba(0,0,0,0.25)]" />
            </div>
          </div>

          {/* Sticky title — stays pinned while cards scroll over it */}
          <div className="sticky top-0 z-0 flex min-h-screen flex-col items-center justify-center px-6 md:px-10">
            <h2 className="relative font-body text-[clamp(3rem,9vw,9rem)] leading-[0.95] font-bold uppercase tracking-[-0.03em] text-[#1a1a1a]" style={{ textWrap: "balance" }}>
              Why Vista 3
            </h2>
            <p className="relative mt-10 max-w-3xl text-center font-body text-xl leading-[1.7] text-[#1a1a1a]/70 md:text-2xl">
              We design and build with intention — rooted in the land, driven
              by craft, and guided by three principles that define every
              decision we make. From first conversation to final walkthrough,
              these commitments are why our clients trust us with their most
              ambitious projects in Costa Rica.
            </p>
          </div>

          {/* Cards — scroll over title, get pinned by GSAP so Heritage covers them */}
          <div className="c3-principles relative z-10 grid md:min-h-screen md:grid-cols-3" style={{ backgroundColor: "#f0f0ec" }}>
            {[
              {
                title: "Design-Led Process",
                desc: "Every project begins with the land — its contours, its light, its relationship to the horizon.",
              },
              {
                title: "Full Transparency",
                desc: "We share openly with our clients, ensuring alignment and trust from the very first meeting.",
              },
              {
                title: "Lasting Value",
                desc: "We build for the long term — architecture that appreciates in beauty, function, and investment returns.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="relative flex flex-col justify-center border-t-2 border-[#1a1a1a]/20 p-8 md:border-l-2 md:border-t-2 md:p-12 first:md:border-l-0"
              >
                <h3 className="font-body text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.05] font-bold text-[#1a1a1a]">
                  {card.title}
                </h3>
                <p className="mt-6 font-body text-xl leading-[1.7] text-[#1a1a1a]/80 md:text-2xl">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ BLOCK 2: Heritage quote + colorful cards — scrolls over pinned cards ══════ */}
        <section className="c3-heritage relative z-10">
          {/* Sticky heading — dark bg, stays pinned */}
          <div className="sticky top-0 z-0 flex min-h-screen items-center bg-[#2e2522] px-6 md:px-10">
            <h2 className="mx-auto max-w-[1200px] font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.15] font-normal text-[#f0ebe4]">
              Heritage does not mean we settle for the past — it can evolve to
              meet the needs of today
            </h2>
          </div>

          {/* Service cards — black bg, grid patterns, sketch overlays */}
          <div className="relative z-10 grid bg-[#0d0d0d] md:min-h-screen md:grid-cols-3">
            {[
              {
                num: "I.",
                title: "Architectural Design",
                desc: "From initial concept through construction documents — every line in dialogue with the site.",
                image: "/images/arch-sketch-v2.png",
                pattern: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px)",
              },
              {
                num: "II.",
                title: "Construction",
                desc: "Full execution with local expertise and international standards at every phase.",
                image: "/images/sketch-table.png",
                pattern: "repeating-linear-gradient(45deg, transparent, transparent 29px, rgba(255,255,255,0.03) 29px, rgba(255,255,255,0.03) 30px), repeating-linear-gradient(-45deg, transparent, transparent 29px, rgba(255,255,255,0.03) 29px, rgba(255,255,255,0.03) 30px)",
              },
              {
                num: "III.",
                title: "Project Management",
                desc: "One point of contact from first sketch to final walkthrough.",
                image: "/images/sketch-architect.png",
                pattern: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.035) 59px, rgba(255,255,255,0.035) 60px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.02) 19px, rgba(255,255,255,0.02) 20px)",
              },
            ].map((card) => (
              <div
                key={card.num}
                className="relative flex flex-col justify-center overflow-hidden border-t border-white/10 p-8 md:border-l md:border-t md:p-12 first:md:border-l-0"
              >
                {/* Grid pattern */}
                <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: card.pattern }} />
                <p className="relative font-mono text-sm tracking-wider text-white/40">{card.num}</p>
                <h3 className="relative mt-3 font-body text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.05] font-bold text-white">
                  {card.title}
                </h3>
                <p className="relative mt-6 font-body text-xl leading-[1.7] text-white/50 md:text-2xl">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. PROJECTS — Card grid ── */}
        <section
          id="work"
          className="bg-[#f0f0ec] px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 md:mb-20">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#1a1a1a]/40">
                Selected work
              </p>
              <h2 className="mt-4 font-body text-[clamp(3rem,9vw,9rem)] leading-[0.95] font-bold uppercase tracking-[-0.03em] text-[#1a1a1a]" style={{ textWrap: "balance" }}>
                Our Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px bg-[#1a1a1a]/10 sm:grid-cols-2 xl:grid-cols-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="c3-proj-card c3-reveal group flex flex-col bg-[#f0f0ec]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="font-display text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-[-0.01em] text-[#1a1a1a]">
                      {project.name}
                    </h3>
                    <p className="mt-3 flex-1 font-body text-sm leading-[1.7] text-[#1a1a1a]/50">
                      {project.tagline}
                    </p>
                    {/* Meta row */}
                    <div className="mt-6 flex items-center justify-between border-t border-[#1a1a1a]/10 pt-4">
                      <p className="font-mono text-[10px] tracking-wider uppercase text-[#1a1a1a]/40">
                        {project.type} &middot; {project.year}
                      </p>
                      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#1a1a1a]/30 transition-[color] duration-300 group-hover:text-[#1a1a1a]">
                        <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── 5. SERVICES — Scroll-driven accordion ── */}
        <section
          id="services"
          className="bg-[#0d0d0d] px-6 py-28 md:px-12 md:py-36"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="c3-reveal mb-16">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50">
                What we do
              </p>
              <h2 className="mt-4 font-body text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-bold tracking-[-0.03em] text-white" style={{ textWrap: "balance" }}>
                Our Services
              </h2>
            </div>
            <div className="c3-services-list">
              {services.map((s, i) => (
                <div
                  key={s.id}
                  className="c3-svc-item border-b border-white/10 py-6"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-[clamp(1.5rem,4vw,3rem)] text-white">
                      {s.title}
                    </h3>
                  </div>
                  <div className="c3-svc-line mt-3 h-px origin-left scale-x-0 bg-white" />
                  <div className="c3-svc-desc h-0 overflow-hidden opacity-0">
                    <p className="pt-4 pb-2 pl-10 font-body text-sm leading-[1.7] text-white/40">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── 7. TESTIMONIALS — Editorial full-width ── */}
        <section className="relative overflow-hidden bg-[#f0f0ec] px-6 py-32 md:px-12 md:py-44">
          {/* Subtle grid pattern */}
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(0,0,0,0.04) 79px, rgba(0,0,0,0.04) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(0,0,0,0.04) 79px, rgba(0,0,0,0.04) 80px)" }} />

          <div className="mx-auto max-w-[1400px]">
            <div className="mb-20 md:mb-28">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#1a1a1a]/40">
                Client testimonials
              </p>
              <h2 className="mt-4 font-body text-[clamp(2.5rem,6vw,5rem)] leading-[1] font-bold tracking-[-0.03em] text-[#1a1a1a]" style={{ textWrap: "balance" }}>
                Trust built through craft
              </h2>
            </div>

            {/* Testimonial cards — staggered editorial layout */}
            <div className="grid gap-px bg-[#1a1a1a]/10 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="c3-reveal group relative flex min-h-[280px] flex-col justify-between bg-[#f0f0ec] p-8 md:min-h-[420px] md:p-10"
                >
                  {/* Large quote mark */}
                  <div>
                    <svg aria-hidden="true" width="48" height="36" viewBox="0 0 48 36" className="mb-8 text-[#1a1a1a]/10">
                      <path d="M0 36V20.4C0 8.4 7.2 1.6 19.2 0l2.4 5.6C13.2 7.2 9.6 12 9.6 18h8.4v18H0Zm28.8 0V20.4C28.8 8.4 36 1.6 48 0l-2.4 5.6C41.2 7.2 37.6 12 37.6 18H48v18H28.8Z" fill="currentColor" />
                    </svg>
                    <p className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-[1.4] tracking-[-0.01em] text-[#1a1a1a]/80 italic">
                      {t.text}
                    </p>
                  </div>

                  {/* Attribution */}
                  <div className="mt-10 border-t border-[#1a1a1a]/10 pt-6">
                    <p className="font-body text-sm font-medium text-[#1a1a1a]">
                      {t.name}
                    </p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.15em] uppercase text-[#1a1a1a]/40">
                      {t.location}
                    </p>
                  </div>

                  {/* Hover accent line */}
                  <div className="absolute top-0 left-0 h-full w-[2px] origin-top scale-y-0 bg-[#1a1a1a] transition-transform duration-500 group-hover:scale-y-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. CTA — Split with drawing ── */}
        <section id="contact" className="bg-[#0d0d0d] px-6 py-28 md:px-12 md:py-36">
          <div className="mx-auto max-w-[1400px]">
            <div className="c3-reveal grid items-center gap-16 md:grid-cols-2">
              <div>
                <h2 className="font-display text-4xl leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
                  Your next project starts with the{" "}
                  <span className="text-white">land</span>.
                </h2>
                <div className="mt-10 flex gap-4">
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                    className="rounded-full border border-white px-8 py-3 font-body text-xs tracking-wider uppercase text-white transition-[background-color,color] duration-300 hover:bg-white hover:text-[#0d0d0d]"
                    aria-label="Contact via WhatsApp"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="rounded-full border border-white/20 px-8 py-3 font-body text-xs tracking-wider uppercase text-white/60 transition-[border-color,color] duration-300 hover:border-white/50 hover:text-white"
                    aria-label="Send email"
                  >
                    Email
                  </a>
                </div>
                <div className="mt-10 space-y-3 font-body text-base text-white/60">
                  <p>{contact.phone}</p>
                  <p>{contact.email}</p>
                  <p>{contact.location}</p>
                </div>
                <div className="mt-8 flex gap-6">
                  {Object.entries(contact.social).map(([key, href]) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs tracking-[0.12em] uppercase text-white/50 transition-colors hover:text-white"
                    >
                      {key}
                    </a>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-[3/4] max-h-[60vh] overflow-hidden">
                  <Image
                    src="/images/drawing-3.png"
                    alt="Architectural drawing"
                    fill
                    className="object-contain invert"
                    sizes="(max-width: 768px) 100vw, 42vw"
                    quality={90}
                  />
                  {/* Emerald tint overlay */}
                  <div className="absolute inset-0 bg-white/20 mix-blend-color" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. FOOTER ── */}
        <footer className="bg-[#0d0d0d]">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="h-px bg-white/10" />
          </div>
          <div className="px-6 py-16 md:px-12 md:py-20">
            <div className="mx-auto max-w-[1400px]">
              <div className="grid gap-12 md:grid-cols-3">
                {/* Logo + tagline */}
                <div>
                  <Image src="/images/logo-white.svg" alt="Vista 3" width={140} height={38} className="opacity-80" />
                  <p className="mt-4 font-body text-base leading-relaxed text-white/50">
                    Architecture rooted in the land.
                    <br />
                    Costa Rica.
                  </p>
                </div>
                {/* Links */}
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50 mb-3">Navigation</p>
                  {[
                    { label: "Work", href: "#work" },
                    { label: "Studio", href: "#studio" },
                    { label: "Services", href: "#services" },
                    { label: "Contact", href: "#contact" },
                  ].map((l) => (
                    <a key={l.label} href={l.href} className="font-body text-base text-white/50 transition-colors hover:text-white">
                      {l.label}
                    </a>
                  ))}
                </div>
                {/* Contact */}
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50 mb-3">Get in touch</p>
                  <p className="font-body text-base text-white/50">{contact.phone}</p>
                  <p className="font-body text-base text-white/50">{contact.email}</p>
                  <p className="font-body text-base text-white/50">{contact.location}</p>
                  <div className="mt-3 flex gap-6">
                    {Object.entries(contact.social).map(([key, href]) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs tracking-[0.12em] uppercase text-white/40 transition-colors hover:text-white"
                      >
                        {key}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/30">
                  &copy; Vista 3 Architects {new Date().getFullYear()}
                </p>
                <Link
                  href="/"
                  className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/30 transition-colors hover:text-white"
                >
                  Back to exploration
                </Link>
              </div>
            </div>
          </div>

          {/* Infinite color stripe with text */}
          <div className="relative h-10 overflow-hidden">
            <div className="animate-marquee flex h-full w-[200%]">
              {[...Array(2)].map((_, rep) => (
                <div key={rep} className="flex h-full w-1/2">
                  {[
                    { bg: "#0d0d0d", text: "#666", label: "Architecture" },
                    { bg: "#1a1a1a", text: "#555", label: "Heritage" },
                    { bg: "#2a2a2a", text: "#777", label: "Design-Led" },
                    { bg: "#3a3a3a", text: "#999", label: "Costa Rica" },
                    { bg: "#4a4a4a", text: "#bbb", label: "Construction" },
                    { bg: "#333", text: "#888", label: "Transparency" },
                    { bg: "#222", text: "#666", label: "Lasting Value" },
                    { bg: "#0d0d0d", text: "#555", label: "Land" },
                    { bg: "#1a1a1a", text: "#777", label: "Craft" },
                    { bg: "#2a2a2a", text: "#999", label: "Management" },
                    { bg: "#3a3a3a", text: "#bbb", label: "Vista 3" },
                    { bg: "#444", text: "#ccc", label: "Pérez Zeledón" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex h-full flex-1 items-center justify-center px-4"
                      style={{ backgroundColor: s.bg }}
                    >
                      <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: s.text }}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
