"use client";

import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useSyncExternalStore } from "react";
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

const techNodes: Array<{ position: [number, number, number]; color: string }> = [
  { position: [0.72, 0.5, 0.52], color: "#67e8f9" },
  { position: [-0.64, 0.42, 0.36], color: "#a7f3d0" },
  { position: [0.5, -0.68, 0.48], color: "#c4b5fd" },
  { position: [-0.38, -0.55, 0.62], color: "#67e8f9" },
  { position: [0.12, 0.82, -0.4], color: "#a7f3d0" },
  { position: [-0.78, -0.06, -0.3], color: "#c4b5fd" },
  { position: [0.84, -0.08, -0.26], color: "#67e8f9" },
  { position: [-0.08, -0.86, -0.34], color: "#a7f3d0" },
];

function CoreShape({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const { viewport } = useThree();
  const scale = Math.min(Math.max(viewport.width / 7, 0.72), 1.18);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.16;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.28) * 0.08;
  });

  return (
    <group ref={groupRef} scale={scale} position={[1.1, -0.05, 0]}>
      <Float
        speed={reducedMotion ? 0 : 1.25}
        rotationIntensity={reducedMotion ? 0 : 0.32}
        floatIntensity={reducedMotion ? 0 : 0.48}
      >
        <mesh>
          <icosahedronGeometry args={[1.18, 3]} />
          <MeshDistortMaterial
            color="#10b981"
            distort={0.16}
            emissive="#073f3f"
            emissiveIntensity={0.5}
            metalness={0.58}
            roughness={0.22}
            speed={1.35}
          />
        </mesh>

        <mesh scale={0.42}>
          <icosahedronGeometry args={[0.92, 1]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#22d3ee"
            emissiveIntensity={0.72}
            metalness={0.35}
            roughness={0.28}
            transparent
            opacity={0.46}
          />
        </mesh>

        <mesh rotation={[0.4, -0.2, 0.72]} scale={0.82}>
          <torusGeometry args={[0.72, 0.006, 8, 48]} />
          <meshStandardMaterial color="#a7f3d0" emissive="#064e3b" emissiveIntensity={0.58} />
        </mesh>

        {techNodes.map((node) => (
          <mesh key={node.position.join(":")} position={node.position}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.85} />
          </mesh>
        ))}
      </Float>

      <mesh rotation={[0.55, 0.25, 0.18]} scale={1.42}>
        <torusGeometry args={[1.08, 0.012, 12, 72]} />
        <meshStandardMaterial color="#67e8f9" emissive="#075985" emissiveIntensity={0.6} />
      </mesh>

      <mesh rotation={[-0.52, 0.42, -0.18]} scale={1.66}>
        <torusGeometry args={[1.08, 0.01, 12, 72]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#4c1d95" emissiveIntensity={0.38} />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 5.1], fov: 43 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 3, 5]} intensity={1.85} color="#e0f2fe" />
      <pointLight position={[-4, -2, 3]} intensity={1.05} color="#a78bfa" />
      <CoreShape reducedMotion={reducedMotion} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.4}
        rotateSpeed={0.22}
      />
    </Canvas>
  );
}
