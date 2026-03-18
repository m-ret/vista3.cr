"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Vertex shader: simplex noise terrain displacement ── */
const terrainVertex = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float n1 = snoise(pos.xy * 0.3 + uTime * 0.05) * 0.6;
    float n2 = snoise(pos.xy * 0.7 + uTime * 0.03) * 0.25;
    float n3 = snoise(pos.xy * 1.5 + uTime * 0.08) * 0.08;
    float elevation = n1 + n2 + n3;

    vec2 mLocal = uMouse * vec2(20.0, 14.0) - vec2(10.0, 7.0);
    float mDist = length(pos.xy - mLocal);
    elevation += exp(-mDist * 0.5) * 0.6;

    float edgeAtten = smoothstep(0.0, 0.25, uv.x) * smoothstep(1.0, 0.75, uv.x)
                    * smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.75, uv.y);
    elevation *= edgeAtten;

    pos.z = elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ── Fragment shader: emerald wireframe grid on dark surface ── */
const terrainFragment = `
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 base = vec3(0.039, 0.059, 0.051);
    vec3 emerald = vec3(0.369, 0.898, 0.627);
    vec3 muted = vec3(0.165, 0.478, 0.353);

    vec2 g = abs(fract(vUv * 50.0) - 0.5);
    float line = 1.0 - smoothstep(0.0, 0.03, min(g.x, g.y));

    float elev = clamp((vElevation + 1.0) / 3.5, 0.0, 1.0);
    vec3 lineColor = mix(muted * 0.4, emerald * 0.8, elev);

    vec3 color = mix(base, lineColor, line * 0.7);
    color += emerald * elev * 0.03;

    float fade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x)
               * smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    color *= fade;

    float grain = fract(sin(dot(vUv * 800.0, vec2(12.9898, 78.233))) * 43758.5453) * 0.015;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Terrain() {
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [uniforms]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 14, 128, 128]} />
      <shaderMaterial
        vertexShader={terrainVertex}
        fragmentShader={terrainFragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingImage() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    new THREE.TextureLoader().load("/images/archidomo-hero.jpg", setTexture);
  }, []);

  useFrame(({ clock, camera }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = 2 + Math.sin(t * 0.3) * 0.1;
    meshRef.current.quaternion.copy(camera.quaternion);
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[0, 2, 0]}>
      <planeGeometry args={[4, 2.8]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.65}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame(() => {
    const s = scrollRef.current;
    const ty = 8 - s * 4;
    const tz = 8 + s * 3;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.position.z += (tz - camera.position.z) * 0.05;
    camera.lookAt(0, -1, 0);
  });

  return null;
}

export default function TerrainScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-[#0a0f0d]" />;

  return (
    <Canvas
      camera={{ position: [0, 8, 8], fov: 45 }}
      dpr={Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio : 1,
        1.5
      )}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "#0a0f0d" }}
    >
      <fog attach="fog" args={["#0a0f0d", 10, 25]} />
      <ambientLight intensity={0.4} />
      <CameraRig />
      <Terrain />
      <FloatingImage />
    </Canvas>
  );
}
