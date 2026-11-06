// Geometría compartida del núcleo neuronal del Hero. La usan la escena WebGL
// (Scene3D) y su representación estática en SVG (HeroCoreStatic). Este módulo no
// importa Three.js, para que la versión estática no arrastre dependencias WebGL.

export type NeuralNode = {
  position: [number, number, number];
  color: string;
  size: number;
};

export const neuralNodes: NeuralNode[] = [
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

export const neuralConnections: Array<[number, number]> = [
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

export type NeuralOrbit = {
  radius: number;
  scale: number;
  rotation: [number, number, number];
  color: string;
  opacity: number;
};

export const neuralOrbits: NeuralOrbit[] = [
  { radius: 1.05, scale: 1.28, rotation: [0.5, 0.24, 0.16], color: "#67e8f9", opacity: 0.58 },
  { radius: 1.03, scale: 1.48, rotation: [-0.46, 0.4, -0.2], color: "#c4b5fd", opacity: 0.42 },
];

/** Radio base del icosaedro del núcleo y escalas de sus dos capas. */
export const NEURAL_CORE_RADIUS = 0.42;
export const NEURAL_CORE_INNER_SCALE = 0.68;
export const NEURAL_CORE_SHELL_SCALE = 0.92;
