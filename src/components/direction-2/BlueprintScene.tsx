"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Architectural grid + plan lines drawn via custom shader ── */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  /* ── helpers ── */
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  /* Draw a line segment — returns proximity (0..1) */
  float segment(vec2 p, vec2 a, vec2 b, float w) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return 1.0 - smoothstep(0.0, w, length(pa - ba * h));
  }

  /* Thin grid lines */
  float grid(vec2 p, float spacing, float thickness) {
    vec2 g = abs(fract(p / spacing - 0.5) - 0.5) * spacing;
    float d = min(g.x, g.y);
    return 1.0 - smoothstep(0.0, thickness, d);
  }

  /* Rectangle outline (stroke only, no fill) */
  float rect(vec2 p, vec2 center, vec2 size, float thickness) {
    vec2 d = abs(p - center) - size * 0.5;
    float outside = length(max(d, 0.0));
    float inside = min(max(d.x, d.y), 0.0);
    float dist = abs(outside + inside);
    return 1.0 - smoothstep(0.0, thickness, dist);
  }

  /* Circle outline */
  float circle(vec2 p, vec2 center, float radius, float thickness) {
    float d = abs(length(p - center) - radius);
    return 1.0 - smoothstep(0.0, thickness, d);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y);

    float t = uTime * 0.08;

    /* ── Base: dark background ── */
    vec3 bg = vec3(0.06, 0.06, 0.07);
    vec3 lineCol = vec3(0.22, 0.22, 0.25);
    vec3 accentCol = vec3(0.45, 0.38, 0.25);
    vec3 faintCol = vec3(0.12, 0.12, 0.14);

    vec3 col = bg;

    /* ── Major grid ── */
    float majorGrid = grid(p + vec2(t * 0.3, t * 0.15), 0.25, 0.002);
    col = mix(col, faintCol, majorGrid * 0.5);

    /* ── Minor grid ── */
    float minorGrid = grid(p + vec2(t * 0.3, t * 0.15), 0.05, 0.001);
    col = mix(col, faintCol, minorGrid * 0.25);

    /* ── Floor plan shapes — rectangles (rooms) ── */
    float plan = 0.0;

    /* Main building footprint */
    vec2 off = vec2(sin(t) * 0.02, cos(t * 0.7) * 0.015);
    plan += rect(p, vec2(0.8, 0.5) + off, vec2(0.6, 0.35), 0.003);
    plan += rect(p, vec2(0.65, 0.45) + off, vec2(0.2, 0.15), 0.002);
    plan += rect(p, vec2(0.95, 0.55) + off, vec2(0.15, 0.2), 0.002);

    /* Secondary structure */
    vec2 off2 = vec2(cos(t * 0.5) * 0.015, sin(t * 0.8) * 0.02);
    plan += rect(p, vec2(1.6 * aspect * 0.5, 0.7) + off2, vec2(0.45, 0.25), 0.003);
    plan += rect(p, vec2(1.6 * aspect * 0.5 - 0.1, 0.65) + off2, vec2(0.15, 0.12), 0.002);

    /* Pool shape — rounded rect via two overlapping */
    plan += rect(p, vec2(1.2, 0.25) + off, vec2(0.3, 0.1), 0.002);
    plan += circle(p, vec2(1.05, 0.25) + off, 0.05, 0.002);
    plan += circle(p, vec2(1.35, 0.25) + off, 0.05, 0.002);

    /* Dimension lines */
    plan += segment(p, vec2(0.5, 0.15) + off, vec2(1.1, 0.15) + off, 0.0015);
    plan += segment(p, vec2(0.5, 0.14) + off, vec2(0.5, 0.16) + off, 0.001);
    plan += segment(p, vec2(1.1, 0.14) + off, vec2(1.1, 0.16) + off, 0.001);

    /* Diagonal construction lines */
    float diag1 = segment(p, vec2(0.0, 0.0), vec2(aspect, 1.0), 0.001);
    float diag2 = segment(p, vec2(aspect, 0.0), vec2(0.0, 1.0), 0.001);
    col = mix(col, faintCol, (diag1 + diag2) * 0.15);

    /* Apply plan lines */
    col = mix(col, lineCol, clamp(plan, 0.0, 1.0) * 0.7);

    /* ── Accent rectangle — site boundary marker ── */
    float r1 = rect(p, vec2(0.8, 0.5) + off, vec2(0.5, 0.35), 0.002);
    float r2 = rect(p, vec2(0.8, 0.5) + off, vec2(0.5 + sin(t * 2.0) * 0.04, 0.35 + sin(t * 2.0) * 0.03), 0.001);
    col = mix(col, accentCol, (r1 + r2) * 0.4);

    /* ── Cross markers at intersections ── */
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 cp = vec2(
        hash(vec2(fi, 0.0)) * aspect,
        hash(vec2(0.0, fi))
      );
      float cross_h = segment(p, cp - vec2(0.015, 0.0), cp + vec2(0.015, 0.0), 0.001);
      float cross_v = segment(p, cp - vec2(0.0, 0.015), cp + vec2(0.0, 0.015), 0.001);
      col = mix(col, accentCol, (cross_h + cross_v) * 0.5);
    }

    /* ── Mouse proximity glow ── */
    vec2 mp = vec2(uMouse.x * aspect, uMouse.y);
    float mouseDist = length(p - mp);
    float glow = exp(-mouseDist * 4.0) * 0.15;
    col += accentCol * glow;

    /* ── Subtle vignette ── */
    float vig = 1.0 - length((uv - 0.5) * 1.4);
    vig = smoothstep(0.0, 0.7, vig);
    col *= vig;

    /* ── Noise grain ── */
    float grain = noise(p * 300.0 + uTime) * 0.03;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* Fullscreen quad with the blueprint shader */
function BlueprintPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
    }),
    []
  );

  useFrame(({ clock, size }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uResolution.value.set(size.width, size.height);
  });

  /* Track mouse for glow effect */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [uniforms]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BlueprintScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 1.5]}
    >
      <BlueprintPlane />
    </Canvas>
  );
}
