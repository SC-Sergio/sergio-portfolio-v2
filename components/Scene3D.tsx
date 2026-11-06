"use client";

import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { BufferGeometry, Color, Float32BufferAttribute, Matrix4, MeshStandardMaterial } from "three";
import type { Group, InstancedMesh } from "three";
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

// Paso máximo de la animación por frame (s): evita saltos tras una pausa.
const MAX_ANIMATION_STEP = 0.1;
const FLOAT_SPEED = 0.85;
const FLOAT_ROTATION_INTENSITY = 0.16;
const FLOAT_INTENSITY = 0.28;

// Nodos periféricos de atrás hacia adelante: el InstancedMesh los dibuja en este
// orden en una sola llamada, aproximando el orden de transparencia de las mallas.
const peripheralNodes = neuralNodes.slice(1).sort((a, b) => a.position[2] - b.position[2]);

/**
 * Los 11 nodos periféricos en una sola llamada de dibujo: una esfera compartida y
 * un material compartido con color por instancia. Para conservar el aspecto (cada
 * nodo usaba su color como color base y como emisivo a 0.9), el material es blanco
 * y el emisivo se multiplica por el color de la instancia en el shader.
 */
function NeuralNodes() {
  const meshRef = useRef<InstancedMesh>(null);
  const material = useMemo(() => {
    const nodeMaterial = new MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ffffff",
      emissiveIntensity: 0.9,
      roughness: 0.32,
      transparent: true,
      opacity: 0.88,
    });

    nodeMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "vec3 totalEmissiveRadiance = emissive;",
        "vec3 totalEmissiveRadiance = emissive * vColor.rgb;",
      );
    };
    nodeMaterial.customProgramCacheKey = () => "neural-node-instance-emissive";

    return nodeMaterial;
  }, []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    const matrix = new Matrix4();
    const color = new Color();

    peripheralNodes.forEach((node, index) => {
      matrix.makeScale(node.size, node.size, node.size).setPosition(...node.position);
      mesh.setMatrixAt(index, matrix);
      mesh.setColorAt(index, color.set(node.color));
    });

    mesh.instanceMatrix.needsUpdate = true;

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }

    mesh.computeBoundingSphere();
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, peripheralNodes.length]} material={material}>
      <sphereGeometry args={[1, 10, 10]} />
    </instancedMesh>
  );
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
  const floatRef = useRef<Group>(null);
  // Tiempo propio de la animación. El reloj de R3F sigue corriendo con la pestaña
  // oculta y se reinicia a 0 cada vez que cambia el frameloop (Hero fuera de vista),
  // lo que hacía saltar la escena al volver. Aquí solo avanza con frames dibujados
  // y cada paso se limita a MAX_ANIMATION_STEP.
  const animationTimeRef = useRef(0);

  useFrame((_state, delta) => {
    if (!groupRef.current || reducedMotion || frameFailedRef.current) {
      return;
    }

    try {
      animationTimeRef.current += Math.min(delta, MAX_ANIMATION_STEP);
      const elapsed = animationTimeRef.current;
      groupRef.current.rotation.y = elapsed * 0.1;
      groupRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.055;
      groupRef.current.rotation.z = Math.sin(elapsed * 0.14) * 0.025;

      if (pulseRef.current) {
        const pulse = 1 + Math.sin(elapsed * 1.35) * 0.025;
        pulseRef.current.scale.setScalar(pulse);
      }

      // Misma fórmula que <Float> de drei (speed 0.85, rotationIntensity 0.16,
      // floatIntensity 0.28, rango [-0.1, 0.1]), con el tiempo propio.
      if (floatRef.current) {
        const phase = (elapsed / 4) * FLOAT_SPEED;
        floatRef.current.rotation.set(
          (Math.cos(phase) / 8) * FLOAT_ROTATION_INTENSITY,
          (Math.sin(phase) / 8) * FLOAT_ROTATION_INTENSITY,
          (Math.sin(phase) / 20) * FLOAT_ROTATION_INTENSITY,
        );
        floatRef.current.position.y = (Math.sin(phase) / 10) * FLOAT_INTENSITY;
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
      <group ref={floatRef}>
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

        <NeuralNodes />
      </group>

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
