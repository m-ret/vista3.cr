"use client";

import { useRef, useState, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { projects, services, testimonials, contact, stats, gallery } from "@/data/projects";

const BlueprintScene = lazy(() => import("@/components/direction-2/BlueprintScene"));

export default function Concept02() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark, toggle } = useTheme("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    /* ── HERO: Title slides up, image scales, nav fades ── */
    gsap.fromTo(".c2-letter",
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );
    gsap.fromTo(".c2-hero-sub",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1 }
    );
    gsap.fromTo(".c2-nav-item",
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "power2.out", delay: 1.2 }
    );

    /* ── STICKY NAV: Slide down after hero (desktop only — mobile always visible) ── */
    const navMm = gsap.matchMedia();
    navMm.add("(min-width: 768px)", () => {
      gsap.set(".c2-sticky-nav", { y: "-100%" });
      ScrollTrigger.create({
        trigger: ".c2-hero",
        start: "bottom 80%",
        onEnter: () => gsap.to(".c2-sticky-nav", { y: 0, duration: 0.4, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(".c2-sticky-nav", { y: "-100%", duration: 0.3, ease: "power2.in" }),
      });
    });

    /* ── SCROLL REVEALS ── */
    ScrollTrigger.batch(".c2-reveal", {
      onEnter: (els) => gsap.fromTo(els,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" }),
      start: "top 88%",
    });

    /* ── SERVICES: Each name reveals with a wipe ── */
    gsap.utils.toArray<HTMLElement>(".svc-name").forEach((el) => {
      gsap.fromTo(el,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" } }
      );
    });

    /* ── GALLERY: Stagger masonry ── */
    ScrollTrigger.batch(".gal-item", {
      onEnter: (els) => gsap.fromTo(els,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" }),
      start: "top 92%",
    });

    /* ── STATS: Count up ── */
    gsap.utils.toArray<HTMLElement>(".c2-stat").forEach((el) => {
      const target = parseInt(el.dataset.value || "0");
      ScrollTrigger.create({
        trigger: el, start: "top 85%", once: true,
        onEnter: () => {
          gsap.to({ v: 0 }, {
            v: target, duration: 2, ease: "power2.out",
            onUpdate() { el.textContent = String(Math.round(this.targets()[0].v)); },
          });
        },
      });
    });

    /* ── TESTIMONIAL SLIDER ── */
    const c2Slides = gsap.utils.toArray<HTMLElement>(".c2-test-slide");
    const c2Counter = document.querySelector(".c2-test-counter") as HTMLElement;
    let c2Current = 0;

    const showC2Slide = (idx: number) => {
      c2Slides.forEach((s, j) => {
        if (j === idx) {
          s.classList.remove("hidden");
          gsap.fromTo(s, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        } else {
          s.classList.add("hidden");
        }
      });
      if (c2Counter) c2Counter.textContent = String(idx + 1).padStart(2, "0");
    };

    document.querySelector(".c2-test-prev")?.addEventListener("click", () => {
      c2Current = (c2Current - 1 + c2Slides.length) % c2Slides.length;
      showC2Slide(c2Current);
    });
    document.querySelector(".c2-test-next")?.addEventListener("click", () => {
      c2Current = (c2Current + 1) % c2Slides.length;
      showC2Slide(c2Current);
    });

    /* ── MENU ── */
    if (menuRef.current) {
      if (menuOpen) {
        document.body.style.overflow = "hidden";
        gsap.set(menuRef.current, { display: "flex" });
        gsap.fromTo(menuRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.inOut" });
        gsap.fromTo(".c2-menu-link", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out", delay: 0.2 });
      } else {
        document.body.style.overflow = "";
        gsap.to(menuRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.4, ease: "power3.inOut",
          onComplete() { gsap.set(menuRef.current, { display: "none" }); } });
      }
    }
  }, { scope: containerRef, dependencies: [menuOpen] });

  const navItems = ["Projects", "Services", "Gallery", "Contact"];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-colors duration-500 bg-white text-charcoal dark:bg-deep dark:text-white ${isDark ? "dark" : ""}`}
      style={{ "--font-display": "'Cinzel', serif", "--font-body": "'Josefin Sans', sans-serif" } as React.CSSProperties}
    >

      {/* ━━━ STICKY NAV — appears after hero ━━━ */}
      <nav className="c2-sticky-nav fixed top-0 left-0 right-0 z-50 md:-translate-y-full border-b border-black/5 dark:border-white/10 bg-white/90 dark:bg-deep/90 backdrop-blur-md transition-colors duration-500">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo-white.svg" alt="Vista 3" width={90} height={25} className={isDark ? "" : "invert"} />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="font-body text-sm tracking-[0.12em] uppercase opacity-50 transition-opacity hover:opacity-100">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} toggle={toggle} />
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex cursor-pointer items-center gap-2 opacity-60 hover:opacity-100 md:hidden">
              <span className="relative flex h-4 w-5 flex-col justify-center gap-1">
                <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
                <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ━━━ FULLSCREEN MENU ━━━ */}
      <div ref={menuRef} className="fixed inset-0 z-[60] hidden flex-col justify-center bg-black px-6 md:px-16" style={{ display: "none" }}>
        {/* Close button */}
        <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 z-10 flex cursor-pointer items-center gap-3 text-white/50 transition-colors hover:text-white md:top-8 md:right-10">
          <span className="font-body text-sm tracking-[0.15em] uppercase">Close</span>
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute h-px w-full rotate-45 bg-current" />
            <span className="absolute h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
            className="c2-menu-link group block border-b border-white/10 py-5">
            <span className="font-display text-[clamp(2.5rem,8vw,6rem)] font-normal tracking-wider text-white/20 uppercase transition-colors duration-200 group-hover:text-amber-500">
              {item}
            </span>
          </a>
        ))}
        <div className="mt-10 flex gap-6">
          {Object.entries(contact.social).map(([key, href]) => (
            <a key={key} href={href} target="_blank" rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.15em] text-white/30 uppercase hover:text-white">{key}</a>
          ))}
        </div>
      </div>

      {/* ━━━ HERO — Brand at top, nav below, WebGL blueprint bg, sticky ━━━ */}
      <section className="c2-hero sticky top-0 z-0 relative h-screen overflow-hidden">
        {/* WebGL blueprint background */}
        <div className="absolute inset-0">
          <Suspense fallback={<div className="h-full w-full bg-[#0f0f11]" />}>
            <BlueprintScene />
          </Suspense>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Top — VISTA 3 massive + nav below */}
          <div className="px-6 pt-6 md:px-10 md:pt-8">
            {/* Brand — bold, fills width */}
            <div className="overflow-hidden">
              <h1 className="c2-letter font-display text-[clamp(5rem,20vw,18rem)] leading-[0.85] font-bold tracking-[0.02em] text-white uppercase"
                  style={{ display: "block" }}>
                VISTA 3
              </h1>
            </div>

            {/* Nav links — spread horizontally below the brand */}
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
              <div className="hidden md:flex gap-6 md:gap-10">
                {navItems.map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`}
                    className="c2-nav-item font-body text-base tracking-[0.15em] text-white/60 uppercase transition-colors hover:text-white md:text-lg">
                    + {item}
                  </a>
                ))}
              </div>
              <div className="hidden items-center gap-4 md:flex">
                <ThemeToggle isDark={isDark} toggle={toggle} />
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex cursor-pointer items-center gap-2 text-white/60 hover:text-white">
                  <span className="font-body text-lg tracking-[0.15em] uppercase">Menu</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom — tagline + scroll */}
          <div className="mt-auto px-6 pb-10 md:px-10 md:pb-14">
            <p className="c2-hero-sub max-w-2xl font-body text-xl leading-relaxed text-white/50 md:text-2xl">
              Our architecture firm designs and constructs exceptional residences in Costa Rica — ensuring value and investment returns.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 right-6 z-20 md:right-10">
          <span className="font-body text-[10px] tracking-[0.3em] text-white/30 uppercase">Scroll</span>
        </div>
      </section>

      {/* ━━━ CONTENT — slides over sticky hero ━━━ */}
      <div className="relative z-10 bg-white dark:bg-deep transition-colors duration-500 grain">

      {/* ━━━ STATS ━━━ */}
      <section className="border-b border-black/10 dark:border-white/10 transition-colors duration-500">
        <div className="mx-auto grid max-w-[1440px] grid-cols-3 divide-x divide-black/10 dark:divide-white/10">
          {[
            { value: stats.yearsExperience, suffix: "+", label: "Years", labelFull: "Years Experience" },
            { value: stats.projectsDelivered, suffix: "+", label: "Projects", labelFull: "Projects Delivered" },
            { value: stats.countriesServed, suffix: "", label: "Countries", labelFull: "Countries Served" },
          ].map((s) => (
            <div key={s.labelFull} className="px-3 py-10 text-center md:px-6 md:py-16">
              <p className="font-display text-3xl tracking-tight md:text-6xl">
                <span className="c2-stat" data-value={s.value}>0</span>{s.suffix}
              </p>
              <p className="mt-2 font-body text-[10px] tracking-[0.1em] uppercase opacity-40 md:mt-3 md:text-xs md:tracking-[0.2em]">
                <span className="md:hidden">{s.label}</span>
                <span className="hidden md:inline">{s.labelFull}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ ABOUT ━━━ */}
      <section id="about" className="px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1440px]">
          {/* Text row */}
          <div className="c2-reveal grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <p className="font-body text-xs tracking-[0.3em] uppercase opacity-40">About the studio</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.15] tracking-wider">
                From concept<br />to creation
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-7 flex flex-col justify-end">
              <p className="font-body text-base leading-[1.9] opacity-50">
                Vista 3 designs and constructs properties ensuring value and investment returns. Based in the southern zone of Costa Rica, we serve international clients from California, Canada, and beyond.
              </p>
            </div>
          </div>
          {/* Drawing — full width, natural landscape ratio */}
          <div className="c2-reveal mt-16 relative aspect-[16/9] overflow-hidden border border-black/5 dark:border-white/5">
            <Image src="/images/drawing-pool-plan.png" alt="Architectural site plan" fill className="object-contain dark:invert p-4 md:p-8" sizes="100vw" quality={90} />
          </div>
        </div>
      </section>

      {/* ━━━ PROJECTS — Bento grid with grain background ━━━ */}
      <section id="projects" className="relative overflow-hidden px-6 py-28 md:px-10 md:py-36">
        {/* Blurred heavy grain background */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(180,160,130,0.07), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(160,140,110,0.06), transparent 60%)" }} />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "url('/images/bg-light-noise.png')", backgroundRepeat: "repeat", backgroundSize: "300px 300px" }} />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="c2-reveal mb-16 md:mb-20">
            <p className="font-body text-xs tracking-[0.3em] uppercase opacity-40">Selected work</p>
            <h2 className="mt-4 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-wider uppercase">
              Projects
            </h2>
          </div>

          {/* Bento grid — matches reference: row1=[img, frosted text, img], row2=[wide img, frosted text] */}
          <div className="grid gap-4 md:grid-cols-3 md:auto-rows-[340px] lg:auto-rows-[380px]">

            {/* Row 1 — image | frosted text | image */}
            <div className="c2-reveal group relative overflow-hidden rounded-3xl">
              <Image src={projects[0].image} alt={projects[0].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/50">{projects[0].type}</p>
                <h3 className="mt-1 font-display text-xl tracking-wider text-white uppercase">{projects[0].name}</h3>
              </div>
            </div>

            <div className="c2-reveal flex flex-col justify-end overflow-hidden rounded-3xl border border-black/[0.08] p-8 backdrop-blur-2xl dark:border-white/[0.08] md:p-10" style={{ background: "linear-gradient(145deg, rgba(200,185,165,0.1), rgba(160,145,125,0.15))" }}>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[0.95] font-bold tracking-wider uppercase">
                {projects[0].tagline}
              </h3>
              <p className="mt-4 font-body text-sm leading-[1.8] opacity-50">
                {projects[0].description}
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="font-body text-xs tracking-wider uppercase opacity-30">{projects[0].location}</span>
                <span className="opacity-20">&middot;</span>
                <span className="font-display text-sm tracking-wider opacity-20">{projects[0].year}</span>
              </div>
            </div>

            <div className="c2-reveal group relative overflow-hidden rounded-3xl">
              <Image src={projects[1].image} alt={projects[1].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/50">{projects[1].type}</p>
                <h3 className="mt-1 font-display text-xl tracking-wider text-white uppercase">{projects[1].name}</h3>
              </div>
            </div>

            {/* Row 2 — wide image | frosted text */}
            <div className="c2-reveal group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-1">
              <Image src={projects[2].image} alt={projects[2].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/50">{projects[2].type}</p>
                <h3 className="mt-1 font-display text-[clamp(1.5rem,3vw,2.5rem)] tracking-wider text-white uppercase">{projects[2].name}</h3>
                <p className="mt-2 font-body text-sm italic text-white/40">{projects[2].tagline}</p>
              </div>
            </div>

            <div className="c2-reveal flex flex-col justify-end overflow-hidden rounded-3xl border border-black/[0.08] p-8 backdrop-blur-2xl dark:border-white/[0.08] md:p-10" style={{ background: "linear-gradient(160deg, rgba(180,165,140,0.12), rgba(140,125,105,0.18))" }}>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[0.95] font-bold tracking-wider uppercase">
                {projects[3].name}
              </h3>
              <p className="mt-4 font-body text-sm leading-[1.8] opacity-50">
                {projects[3].description}
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="font-body text-xs tracking-wider uppercase opacity-30">{projects[3].location}</span>
                <span className="opacity-20">&middot;</span>
                <span className="font-display text-sm tracking-wider opacity-20">{projects[3].year}</span>
              </div>
            </div>

            {/* Row 3 — frosted text | wide image */}
            <div className="c2-reveal flex flex-col justify-end overflow-hidden rounded-3xl border border-black/[0.08] p-8 backdrop-blur-2xl dark:border-white/[0.08] md:p-10" style={{ background: "linear-gradient(135deg, rgba(170,155,135,0.1), rgba(150,135,115,0.14))" }}>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[0.95] font-bold tracking-wider uppercase">
                {projects[1].tagline}
              </h3>
              <p className="mt-4 font-body text-sm leading-[1.8] opacity-50">
                {projects[1].description}
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="font-body text-xs tracking-wider uppercase opacity-30">{projects[1].location}</span>
                <span className="opacity-20">&middot;</span>
                <span className="font-display text-sm tracking-wider opacity-20">{projects[1].year}</span>
              </div>
            </div>

            <div className="c2-reveal group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-1">
              <Image src={projects[3].image} alt={projects[3].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/50">{projects[3].type}</p>
                <h3 className="mt-1 font-display text-[clamp(1.5rem,3vw,2.5rem)] tracking-wider text-white uppercase">{projects[3].name}</h3>
                <p className="mt-2 font-body text-sm italic text-white/40">{projects[3].tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SERVICES — Massive names, wipe reveal ━━━ */}
      <section id="services" className="px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1440px]">
          <p className="c2-reveal font-body text-xs tracking-[0.3em] uppercase opacity-40">What we do</p>
          <div className="mt-16 space-y-0">
            {services.map((s, i) => (
              <div key={s.id} className="group border-b border-black/10 dark:border-white/10 py-8 md:py-10 transition-colors duration-500">
                <div className="grid items-baseline gap-4 md:grid-cols-12">
                  <span className="font-body text-xs opacity-20 md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="svc-name font-display text-[clamp(1.8rem,4vw,3.5rem)] tracking-wider uppercase md:col-span-5 transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {s.title}
                  </h3>
                  <p className="font-body text-base leading-[1.8] opacity-50 md:col-span-5 md:col-start-8">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ PROCESS — ARCHITECTURAL DRAWING ━━━ */}
      <section className="px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="c2-reveal grid items-center gap-10 md:grid-cols-12 md:gap-0">
            {/* Drawing — portrait, right-sized */}
            <div className="relative order-2 md:order-none md:col-span-5 md:row-span-2">
              <div className="relative aspect-[3/4] max-h-[60vh] md:max-h-none overflow-hidden">
                <Image src="/images/drawing-3.png" alt="Concept Site Plan" fill className="object-contain dark:invert" sizes="(max-width: 768px) 100vw, 42vw" quality={90} />
              </div>
            </div>
            {/* Text — bold, monumental styling */}
            <div className="order-1 md:order-none md:col-span-6 md:col-start-7">
              <p className="font-body text-xs tracking-[0.3em] uppercase opacity-40">Process</p>
              <h3 className="mt-6 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-wider uppercase">
                Every project<br />begins with<br />the <span className="text-amber-500">land</span>
              </h3>
              <div className="mt-8 h-px w-16 bg-amber-500/40" />
              <p className="mt-8 max-w-md font-body text-base leading-[1.9] opacity-50">
                Its contours, its light, its relationship to the horizon. We design architecture that doesn't impose on landscape but emerges from it — every line in dialogue with the site.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-8">
                <div>
                  <p className="font-display text-2xl tracking-wider text-amber-500/80 md:text-3xl">01</p>
                  <p className="mt-2 font-body text-xs tracking-[0.15em] uppercase opacity-40">Site analysis</p>
                </div>
                <div>
                  <p className="font-display text-2xl tracking-wider text-amber-500/80 md:text-3xl">02</p>
                  <p className="mt-2 font-body text-xs tracking-[0.15em] uppercase opacity-40">Design & construct</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ VISUAL BREAK — Full-bleed cinematic statement ━━━ */}
      <section className="c2-reveal relative h-[70vh] md:h-screen overflow-hidden">
        {/* Full background image */}
        <Image src="/images/golden-view-3.jpg" alt="Vista 3 Architecture" fill className="object-cover" sizes="100vw" quality={90} />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Content — pinned bottom-left, massive */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-16 md:px-10 md:pb-24">
            <div className="mx-auto max-w-[1440px]">
              <p className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.95] tracking-wider text-white uppercase">
                Built to inspire.
              </p>
              <p className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.95] tracking-wider text-white uppercase">
                Built to <span className="text-amber-500">last.</span>
              </p>
              <div className="mt-8 h-px w-20 bg-amber-500/50" />
              <p className="mt-8 max-w-lg font-body text-base leading-[1.8] text-white/50 md:text-lg">
                Every material choice — exposed concrete, tropical hardwood, floor-to-ceiling glass — serves both the architecture and the landscape it frames.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ GALLERY — Dark section, masonry with varied sizes ━━━ */}
      <section id="gallery" className="bg-charcoal dark:bg-black py-28 md:py-36 transition-colors duration-500">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="c2-reveal mb-16 flex items-baseline justify-between">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-wider text-white uppercase">Gallery</h2>
            <span className="font-body text-xs text-white/30">{gallery.length} frames</span>
          </div>
          <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
            {gallery.slice(0, 14).map((img, i) => (
              <div key={i} className="gal-item mb-3 break-inside-avoid overflow-hidden group cursor-pointer">
                <div className="relative overflow-hidden">
                  <Image src={img} alt={`Vista 3 ${i + 1}`} width={800} height={1000}
                    className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-110" quality={85} />
                  <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
                  <span className="absolute bottom-3 right-3 font-mono text-[9px] text-white/0 transition-colors duration-300 group-hover:text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS — One at a time, cinematic ━━━ */}
      <section className="px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="c2-reveal flex items-baseline justify-between mb-20">
            <p className="font-body text-sm tracking-[0.3em] uppercase opacity-40">Client stories</p>
            <p className="font-body text-sm opacity-30">
              <span className="c2-test-counter">01</span> / {String(testimonials.length).padStart(2, "0")}
            </p>
          </div>

          <div className="c2-testimonials relative">
            {testimonials.map((t, i) => (
              <div key={i} className={`c2-test-slide ${i > 0 ? "hidden" : ""}`}>
                <div className="grid gap-12 md:grid-cols-12">
                  <div className="md:col-span-1 flex items-start">
                    <span className="font-display text-[clamp(4rem,8vw,8rem)] leading-none text-amber-500/20">&ldquo;</span>
                  </div>
                  <div className="md:col-span-9">
                    <p className="font-display text-[clamp(1.6rem,3.5vw,3rem)] leading-[1.3] tracking-wide">
                      {t.text}
                    </p>
                    <div className="mt-10 flex items-center gap-5">
                      <div className="h-px w-12 bg-amber-500/30" />
                      <div>
                        <p className="font-body text-base font-medium">{t.name}</p>
                        <p className="mt-1 font-body text-xs tracking-[0.2em] uppercase opacity-40">{t.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <div className="mt-14 flex justify-end gap-3">
            <button className="c2-test-prev flex h-12 w-12 cursor-pointer items-center justify-center border border-black/10 dark:border-white/10 transition-colors hover:border-amber-500 hover:text-amber-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>
            </button>
            <button className="c2-test-next flex h-12 w-12 cursor-pointer items-center justify-center border border-black/10 dark:border-white/10 transition-colors hover:border-amber-500 hover:text-amber-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ CTA + FOOTER ━━━ */}
      <footer id="contact" className="relative overflow-hidden bg-black text-white dark:bg-white dark:text-black transition-colors duration-500">
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className={`font-display text-[clamp(8rem,25vw,20rem)] tracking-[0.1em] uppercase ${isDark ? "text-black/[0.03]" : "text-white/[0.03]"}`}>
            V3
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
          {/* CTA */}
          <div className="grid gap-16 py-28 md:grid-cols-12 md:py-40">
            <div className="md:col-span-7">
              <p className="font-body text-xs tracking-[0.3em] uppercase opacity-40">Start your project</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-wider uppercase">
                Make Costa Rica<br />your strategic<br />
                <span className="text-amber-500">investment</span>.
              </h2>
              <div className="mt-10 flex gap-4">
                <a href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                  className={`cursor-pointer px-8 py-3.5 font-body text-xs tracking-wider uppercase transition-all ${isDark ? "bg-black text-white hover:bg-amber-500 hover:text-black" : "bg-white text-black hover:bg-amber-500 hover:text-black"}`}>
                  WhatsApp
                </a>
                <a href={`mailto:${contact.email}`}
                  className={`cursor-pointer border px-8 py-3.5 font-body text-xs tracking-wider uppercase transition-all ${isDark ? "border-black/20 hover:border-black/60" : "border-white/20 hover:border-white/60"}`}>
                  Email
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
              <div className="space-y-3 font-body text-sm opacity-50">
                <p>{contact.phone}</p>
                <p>{contact.email}</p>
                <p>{contact.location}</p>
              </div>
              <div className="mt-6 flex gap-5">
                {Object.entries(contact.social).map(([key, href]) => (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                    className="font-body text-xs tracking-[0.15em] uppercase opacity-30 transition-opacity hover:opacity-100">{key}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Logo + footer bar */}
          <div className="flex justify-center pb-10">
            <Image src="/images/logo-white.svg" alt="Vista 3" width={350} height={95}
              className={`opacity-15 ${isDark ? "invert" : ""}`} />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 dark:border-black/10 py-8 md:flex-row transition-colors duration-500">
            <Image src="/images/logo-white.svg" alt="Vista 3" width={80} height={22}
              className={`opacity-40 ${isDark ? "invert" : ""}`} />
            <p className="font-body text-xs tracking-[0.15em] uppercase opacity-30">
              &copy; Vista 3 Architects {new Date().getFullYear()}
            </p>
            <Link href="/" className="font-body text-xs tracking-[0.15em] uppercase opacity-30 transition-opacity hover:opacity-100">
              Back to exploration
            </Link>
          </div>
        </div>
      </footer>
      </div>{/* end content wrapper */}
    </div>
  );
}
