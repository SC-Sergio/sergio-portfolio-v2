// Cifras del proyecto SpaceX Falcon 9 Landing, copiadas de las salidas almacenadas en el notebook
// público (SpaceX_Falcon9_Landing_Prediction.ipynb, subido el 4-jul-2024). No se recalculó nada:
// los datasets originales no están en el repositorio.

export const spacexSummary = {
  launches: 90, // SELECT COUNT(*) por sitio: 55 + 22 + 13
  successfulLandings: 60, // SUM(Class) por órbita
  totalPayloadKg: 549446.35, // SELECT SUM(PayloadMass)
  testSize: 18, // train_test_split(test_size=0.2, random_state=2)
};

/** Sitios de lanzamiento: conteo (consulta SQL) y coordenadas (columnas Latitude/Longitude del dataset). */
export const launchSites = [
  { name: "CCAFS SLC 40", place: "Cabo Cañaveral, Florida", launches: 55, lat: 28.5618571, lon: -80.577366 },
  { name: "KSC LC 39A", place: "Centro Espacial Kennedy, Florida", launches: 22, lat: 28.6080585, lon: -80.6039558 },
  { name: "VAFB SLC 4E", place: "Base Vandenberg, California", launches: 13, lat: 34.632093, lon: -120.610829 },
];

/** SELECT Orbit, COUNT(*), SUM(Class) FROM SPACEXTBL GROUP BY Orbit */
export const orbits = [
  { orbit: "ES-L1", launches: 1, successes: 1 },
  { orbit: "GEO", launches: 1, successes: 1 },
  { orbit: "GTO", launches: 27, successes: 14 },
  { orbit: "HEO", launches: 1, successes: 1 },
  { orbit: "ISS", launches: 21, successes: 13 },
  { orbit: "LEO", launches: 7, successes: 5 },
  { orbit: "MEO", launches: 3, successes: 2 },
  { orbit: "PO", launches: 9, successes: 6 },
  { orbit: "SO", launches: 1, successes: 0 },
  { orbit: "SSO", launches: 5, successes: 5 },
  { orbit: "VLEO", launches: 14, successes: 12 },
];

type ClassReport = { precision: number; recall: number; f1: number; support: number };

export type ModelResult = {
  id: string;
  name: string;
  accuracy: number;
  /** [[VN, FP], [FN, VP]] con 0 = aterrizaje fallido y 1 = exitoso. */
  confusion: [[number, number], [number, number]];
  failed: ClassReport;
  landed: ClassReport;
  note?: string;
};

/** classification_report y confusion_matrix impresos por las celdas 29–32 y 34 del notebook. */
export const models: ModelResult[] = [
  {
    id: "tree",
    name: "Árbol de decisión",
    accuracy: 0.89,
    confusion: [
      [5, 1],
      [1, 11],
    ],
    failed: { precision: 0.83, recall: 0.83, f1: 0.83, support: 6 },
    landed: { precision: 0.92, recall: 0.92, f1: 0.92, support: 12 },
    note: "Sin semilla fija: otra ejecución puede dar otro resultado.",
  },
  {
    id: "logreg",
    name: "Regresión logística",
    accuracy: 0.83,
    confusion: [
      [3, 3],
      [0, 12],
    ],
    failed: { precision: 1, recall: 0.5, f1: 0.67, support: 6 },
    landed: { precision: 0.8, recall: 1, f1: 0.89, support: 12 },
  },
  {
    id: "svm",
    name: "SVM",
    accuracy: 0.78,
    confusion: [
      [3, 3],
      [1, 11],
    ],
    failed: { precision: 0.75, recall: 0.5, f1: 0.6, support: 6 },
    landed: { precision: 0.79, recall: 0.92, f1: 0.85, support: 12 },
  },
  {
    id: "knn",
    name: "KNN",
    accuracy: 0.78,
    confusion: [
      [2, 4],
      [0, 12],
    ],
    failed: { precision: 1, recall: 0.33, f1: 0.5, support: 6 },
    landed: { precision: 0.75, recall: 1, f1: 0.86, support: 12 },
  },
  {
    id: "keras",
    name: "Red densa (Keras)",
    accuracy: 0.7778,
    confusion: [
      [3, 3],
      [1, 11],
    ],
    failed: { precision: 0.75, recall: 0.5, f1: 0.6, support: 6 },
    landed: { precision: 0.79, recall: 0.92, f1: 0.85, support: 12 },
    note: "64-32-1 neuronas, 50 épocas; precisión de entrenamiento 1,00 frente a 0,80 en validación: sobreajuste.",
  },
];
