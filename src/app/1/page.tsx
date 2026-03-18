"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
// import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { projects, services, testimonials, contact, stats, gallery } from "@/data/projects";

/* ─── Hero carousel images — real dimensions for natural ratios ─── */
const heroSlides = [
  { src: "/images/golden-view-1.jpg", label: "Golden View", location: "Pérez Zeledón", year: "2024", w: 6141, h: 3424 },
  { src: "/images/clifftop-oasis.webp", label: "Clifftop Oasis", location: "Dominical", year: "2024", w: 2000, h: 1125 },
  { src: "/images/golden-view-3.jpg", label: "Golden View", location: "Interior", year: "2024", w: 6141, h: 3424 },
  { src: "/images/gallery-9.webp", label: "Pura Vida Falls", location: "Pérez Zeledón", year: "2025", w: 1920, h: 2560 },
  { src: "/images/golden-view-2.jpg", label: "Golden View", location: "Living Space", year: "2024", w: 6141, h: 3424 },
  { src: "/images/gallery-10.webp", label: "La S Estates", location: "Uvita", year: "2025", w: 1920, h: 2560 },
  { src: "/images/drawing-pool-plan.png", label: "Pool Concept", location: "Design", year: "2025", w: 1920, h: 1080 },
];


export default function Concept01() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark, toggle } = useTheme("dark");
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ─── GSAP Animations ─── */
  useGSAP(
    () => {
      /* Nav solidify on scroll */
      ScrollTrigger.create({
        trigger: ".hero-section",
        start: "bottom 80px",
        onEnter: () => setNavSolid(true),
        onLeaveBack: () => setNavSolid(false),
      });

      /* Hero — auto-scrolling marquee + drag with inertia */
      const heroTrack = document.querySelector(".hero-track") as HTMLElement;
      if (heroTrack) {
        // Clone children for seamless loop
        const originals = Array.from(heroTrack.children);
        originals.forEach((child) => heroTrack.appendChild(child.cloneNode(true)));

        const totalW = heroTrack.scrollWidth / 2;
        const state = { x: 0, dragging: false, startX: 0, velocity: 0, lastX: 0, lastTime: 0, autoSpeed: -1.5 };

        // Wrap helper — keeps x within -totalW..0
        const wrap = (v: number) => {
          let n = v % totalW;
          if (n > 0) n -= totalW;
          return n;
        };

        // Main RAF loop — handles both auto-scroll and drag
        const tick = () => {
          if (!state.dragging) {
            state.x += state.autoSpeed;
            // Decay any leftover velocity from drag release
            if (Math.abs(state.velocity) > 0.1) {
              state.x += state.velocity;
              state.velocity *= 0.95;
            }
          }
          state.x = wrap(state.x);
          gsap.set(heroTrack, { x: state.x });
        };
        gsap.ticker.add(tick);

        // Pointer drag
        const onDown = (e: PointerEvent) => {
          state.dragging = true;
          state.velocity = 0;
          state.startX = e.clientX;
          state.lastX = e.clientX;
          state.lastTime = Date.now();
          heroTrack.setPointerCapture(e.pointerId);
        };

        const onMove = (e: PointerEvent) => {
          if (!state.dragging) return;
          const dx = e.clientX - state.lastX;
          state.x += dx;

          // Track velocity for inertia
          const now = Date.now();
          const dt = now - state.lastTime;
          if (dt > 0) state.velocity = dx / dt * 16; // normalize to ~60fps

          state.lastX = e.clientX;
          state.lastTime = now;
        };

        const onUp = () => {
          state.dragging = false;
        };

        heroTrack.addEventListener("pointerdown", onDown);
        heroTrack.addEventListener("pointermove", onMove);
        heroTrack.addEventListener("pointerup", onUp);
        heroTrack.addEventListener("pointercancel", onUp);

        // Slow auto on hover, resume on leave
        heroTrack.addEventListener("mouseenter", () => { state.autoSpeed = -0.8; });
        heroTrack.addEventListener("mouseleave", () => { state.autoSpeed = -2.0; });

        // Prevent image drag
        heroTrack.addEventListener("dragstart", (e) => e.preventDefault());
      }

      /* ── Intro: centered text slides to final position, carousel rises from below ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      // Measure final positions of the brand text at bottom of hero
      const vistaFinal = document.querySelector(".brand-vista") as HTMLElement;
      const archFinal = document.querySelector(".brand-arch") as HTMLElement;
      const introVista = document.querySelector(".intro-vista") as HTMLElement;
      const introArch = document.querySelector(".intro-arch") as HTMLElement;

      if (vistaFinal && archFinal && introVista && introArch) {
        const vfRect = vistaFinal.getBoundingClientRect();
        const afRect = archFinal.getBoundingClientRect();
        const ivRect = introVista.getBoundingClientRect();
        const iaRect = introArch.getBoundingClientRect();

        // How far each needs to slide from center to final pos
        const vDx = vfRect.left - ivRect.left;
        const vDy = vfRect.top - ivRect.top;
        const aDx = afRect.left - iaRect.left;
        const aDy = afRect.top - iaRect.top;

        // Scale ratio (final might be same size, but just in case)
        const vScale = vfRect.width / ivRect.width;
        const aScale = afRect.width / iaRect.width;

        tl
          // Initial state
          .set(".hero-images-wrap", { yPercent: 100 })
          .set(".hero-nav", { y: -80 })
          .set(".hero-brand", { visibility: "hidden" })
          .set(".intro-bg", { opacity: 1 })

          // 1. Hold centered for a moment
          .to({}, { duration: 0.8 })

          // 2. Slide text to final positions + fade overlay bg so carousel is visible
          .to(".intro-vista", {
            x: vDx, y: vDy, scale: vScale,
            duration: 1.2,
            ease: "power3.inOut",
          }, "slide")
          .to(".intro-arch", {
            x: aDx, y: aDy, scale: aScale,
            duration: 1.2,
            ease: "power3.inOut",
          }, "slide")
          .to(".intro-bg", {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          }, "slide")

          // 3. Carousel slides up from bottom (starts with the slide)
          .to(".hero-images-wrap", {
            yPercent: 0,
            duration: 1.4,
            ease: "power3.out",
          }, "slide")

          // 4. Nav slides down
          .to(".hero-nav", {
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          }, "slide+=0.6")

          // 5. Hide overlay, show real brand text
          .set(".intro-overlay", { pointerEvents: "none", display: "none" })
          .set(".hero-brand", { visibility: "visible" });
      }

      /* Philosophy section — line grows, then typewriter on scroll */
      gsap.fromTo(".philosophy-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: "power2.inOut",
          scrollTrigger: { trigger: ".philosophy-section", start: "top 80%" },
        }
      );

      const chars = gsap.utils.toArray<HTMLElement>(".typo-char");
      if (chars.length) {
        // Trigger once when section enters — type out automatically
        ScrollTrigger.create({
          trigger: ".philosophy-text",
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              opacity: 1,
              duration: 0.01,
              stagger: 0.03,
              ease: "none",
            });
          },
        });
      }

      // Blinking dot/period — always animating
      const dot = document.querySelector(".typo-dot") as HTMLElement;
      if (dot) {
        gsap.to(dot, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
        });
      }

      /* Scroll reveals with stagger */
      ScrollTrigger.batch(".reveal", {
        onEnter: (elements) => {
          gsap.fromTo(elements,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" }
          );
        },
        start: "top 88%",
      });

      /* Projects — each card pins, next one scrolls over it */
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i, arr) => {
        if (i < arr.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            pin: true,
            pinSpacing: false,
            endTrigger: arr[arr.length - 1],
            end: "top top",
          });
        }
      });

      /* Projects — image scales from 0.85 to 1 on scroll + arc expands */
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        const img = card.querySelector(".project-scale-img");
        const arc = card.querySelector(".project-arc svg circle");

        if (img) {
          gsap.fromTo(img,
            { scale: 0.85 },
            {
              scale: 1, ease: "none",
              scrollTrigger: { trigger: card, start: "top 90%", end: "top 20%", scrub: 1 },
            }
          );
        }

        if (arc) {
          gsap.fromTo(arc,
            { attr: { r: 40 }, opacity: 0 },
            {
              attr: { r: 240 }, opacity: 1, ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 80%", end: "top 10%", scrub: 1 },
            }
          );
        }
      });

      /* Services — highlight band sweeps vertically through stacked names */
      const svcBand = document.querySelector(".service-band") as HTMLElement;
      const svcStack = document.querySelector(".service-stack") as HTMLElement;
      const svcImages: HTMLElement[] = [];
      const svcBg = document.querySelector(".service-bg") as HTMLElement;
      const svcSection = document.querySelector(".services-scroll") as HTMLElement;
      const svcNames = gsap.utils.toArray<HTMLElement>(".service-name");

      // Uses charcoal from theme: --color-charcoal: #1a1a1a
      const charcoal = getComputedStyle(document.documentElement).getPropertyValue("--color-charcoal").trim() || "#1a1a1a";
      const svcColors = [charcoal, charcoal, charcoal, charcoal];
      let lastSvcImg = -1;

      if (svcSection && svcBand && svcStack) {
        const count = svcNames.length;

        // Band sweep — tied to the text stack
        ScrollTrigger.create({
          trigger: ".service-stack",
          start: "top 50%",
          end: "bottom 50%",
          onUpdate: (self) => {
            const p = self.progress;
            const bandSize = 25;
            const top = p * (100 - bandSize);
            const bottom = 100 - top - bandSize;
            svcBand.style.clipPath = `inset(${top}% 0% ${bottom}% 0%)`;

            // Image swap — same progress
            const activeIdx = Math.min(count - 1, Math.floor(p * count));
            if (activeIdx !== lastSvcImg) {
              lastSvcImg = activeIdx;
              svcImages.forEach((img, j) => {
                (img as HTMLElement).style.opacity = j === activeIdx ? "1" : "0";
                (img as HTMLElement).style.transition = "opacity 0.3s";
              });
            }
          },
        });
      }

      /* Gallery — auto-playing filmstrip, two rows opposite directions */
      const row1 = document.querySelector(".filmstrip-row-1") as HTMLElement;
      const row2 = document.querySelector(".filmstrip-row-2") as HTMLElement;

      if (row1) {
        // Clone for seamless loop
        row1.innerHTML += row1.innerHTML;
        const w1 = row1.scrollWidth / 2;
        gsap.to(row1, { x: -w1, duration: 35, ease: "none", repeat: -1 });
      }
      if (row2) {
        row2.innerHTML += row2.innerHTML;
        const w2 = row2.scrollWidth / 2;
        gsap.set(row2, { x: -w2 });
        gsap.to(row2, { x: 0, duration: 40, ease: "none", repeat: -1 });
      }

      /* Testimonial slider — prev/next arrows */
      const slides = gsap.utils.toArray<HTMLElement>(".testimonial-slide");
      const counter = document.querySelector(".testimonial-counter") as HTMLElement;
      let currentSlide = 0;

      const showSlide = (idx: number) => {
        slides.forEach((s, j) => {
          if (j === idx) {
            s.classList.remove("hidden");
            gsap.fromTo(s, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          } else {
            s.classList.add("hidden");
          }
        });
        if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
      };

      document.querySelector(".testimonial-prev")?.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
      document.querySelector(".testimonial-next")?.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });

      /* CTA title reveal */
      gsap.fromTo(".cta-title",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".cta-section", start: "top 80%" },
        }
      );
    },
    { scope: containerRef }
  );

  /* ─── Menu animation ─── */
  useGSAP(() => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll(".menu-item");
    const bg = menuRef.current;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(bg, { display: "flex" });
      gsap.fromTo(bg, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power3.inOut" });
      gsap.fromTo(items, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.3 });
      gsap.fromTo(".menu-footer", { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.6 });
    } else {
      document.body.style.overflow = "";
      gsap.to(items, { y: -40, opacity: 0, duration: 0.3, stagger: 0.03, ease: "power2.in" });
      gsap.to(bg, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "power3.inOut", delay: 0.2, onComplete() { gsap.set(bg, { display: "none" }); } });
    }
  }, { dependencies: [menuOpen] });

  return (
      <div
        ref={containerRef}
        className={`min-h-screen transition-colors duration-700 bg-off-white text-charcoal dark:bg-deep dark:text-warm-200 ${isDark ? "dark" : ""}`}
      >
        {/* ━━━ NAV — Centered pill in hero, splits to logo left + controls right ━━━ */}
        <div className="hero-nav fixed top-0 left-0 right-0 z-50 pt-4 md:pt-5">
          <div className={`mx-auto flex max-w-[1440px] items-center justify-center px-4 md:px-8 transition-all duration-500 ${
            navSolid && !menuOpen ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
          }`}>
            <nav
              className={`group/nav relative flex items-center gap-4 rounded-full px-4 py-2 transition-all duration-500 ${
                menuOpen
                  ? "bg-warm-900/90 dark:bg-deep/90"
                  : "bg-charcoal/60 dark:bg-warm-900/60 hover:bg-charcoal/75 dark:hover:bg-warm-900/75"
              } backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.15)]`}
            >
              <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/nav:opacity-100 bg-gradient-to-r from-white/[0.07] via-white/[0.12] to-white/[0.04]" />

              <Link href="/" className="relative z-[60] shrink-0 opacity-90 hover:opacity-100">
                <Image src="/images/logo-white.svg" alt="Vista 3" width={110} height={30} />
              </Link>

              <ThemeToggle isDark={isDark} toggle={toggle} />

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative z-[60] flex cursor-pointer items-center text-white/70 transition-colors duration-300 hover:text-white"
              >
                <span className="relative flex h-4 w-5 flex-col justify-center gap-1">
                  <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
                  <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* ━━━ SPLIT NAV — logo left, controls right (appears after hero) ━━━ */}
        <div className={`fixed top-0 left-0 right-0 z-50 pt-4 md:pt-5 transition-all duration-500 ${
          navSolid && !menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}>
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 md:px-8">
            {/* Logo — left */}
            <Link href="/" className="relative z-[60]">
              <Image
                src="/images/logo-white.svg"
                alt="Vista 3"
                width={100}
                height={28}
                className={`transition-all duration-300 ${isDark ? "invert-0" : "invert"}`}
              />
            </Link>

            {/* Controls — right */}
            <div className="group/ctrl relative flex items-center gap-4 rounded-full px-4 py-2 bg-charcoal/60 dark:bg-warm-900/60 hover:bg-charcoal/75 dark:hover:bg-warm-900/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.15)] transition-all duration-500">
              <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/ctrl:opacity-100 bg-gradient-to-r from-white/[0.07] via-white/[0.12] to-white/[0.04]" />
              <ThemeToggle isDark={isDark} toggle={toggle} />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative z-[60] flex cursor-pointer items-center text-white/70 transition-colors duration-300 hover:text-white"
              >
                <span className="relative flex h-4 w-5 flex-col justify-center gap-1">
                  <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
                  <span className={`h-px w-full bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ━━━ FULLSCREEN MENU ━━━ */}
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 hidden flex-col bg-warm-900 dark:bg-deep"
          style={{ display: "none" }}
        >
          <div className="flex flex-1 flex-col justify-center px-6 md:px-12">
            <div className="mx-auto w-full max-w-[1440px]">
              {[
                { label: "Projects", href: "#projects" },
                { label: "Services", href: "#services" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => setHoveredMenuItem(i)}
                  onMouseLeave={() => setHoveredMenuItem(null)}
                  className="menu-item group block border-b border-warm-800 dark:border-warm-800"
                >
                  <div className="flex items-baseline justify-between py-4 md:py-5">
                    <span
                      className={`font-heading text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-bold tracking-[-0.04em] uppercase transition-all duration-300 ${
                        hoveredMenuItem === i
                          ? "text-warm-400 translate-x-4"
                          : hoveredMenuItem !== null
                            ? "text-warm-700"
                            : "text-warm-100"
                      }`}
                    >
                      {item.label}
                    </span>
                    <svg
                      className={`h-6 w-6 md:h-8 md:w-8 transition-all duration-300 ${
                        hoveredMenuItem === i ? "text-warm-400 translate-x-0 opacity-100" : "text-warm-700 -translate-x-4 opacity-0"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Menu footer */}
          <div className="menu-footer px-6 pb-8 md:px-12">
            <div className="mx-auto flex max-w-[1440px] items-end justify-between">
              <div className="space-y-2 font-mono text-xs tracking-wider text-warm-600">
                <p>{contact.phone}</p>
                <p>{contact.email}</p>
              </div>
              <div className="flex gap-5">
                {Object.entries(contact.social).map(([key, href]) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs tracking-[0.12em] text-warm-600 uppercase transition-colors hover:text-warm-300"
                  >
                    {key}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ INTRO OVERLAY — centered text that splits ━━━ */}
        <div className="intro-overlay pointer-events-none fixed inset-0 z-30">
          {/* Background — fades out to reveal carousel */}
          <div className="intro-bg absolute inset-0 bg-off-white dark:bg-deep transition-colors duration-700" />
          {/* Text — slides to final position */}
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 lg:flex-row lg:gap-6">
              <span className="intro-vista font-heading text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] font-bold tracking-[-0.04em] uppercase text-charcoal dark:text-warm-400">
                Vista 3
              </span>
              <span className="intro-arch font-heading text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] font-bold tracking-[-0.04em] uppercase text-charcoal dark:text-warm-400">
                Architecture
              </span>
            </div>
          </div>
        </div>

        {/* ━━━ HERO — Sticky, content scrolls over it ━━━ */}
        <section className="hero-section sticky top-0 z-0 flex h-screen flex-col overflow-hidden pt-20 bg-cream dark:bg-warm-900">
          {/* Images — vertically centered, true aspect ratios */}
          <div className="hero-images-wrap flex flex-1 items-center">
            <div
              className="hero-track flex cursor-grab items-center gap-5 active:cursor-grabbing md:gap-7"
              style={{ willChange: "transform" }}
            >
              {heroSlides.map((slide, i) => {
                const isPortrait = slide.h > slide.w;
                // Landscape: same size as before (h-[45vh], width from ratio)
                // Portrait: taller — natural ratio from same base width
                const displayW = slide.w;
                const displayH = slide.h;

                return (
                  <div
                    key={i}
                    className="hero-slide group relative shrink-0"
                    onMouseEnter={() => setHoveredSlide(i)}
                    onMouseLeave={() => setHoveredSlide(null)}
                  >
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        hoveredSlide !== null && hoveredSlide !== i ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.label}
                        width={displayW}
                        height={displayH}
                        priority={i < 2}
                        className={`max-w-none transition-transform duration-[1s] ease-out group-hover:scale-[1.03] ${
                          isPortrait
                            ? "h-[70vh] w-auto"
                            : "h-[45vh] w-auto"
                        }`}
                        quality={85}
                      />
                    </div>

                    {/* Label on hover */}
                    <div
                      className={`mt-3 flex items-baseline justify-between transition-all duration-400 ${
                        hoveredSlide === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                    >
                      <span className="font-mono text-[9px] tracking-[0.15em] text-warm-400 dark:text-warm-500 uppercase">
                        {slide.year} — {slide.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-body text-[11px] text-charcoal dark:text-warm-200">
                        {slide.label}
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand text — bottom of hero, readable */}
          <div className="hero-brand flex shrink-0 flex-col px-6 pb-6 lg:flex-row lg:items-baseline lg:justify-between md:px-12 md:pb-10">
            <h1 className="brand-vista w-fit font-heading text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] font-bold tracking-[-0.04em] uppercase text-charcoal dark:text-warm-400">
              Vista 3
            </h1>
            <h1 className="brand-arch w-fit font-heading text-[clamp(2rem,12vw,10rem)] leading-[0.85] font-bold tracking-[-0.04em] uppercase text-charcoal dark:text-warm-400">
              Architecture
            </h1>
          </div>
        </section>

        {/* ━━━ MAIN CONTENT — slides over the sticky hero ━━━ */}
        <div className="relative z-10 bg-white dark:bg-charcoal transition-colors duration-700">

        {/* ━━━ PHILOSOPHY STRIP — typewriter on scroll ━━━ */}
        <section className="philosophy-section px-6 py-32 md:px-12 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <div className="philosophy-line mx-auto h-px w-full max-w-xs bg-warm-300 dark:bg-warm-700 origin-left" />
            <p className="philosophy-text mt-16 text-center font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.3] font-light tracking-[-0.01em]">
              {"From concept to creation — a team committed to transcendent design and strategic investment performance".split("").map((char, i) => (
                <span key={i} className="typo-char" style={{ opacity: 0 }}>
                  {char}
                </span>
              ))}
              <span className="typo-dot inline-block" style={{ opacity: 1 }}>.</span>
            </p>
          </div>
        </section>

        {/* ━━━ PROJECTS — Archidomo-style with expanding images + arc ━━━ */}
        <section id="projects">
          {/* Header */}
          <div className="px-6 pt-28 pb-16 md:px-12">
            <div className="reveal mx-auto max-w-[1440px]">
              <p className="font-mono text-sm tracking-[0.25em] text-warm-400 uppercase">Selected work</p>
              <h2 className="mt-4 font-display text-6xl font-light tracking-[-0.02em] md:text-8xl">Projects</h2>
            </div>
          </div>

          {/* Project cards */}
          <div>
            {projects.map((project, i) => (
              <div
                key={project.id}
                className="project-card relative will-change-transform"
                style={{ zIndex: i + 1 }}
              >
                <div className={`min-h-screen bg-white dark:bg-charcoal transition-colors duration-700 ${i > 0 ? "shadow-[0_-20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_-20px_60px_rgba(0,0,0,0.3)]" : ""}`}>
                <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-0 md:min-h-screen flex items-center">
                  <div className="relative grid items-start gap-10 md:grid-cols-12 md:gap-16">

                    {/* Decorative geometric patterns — unique per project */}
                    <div className="project-arc pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
                      <svg viewBox="0 0 1200 800" fill="none" className="absolute inset-0 h-full w-full text-warm-200 dark:text-warm-800" preserveAspectRatio="none">
                        {i === 0 && (<>
                          {/* Arc + diagonal line */}
                          <circle cx="1100" cy="400" r="300" stroke="currentColor" strokeWidth="1" />
                          <line x1="900" y1="0" x2="1200" y2="800" stroke="currentColor" strokeWidth="1" />
                        </>)}
                        {i === 1 && (<>
                          {/* Angled rectangle + parallel lines */}
                          <rect x="50" y="100" width="350" height="500" rx="0" stroke="currentColor" strokeWidth="1" transform="rotate(-8 225 350)" fill="none" />
                          <line x1="0" y1="200" x2="400" y2="150" stroke="currentColor" strokeWidth="1" />
                          <line x1="0" y1="400" x2="400" y2="350" stroke="currentColor" strokeWidth="1" />
                        </>)}
                        {i === 2 && (<>
                          {/* Double arc + cross line */}
                          <circle cx="1050" cy="200" r="200" stroke="currentColor" strokeWidth="1" />
                          <circle cx="1050" cy="200" r="280" stroke="currentColor" strokeWidth="1" />
                          <line x1="800" y1="0" x2="1200" y2="600" stroke="currentColor" strokeWidth="1" />
                        </>)}
                        {i === 3 && (<>
                          {/* Diamond + diagonal grid */}
                          <rect x="80" y="200" width="300" height="300" stroke="currentColor" strokeWidth="1" transform="rotate(45 230 350)" fill="none" />
                          <line x1="0" y1="100" x2="500" y2="700" stroke="currentColor" strokeWidth="1" />
                          <line x1="100" y1="0" x2="600" y2="600" stroke="currentColor" strokeWidth="1" />
                        </>)}
                      </svg>
                    </div>

                    {/* Image — expands on scroll */}
                    <div className={`project-img-wrap overflow-hidden ${i % 2 === 0 ? "md:col-span-7" : "md:col-span-7 md:col-start-6"}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          className="project-scale-img object-cover transition-transform duration-[1.5s] ease-out"
                          sizes="(max-width: 768px) 100vw, 58vw"
                          quality={90}
                        />
                      </div>
                    </div>

                    {/* Text — bigger, readable */}
                    <div className={`relative z-10 ${i % 2 === 0 ? "md:col-span-4 md:col-start-9" : "md:col-span-4 md:col-start-1 md:row-start-1"}`}>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-warm-300 dark:text-warm-600">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px flex-1 bg-warm-200 dark:bg-warm-800 transition-colors duration-700" />
                      </div>
                      <p className="mt-5 font-mono text-xs tracking-[0.2em] text-warm-400 dark:text-warm-500 uppercase">
                        {project.type} — {project.location}
                      </p>
                      <h3 className="mt-4 font-display text-4xl font-light tracking-[-0.01em] text-charcoal dark:text-warm-100 md:text-5xl">
                        {project.name}
                      </h3>
                      <p className="mt-3 font-display text-lg italic text-warm-500 dark:text-warm-400">
                        {project.tagline}
                      </p>
                      <p className="mt-6 font-body text-base leading-[1.8] text-warm-600 dark:text-warm-400">
                        {project.description}
                      </p>
                      <div className="mt-8 flex items-center gap-3">
                        <span
                          className={`inline-flex h-2.5 w-2.5 rounded-full ${
                            project.status === "completed"
                              ? "bg-charcoal dark:bg-warm-300"
                              : "bg-warm-400 dark:bg-warm-500 animate-pulse"
                          }`}
                        />
                        <span className="font-mono text-xs tracking-[0.15em] text-warm-500 dark:text-warm-400 uppercase">
                          {project.status === "completed" ? "Completed" : "In progress"} · {project.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ━━━ SERVICES — Stacked names + image, scroll changes active ━━━ */}
        <section id="services" className="services-scroll relative">
          <div className="relative min-h-screen overflow-hidden">
            {/* Background color layer — changes per active service */}
            <div className="service-bg absolute inset-0 bg-charcoal transition-colors duration-700" />

            <div className="relative z-10 grid min-h-screen md:grid-cols-12">
              {/* Left — all service names stacked */}
              <div className="flex flex-col justify-center px-6 py-20 md:col-span-7 md:px-12">
                <p className="font-mono text-sm tracking-[0.25em] text-white/40 dark:text-white/40 uppercase mb-10">
                  Our Services
                </p>
                <div className="service-stack relative">
                  {/* Base text — dimmed */}
                  {services.map((service, i) => (
                    <div key={service.id} className="border-t border-white/10 dark:border-charcoal/10">
                      <h3 className="py-4 font-heading text-[clamp(1.6rem,7vw,6rem)] leading-[1] font-bold tracking-[-0.03em] uppercase text-white/15">
                        {service.title}
                      </h3>
                    </div>
                  ))}
                  <div className="border-t border-white/10 dark:border-charcoal/10" />

                  {/* Duplicate text — bright white, clipped by the moving band */}
                  <div
                    className="service-band pointer-events-none absolute inset-0"
                    style={{ willChange: "clip-path", clipPath: "inset(0% 0% 75% 0%)" }}
                  >
                    {services.map((service, i) => (
                      <div key={service.id} className="border-t border-transparent">
                        <h3 className="py-4 font-heading text-[clamp(1.6rem,7vw,6rem)] leading-[1] font-bold tracking-[-0.03em] uppercase text-white">
                          {service.title}
                        </h3>
                      </div>
                    ))}
                    <div className="border-t border-transparent" />
                  </div>
                </div>
              </div>

              {/* Right — single drawing */}
              <div className="relative flex items-center justify-center px-6 pb-16 md:col-span-5 md:px-0 md:py-12">
                <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-sm md:max-w-xl">
                  <Image
                    src="/images/drawing-3.png"
                    alt="Tropical Hillside Development — Concept Site Plan"
                    fill
                    className="object-contain dark:invert"
                    sizes="(max-width: 768px) 80vw, 400px"
                    quality={90}
                  />
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ━━━ GALLERY — Cinematic filmstrip, dark bg, two rows ━━━ */}
        <section className="gallery-section relative overflow-hidden bg-charcoal dark:bg-deep py-20 md:py-28">
          {/* Grain texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')] bg-repeat bg-[length:128px_128px]" />

          {/* Header */}
          <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 mb-14 flex items-end justify-between">
            <div>
              <p className="font-mono text-sm tracking-[0.25em] text-warm-500 uppercase">Gallery</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-[-0.02em] text-white md:text-6xl">
                The work,<br />up close
              </h2>
            </div>
            <p className="hidden font-mono text-xs text-warm-600 md:block">
              {gallery.length} frames
            </p>
          </div>

          {/* Row 1 — scrolls left, varied heights */}
          <div className="filmstrip-row-1 relative z-10 flex items-end gap-2 mb-2" style={{ willChange: "transform" }}>
            {gallery.slice(0, 8).map((img, i) => {
              const heights = ["h-[30vh] md:h-[36vh]", "h-[38vh] md:h-[44vh]", "h-[26vh] md:h-[30vh]", "h-[34vh] md:h-[40vh]", "h-[28vh] md:h-[33vh]", "h-[36vh] md:h-[42vh]", "h-[32vh] md:h-[38vh]", "h-[27vh] md:h-[32vh]"];
              return (
                <div key={i} className="shrink-0 overflow-hidden relative group">
                  <Image
                    src={img}
                    alt={`Vista 3 gallery ${i + 1}`}
                    width={800}
                    height={1000}
                    className={`${heights[i]} w-auto max-w-none object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-110`}
                    quality={85}
                  />
                  {/* Frame number */}
                  <span className="absolute bottom-2 right-3 font-mono text-[9px] text-white/0 transition-colors duration-300 group-hover:text-white/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Row 2 — scrolls right, offset heights */}
          <div className="filmstrip-row-2 relative z-10 flex items-start gap-2" style={{ willChange: "transform" }}>
            {gallery.slice(4, 12).map((img, i) => {
              const heights = ["h-[34vh] md:h-[40vh]", "h-[26vh] md:h-[30vh]", "h-[38vh] md:h-[44vh]", "h-[30vh] md:h-[35vh]", "h-[32vh] md:h-[37vh]", "h-[28vh] md:h-[32vh]", "h-[36vh] md:h-[42vh]", "h-[30vh] md:h-[34vh]"];
              return (
                <div key={i} className="shrink-0 overflow-hidden relative group">
                  <Image
                    src={img}
                    alt={`Vista 3 gallery ${i + 9}`}
                    width={800}
                    height={1000}
                    className={`${heights[i]} w-auto max-w-none object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-110`}
                    quality={85}
                  />
                  <span className="absolute bottom-2 right-3 font-mono text-[9px] text-white/0 transition-colors duration-300 group-hover:text-white/50">
                    {String(i + 9).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom edge — fades into content */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-charcoal dark:from-deep to-transparent" />
        </section>

        {/* ━━━ TESTIMONIALS — One at a time, big quote, arrows ━━━ */}
        <section
          id="about"
          className="testimonials-section border-t border-warm-200 dark:border-warm-800 px-6 py-28 md:px-12 md:py-36 transition-colors duration-700"
        >
          <div className="mx-auto max-w-[1440px]">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm tracking-[0.25em] text-warm-400 dark:text-warm-500 uppercase">
                Client Stories
              </p>
              <p className="font-mono text-sm text-warm-300 dark:text-warm-600">
                <span className="testimonial-counter">01</span> / {String(testimonials.length).padStart(2, "0")}
              </p>
            </div>

            {/* Testimonial slides */}
            <div className="testimonial-slides relative mt-16 overflow-hidden">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`testimonial-slide ${i === 0 ? "" : "hidden"}`}
                >
                  <div className="grid items-start gap-12 md:grid-cols-12">
                    {/* Left — decorative initial */}
                    <div className="md:col-span-2">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-warm-200 dark:border-warm-700 font-display text-4xl text-warm-300 dark:text-warm-600">
                        {t.name.charAt(0)}
                      </div>
                    </div>

                    {/* Right — big quote */}
                    <div className="md:col-span-9">
                      <span className="font-display text-4xl text-warm-300 dark:text-warm-600">&ldquo;</span>
                      <p className="font-display text-[clamp(1.5rem,3.5vw,3rem)] leading-[1.3] font-light tracking-[-0.01em] text-charcoal dark:text-warm-100">
                        {t.text}
                      </p>

                      <div className="mt-10">
                        <p className="font-body text-lg text-charcoal dark:text-warm-200">{t.name}</p>
                        <p className="mt-1 font-mono text-xs tracking-[0.15em] text-warm-400 dark:text-warm-500 uppercase">
                          {t.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="mt-12 flex justify-end gap-3">
              <button
                className="testimonial-prev flex h-12 w-12 cursor-pointer items-center justify-center border border-warm-200 dark:border-warm-700 text-warm-400 dark:text-warm-500 transition-colors hover:border-charcoal hover:text-charcoal dark:hover:border-warm-300 dark:hover:text-warm-300"
                aria-label="Previous testimonial"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                </svg>
              </button>
              <button
                className="testimonial-next flex h-12 w-12 cursor-pointer items-center justify-center border border-warm-200 dark:border-warm-700 text-warm-400 dark:text-warm-500 transition-colors hover:border-charcoal hover:text-charcoal dark:hover:border-warm-300 dark:hover:text-warm-300"
                aria-label="Next testimonial"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ━━━ CTA + FOOTER — Dark, premium ━━━ */}
        <footer
          id="contact"
          className="cta-section relative overflow-hidden bg-charcoal text-white dark:bg-deep"
        >
          {/* Giant logo watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/logo-white.svg"
              alt=""
              width={800}
              height={220}
              className="opacity-[0.03] w-[80vw] max-w-[900px] h-auto"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12">
            {/* CTA section */}
            <div className="grid gap-16 pt-28 pb-24 md:grid-cols-12 md:pt-40 md:pb-32">
              <div className="md:col-span-7">
                <p className="reveal font-mono text-sm tracking-[0.25em] text-warm-500 uppercase">
                  Start your project
                </p>
                <h2 className="cta-title mt-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] font-medium tracking-[-0.02em] text-white">
                  Make Costa Rica the
                  <br />
                  strategic location for
                  <br />
                  your next <em className="font-light italic text-warm-400">project</em>.
                </h2>
                <div className="reveal mt-10 flex flex-wrap gap-4">
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                    className="rounded-full bg-white px-8 py-3.5 font-body text-xs tracking-[0.1em] text-charcoal uppercase transition-all hover:bg-warm-200"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="rounded-full border border-white/20 px-8 py-3.5 font-body text-xs tracking-[0.1em] text-white/70 uppercase transition-all hover:border-white/50 hover:text-white"
                  >
                    Email
                  </a>
                </div>
              </div>
              <div className="reveal flex flex-col justify-end md:col-span-4 md:col-start-9">
                <div className="space-y-4 font-body text-[15px] text-warm-400">
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
                      className="font-mono text-xs tracking-[0.15em] text-warm-600 uppercase transition-colors hover:text-white"
                    >
                      {key}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 py-10 md:flex-row">
              <Image
                src="/images/logo-white.svg"
                alt="Vista 3"
                width={120}
                height={34}
                className="opacity-60"
              />
              <p className="font-mono text-xs tracking-[0.15em] text-warm-600 uppercase">
                &copy; Vista 3 Architects {new Date().getFullYear()}
              </p>
              <Link
                href="/"
                className="font-mono text-xs tracking-[0.15em] text-warm-600 uppercase transition-colors hover:text-white"
              >
                Back to exploration
              </Link>
            </div>
          </div>
        </footer>
        </div>{/* end main content wrapper */}
      </div>
  );
}
