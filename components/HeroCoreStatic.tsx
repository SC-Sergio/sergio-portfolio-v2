import {
  NEURAL_CORE_INNER_SCALE,
  NEURAL_CORE_RADIUS,
  NEURAL_CORE_SHELL_SCALE,
  neuralConnections,
  neuralNodes,
  neuralOrbits,
} from "@/components/neuralCoreGeometry";

// Representación estática del núcleo neuronal de Scene3D: misma geometría,
// proyectada con la perspectiva de la cámara 3D (z = 5.1). Todo se calcula al
// cargar el módulo y es determinista, así que el HTML del servidor y del cliente
// coinciden. Sin Three.js, sin filtros SVG y sin imágenes externas.

const CAMERA_DISTANCE = 5.1;
const round = (value: number) => Math.round(value * 1000) / 1000;

function project([x, y, z]: [number, number, number]) {
  const depth = CAMERA_DISTANCE / (CAMERA_DISTANCE - z);
  return { x: round(x * depth), y: round(-y * depth), depth };
}

const projectedNodes = neuralNodes.map((node) => ({ ...node, ...project(node.position) }));

const connections = neuralConnections.map(([from, to]) => {
  const a = projectedNodes[from];
  const b = projectedNodes[to];
  return { key: `${from}-${to}`, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
});

// Nodos periféricos de atrás hacia adelante, como en la escena 3D.
const peripheralNodes = projectedNodes.slice(1).sort((a, b) => a.position[2] - b.position[2]);

// Una órbita (toro en el plano XY) rotada con Euler XYZ se proyecta como una
// elipse: el eje menor sigue la normal rotada y su largo es radio * |n.z|.
const orbits = neuralOrbits.map(({ radius, scale, rotation: [rx, ry], color, opacity }) => {
  const normal = { x: Math.sin(ry), y: -Math.cos(ry) * Math.sin(rx), z: Math.cos(ry) * Math.cos(rx) };
  const major = radius * scale;
  const minorAngle = (Math.atan2(-normal.y, normal.x) * 180) / Math.PI;
  return {
    rx: round(major),
    ry: round(major * Math.abs(normal.z)),
    rotate: round(minorAngle - 90),
    color,
    opacity,
  };
});

// Wireframe del icosaedro exterior del núcleo (proyección ortográfica).
const PHI = (1 + Math.sqrt(5)) / 2;
const icosahedronVertices: Array<[number, number, number]> = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const shellRadius = NEURAL_CORE_RADIUS * NEURAL_CORE_SHELL_SCALE;
const vertexLength = Math.hypot(1, PHI);
const shellEdges = icosahedronVertices.flatMap((a, i) =>
  icosahedronVertices.slice(i + 1).flatMap((b, offset) => {
    if (Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) - 2) > 0.001) {
      return [];
    }

    const k = shellRadius / vertexLength;
    return [{ key: `${i}-${i + offset + 1}`, x1: round(a[0] * k), y1: round(-a[1] * k), x2: round(b[0] * k), y2: round(-b[1] * k) }];
  }),
);
const innerRadius = round(NEURAL_CORE_RADIUS * NEURAL_CORE_INNER_SCALE);

/**
 * @param animated Activa el pulso del halo. Solo tiene sentido en el modo estático:
 * cuando la escena WebGL va a reemplazar al SVG, animarlo sería trabajo sin valor.
 */
export default function HeroCoreStatic({ animated = false }: { animated?: boolean }) {
  return (
    <div aria-hidden="true" data-hero-core-static="" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(34,211,238,0.16),transparent_34rem)]" />
      {/* En pantallas angostas el núcleo asoma desde el borde derecho para no
          quedar detrás del texto; desde lg replica la posición de la escena 3D. */}
      <div className="absolute left-[98%] top-[34%] aspect-square w-[min(135vw,38rem)] -translate-x-1/2 -translate-y-1/2 opacity-60 sm:left-[97%] sm:top-[33%] sm:w-[min(84vw,44rem)] sm:opacity-55 lg:left-[66%] lg:top-[51%] lg:h-[79%] lg:w-auto lg:opacity-100">
        <div className={`absolute left-1/2 top-1/2 size-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.34),rgba(34,211,238,0.1)_42%,transparent_70%)] opacity-55 ${animated ? "animate-core-pulse motion-reduce:animate-none" : ""}`} />
        <svg viewBox="-1.65 -1.65 3.3 3.3" className="absolute inset-0 h-full w-full overflow-visible" focusable="false">
          <defs>
            <radialGradient id="hero-core-fill" cx="42%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="55%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#22d3ee" />
            </radialGradient>
          </defs>

          {orbits.map((orbit) => (
            <ellipse
              key={orbit.color}
              rx={orbit.rx}
              ry={orbit.ry}
              transform={`rotate(${orbit.rotate})`}
              fill="none"
              stroke={orbit.color}
              strokeOpacity={orbit.opacity}
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <g stroke="#67e8f9" strokeOpacity={0.34} strokeWidth={1} vectorEffect="non-scaling-stroke">
            {connections.map(({ key, ...line }) => (
              <line key={key} {...line} vectorEffect="non-scaling-stroke" />
            ))}
          </g>

          {peripheralNodes
            .filter((node) => node.position[2] < 0)
            .map((node) => (
              <g key={node.position.join(":")}>
                <circle cx={node.x} cy={node.y} r={round(node.size * node.depth * 2.6)} fill={node.color} fillOpacity={0.12} />
                <circle cx={node.x} cy={node.y} r={round(node.size * node.depth)} fill={node.color} fillOpacity={0.8} />
              </g>
            ))}

          <circle r={innerRadius} fill="url(#hero-core-fill)" fillOpacity={0.84} />
          <g stroke="#a7f3d0" strokeOpacity={0.4} strokeWidth={1} vectorEffect="non-scaling-stroke">
            {shellEdges.map(({ key, ...edge }) => (
              <line key={key} {...edge} vectorEffect="non-scaling-stroke" />
            ))}
          </g>

          {peripheralNodes
            .filter((node) => node.position[2] >= 0)
            .map((node) => (
              <g key={node.position.join(":")}>
                <circle cx={node.x} cy={node.y} r={round(node.size * node.depth * 2.6)} fill={node.color} fillOpacity={0.14} />
                <circle cx={node.x} cy={node.y} r={round(node.size * node.depth)} fill={node.color} fillOpacity={0.9} />
              </g>
            ))}
        </svg>
      </div>
    </div>
  );
}
