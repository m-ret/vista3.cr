"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Abstract architectural planes — floating concrete-like slabs
 * that shift with scroll and cursor. Evokes materiality and spatial depth.
 */
function ArchitecturalPlanes() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const planes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10 - 2,
      ] as [number, number, number],
      rotation: [
        Math.random() * 0.3 - 0.15,
        Math.random() * 0.6 - 0.3,
        Math.random() * 0.2 - 0.1,
      ] as [number, number, number],
      scale: [
        1.5 + Math.random() * 3,
        0.8 + Math.random() * 2,
        0.02 + Math.random() * 0.04,
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.04 + Math.random() * 0.08,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    groupRef.current.rotation.y = mx * 0.04;
    groupRef.current.rotation.x = my * 0.02;

    groupRef.current.children.forEach((child, i) => {
      const p = planes[i];
      child.position.y = p.position[1] + Math.sin(t * p.speed + p.phase) * 0.3;
      child.rotation.z = p.rotation[2] + Math.sin(t * p.speed * 0.5 + p.phase) * 0.02;
    });
  });

  return (
    <group ref={groupRef}>
      {planes.map((p, i) => (
        <mesh key={i} position={p.position} rotation={p.rotation} scale={p.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#d4cec4"
            transparent
            opacity={p.opacity}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightBeams() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      (child as THREE.Mesh).material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      child.position.y = Math.sin(t * 0.1 + i) * 0.5;
    });
  });

  return (
    <group ref={ref}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[(i - 1) * 6, 0, -5]} rotation={[0, 0, 0.1 * (i - 1)]}>
          <planeGeometry args={[0.03, 20]} />
          <meshBasicMaterial color="#f5f3ef" transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  );
}

export default function ArchScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-warm-900" />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#1e1b17", 6, 20]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} color="#f5f3ef" />
      <pointLight position={[-4, 3, 2]} intensity={0.2} color="#d4cec4" />
      <ArchitecturalPlanes />
      <LightBeams />
    </Canvas>
  );
}
