"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { Group } from "three";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

const neuralNodes: Array<{ position: [number, number, number]; color: string; size: number }> = [
  { position: [0, 0, 0], color: "#e0f2fe", size: 0.08 },
  { position: [0.72, 0.46, 0.42], color: "#67e8f9", size: 0.046 },
  { position: [-0.7, 0.38, 0.34], color: "#a7f3d0", size: 0.044 },
  { position: [0.56, -0.66, 0.48], color: "#c4b5fd", size: 0.042 },
  { position: [-0.46, -0.58, 0.5], color: "#67e8f9", size: 0.04 },
  { position: [0.18, 0.84, -0.36], color: "#a7f3d0", size: 0.04 },
  { position: [-0.86, -0.04, -0.28], color: "#c4b5fd", size: 0.04 },
  { position: [0.88, -0.1, -0.22], color: "#67e8f9", size: 0.04 },
  { position: [-0.08, -0.9, -0.3], color: "#a7f3d0", size: 0.038 },
  { position: [0.42, 0.08, 0.82], color: "#c4b5fd", size: 0.036 },
  { position: [-0.3, 0.16, -0.78], color: "#67e8f9", size: 0.036 },
  { position: [0.22, -0.28, -0.72], color: "#a7f3d0", size: 0.034 },
];

const neuralConnections: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [1, 5],
  [1, 7],
  [1, 9],
  [2, 5],
  [2, 6],
  [3, 7],
  [3, 8],
  [4, 6],
  [4, 8],
  [5, 10],
  [6, 10],
  [7, 11],
  [8, 11],
];

function CoreShape({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const pulseRef = useRef<Group>(null);
  const { viewport } = useThree();
  const scale = Math.min(Math.max(viewport.width / 7, 0.72), 1.18);
  const connectionGeometry = useMemo(() => {
    const positions = neuralConnections.flatMap(([startIndex, endIndex]) => [
      ...neuralNodes[startIndex].position,
      ...neuralNodes[endIndex].position,
    ]);
    const geometry = new BufferGeometry();

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

    return geometry;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.1;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.055;
    groupRef.current.rotation.z = Math.sin(elapsed * 0.14) * 0.025;

    if (pulseRef.current) {
      const pulse = 1 + Math.sin(elapsed * 1.35) * 0.025;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} scale={scale} position={[1.1, -0.05, 0]}>
      <Float
        speed={reducedMotion ? 0 : 0.85}
        rotationIntensity={reducedMotion ? 0 : 0.16}
        floatIntensity={reducedMotion ? 0 : 0.28}
      >
        <lineSegments geometry={connectionGeometry}>
          <lineBasicMaterial color="#67e8f9" transparent opacity={0.34} />
        </lineSegments>

        <group ref={pulseRef}>
          <mesh scale={0.68}>
            <icosahedronGeometry args={[0.42, 1]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#22d3ee"
              emissiveIntensity={0.9}
              metalness={0.45}
              roughness={0.26}
              transparent
              opacity={0.84}
            />
          </mesh>
          <mesh scale={0.92}>
            <icosahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color="#a7f3d0"
              emissive="#064e3b"
              emissiveIntensity={0.48}
              metalness={0.35}
              roughness={0.36}
              transparent
              opacity={0.32}
              wireframe
            />
          </mesh>
        </group>

        {neuralNodes.slice(1).map((node) => (
          <mesh key={node.position.join(":")} position={node.position}>
            <sphereGeometry args={[node.size, 10, 10]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.9}
              roughness={0.32}
              transparent
              opacity={0.88}
            />
          </mesh>
        ))}
      </Float>

      <mesh rotation={[0.5, 0.24, 0.16]} scale={1.28}>
        <torusGeometry args={[1.05, 0.006, 8, 64]} />
        <meshStandardMaterial color="#67e8f9" emissive="#075985" emissiveIntensity={0.46} transparent opacity={0.58} />
      </mesh>

      <mesh rotation={[-0.46, 0.4, -0.2]} scale={1.48}>
        <torusGeometry args={[1.03, 0.005, 8, 72]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#4c1d95" emissiveIntensity={0.34} transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const shouldAnimate = isVisible && !reducedMotion;

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "160px" },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 5.1], fov: 43 }}
        dpr={[1, 1.1]}
        frameloop={shouldAnimate ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 3, 5]} intensity={1.85} color="#e0f2fe" />
        <pointLight position={[-4, -2, 3]} intensity={1.05} color="#a78bfa" />
        <CoreShape reducedMotion={!shouldAnimate} />
      </Canvas>
    </div>
  );
}
