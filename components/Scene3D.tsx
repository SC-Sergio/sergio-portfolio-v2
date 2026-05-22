"use client";

import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

function CoreShape() {
  const groupRef = useRef<Group>(null);
  const { viewport } = useThree();
  const scale = Math.min(Math.max(viewport.width / 7, 0.72), 1.18);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    groupRef.current.rotation.y = elapsed * 0.16;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.28) * 0.08;
  });

  return (
    <group ref={groupRef} scale={scale} position={[1.1, -0.05, 0]}>
      <Float speed={1.25} rotationIntensity={0.32} floatIntensity={0.48}>
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
      <CoreShape />
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
