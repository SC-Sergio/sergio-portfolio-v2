"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { Group } from "three";
import {
  NEURAL_CORE_INNER_SCALE,
  NEURAL_CORE_RADIUS,
  NEURAL_CORE_SHELL_SCALE,
  neuralConnections,
  neuralNodes,
  neuralOrbits,
} from "@/components/neuralCoreGeometry";

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

  // Los callbacks de useFrame corren en el bucle de React Three Fiber, fuera de
  // React: un error ahí se repetiría en cada frame. Se detiene el callback y se
  // relanza en el render para que llegue a Scene3DErrorBoundary.
  const frameFailedRef = useRef(false);
  const [frameError, setFrameError] = useState<Error | null>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion || frameFailedRef.current) {
      return;
    }

    try {
      const elapsed = state.clock.getElapsedTime();
      groupRef.current.rotation.y = elapsed * 0.1;
      groupRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.055;
      groupRef.current.rotation.z = Math.sin(elapsed * 0.14) * 0.025;

      if (pulseRef.current) {
        const pulse = 1 + Math.sin(elapsed * 1.35) * 0.025;
        pulseRef.current.scale.setScalar(pulse);
      }
    } catch (error) {
      frameFailedRef.current = true;
      setFrameError(error instanceof Error ? error : new Error(String(error)));
    }
  });

  if (frameError) {
    throw frameError;
  }

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
          <mesh scale={NEURAL_CORE_INNER_SCALE}>
            <icosahedronGeometry args={[NEURAL_CORE_RADIUS, 1]} />
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
          <mesh scale={NEURAL_CORE_SHELL_SCALE}>
            <icosahedronGeometry args={[NEURAL_CORE_RADIUS, 0]} />
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

      <mesh rotation={neuralOrbits[0].rotation} scale={neuralOrbits[0].scale}>
        <torusGeometry args={[neuralOrbits[0].radius, 0.006, 8, 64]} />
        <meshStandardMaterial color={neuralOrbits[0].color} emissive="#075985" emissiveIntensity={0.46} transparent opacity={neuralOrbits[0].opacity} />
      </mesh>

      <mesh rotation={neuralOrbits[1].rotation} scale={neuralOrbits[1].scale}>
        <torusGeometry args={[neuralOrbits[1].radius, 0.005, 8, 72]} />
        <meshStandardMaterial color={neuralOrbits[1].color} emissive="#4c1d95" emissiveIntensity={0.34} transparent opacity={neuralOrbits[1].opacity} />
      </mesh>
    </group>
  );
}

export type Scene3DProps = {
  /** Se llama con `true` tras dibujar el primer frame y con `false` al desmontar. */
  onReadyChange?: (ready: boolean) => void;
};

export default function Scene3D({ onReadyChange }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [renderError, setRenderError] = useState<Error | null>(null);
  const onReadyChangeRef = useRef(onReadyChange);

  useEffect(() => {
    onReadyChangeRef.current = onReadyChange;
  }, [onReadyChange]);

  useEffect(() => () => onReadyChangeRef.current?.(false), []);
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

  // React Three Fiber ejecuta el render en requestAnimationFrame, fuera del árbol
  // de React, y programa el siguiente frame antes de dibujar: un error ahí se
  // repetiría en cada frame. Se detiene el bucle y se relanza el error durante el
  // render de React para que lo capture Scene3DErrorBoundary.
  if (renderError) {
    throw renderError;
  }

  // Además avisa al Hero cuando el primer frame ya está dibujado: descargar el
  // chunk no implica que WebGL esté listo, así que la transición espera a esto.
  const isolateRenderErrors = ({ gl, setFrameloop }: RootState) => {
    const render = gl.render.bind(gl);
    let firstFrameReported = false;

    gl.render = (scene, camera) => {
      try {
        render(scene, camera);

        if (!firstFrameReported) {
          firstFrameReported = true;
          onReadyChangeRef.current?.(true);
        }
      } catch (error) {
        setFrameloop("never");
        setRenderError(error instanceof Error ? error : new Error(String(error)));
      }
    };
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 5.1], fov: 43 }}
        dpr={[1, 1.1]}
        frameloop={shouldAnimate ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={isolateRenderErrors}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 3, 5]} intensity={1.85} color="#e0f2fe" />
        <pointLight position={[-4, -2, 3]} intensity={1.05} color="#a78bfa" />
        <CoreShape reducedMotion={!shouldAnimate} />
      </Canvas>
    </div>
  );
}
