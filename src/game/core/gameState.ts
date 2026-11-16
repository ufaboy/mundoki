import { LocalizedText, TopicId } from '../../math/core/types';

export type MascotMood =
  | 'idle'
  | 'thinking'
  | 'happy'
  | 'celebrating'
  | 'traveling'
  | 'obstacle';

export type CosmeticSlot = 'hat' | 'suit' | 'accessory';

export interface CosmeticItem {
  id: string;
  slot: CosmeticSlot;
  name: LocalizedText;
  description: LocalizedText;
  requiredTopic?: TopicId;
  requiredStars: number;
  premiumOnly?: boolean;
}

export interface VehicleTier {
  level: 1 | 2 | 3;
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  requiredEnergy: number;
}

export interface PlanetDestination {
  id: string;
  topicId: TopicId;
  name: LocalizedText;
  guardianName: LocalizedText;
  guardianTitle: LocalizedText;
  requiredSolvedCount: number;
  coordinates: { x: number; y: number };
  colorHex: string;
}

export const COSMETIC_CATALOG: CosmeticItem[] = [
  {
    id: 'hat-astro-helmet',
    slot: 'hat',
    name: {
      'es-AR': 'Casco Solar de Cadete',
      'en-US': 'Cadet Solar Helmet',
    },
    description: {
      'es-AR': 'Visor transparente para explorar el Planeta Suma-1.',
      'en-US': 'Clear dome visor built for exploring Planet Suma-1.',
    },
    requiredTopic: 'addition-subtraction',
    requiredStars: 3,
  },
  {
    id: 'suit-explorer',
    slot: 'suit',
    name: {
      'es-AR': 'Traje Orbital Celeste',
      'en-US': 'Sky Orbital Suit',
    },
    description: {
      'es-AR': 'Traje térmico ganado en la Estación Multi-Anillo.',
      'en-US': 'Thermal flight suit earned at Multi-Ring Station.',
    },
    requiredTopic: 'multiplication-division',
    requiredStars: 3,
  },
  {
    id: 'acc-gravity-boots',
    slot: 'accessory',
    name: {
      'es-AR': 'Botas Magnéticas de Cuarto',
      'en-US': 'Quarter-Grip Mag Boots',
    },
    description: {
      'es-AR': 'Mantienen el paso firme sobre la Luna Partida.',
      'en-US': 'Keeps your footing steady across Split Moon.',
    },
    requiredTopic: 'fractions',
    requiredStars: 6,
  },
  {
    id: 'hat-solar-crown',
    slot: 'hat',
    name: {
      'es-AR': 'Antena Polar Térmica',
      'en-US': 'Thermal Polar Crest',
    },
    description: {
      'es-AR': 'Resiste las temperaturas bajo cero de la Nebulosa.',
      'en-US': 'Withstands sub-zero temperatures inside the Nebula.',
    },
    requiredTopic: 'negative-numbers',
    requiredStars: 9,
  },
  {
    id: 'suit-quantum-vest',
    slot: 'suit',
    name: {
      'es-AR': 'Chaleco Proporcional Dorado',
      'en-US': 'Golden Ratio Vest',
    },
    description: {
      'es-AR': 'Calibrado al 100% en el Púlsar Proporción.',
      'en-US': 'Calibrated to 100% efficiency at Ratio Pulsar.',
    },
    requiredTopic: 'percentages-proportions',
    requiredStars: 12,
  },
  {
    id: 'acc-math-visor',
    slot: 'accessory',
    name: {
      'es-AR': 'Visor de Equilibrio Algebraico',
      'en-US': 'Algebraic Balance Visor',
    },
    description: {
      'es-AR': 'Revela incógnitas ocultas en Equilibria Prime.',
      'en-US': 'Reveals hidden unknowns on Equilibria Prime.',
    },
    requiredTopic: 'linear-equations',
    requiredStars: 15,
    premiumOnly: true,
  },
];

export const VEHICLE_TIERS: VehicleTier[] = [
  {
    level: 1,
    id: 'ship-scout-pod',
    name: {
      'es-AR': 'Cápsula Exploradora M-1',
      'en-US': 'Scout Pod M-1',
    },
    description: {
      'es-AR': 'Nave inicial ágil impulsada por ejercicios resueltos.',
      'en-US': 'Agile starter pod powered by solved math challenges.',
    },
    requiredEnergy: 0,
  },
  {
    level: 2,
    id: 'ship-nova-cruiser',
    name: {
      'es-AR': 'Crucero Facial Nova-2',
      'en-US': 'Nova-2 Star Cruiser',
    },
    description: {
      'es-AR': 'Doble propulsor iónico desbloqueado a los 100⚡ de energía.',
      'en-US': 'Twin ion thrusters unlocked at 100⚡ total energy.',
    },
    requiredEnergy: 100,
  },
  {
    level: 3,
    id: 'ship-hyperion-warp',
    name: {
      'es-AR': 'Nave Hiperión de Salto Cuántico',
      'en-US': 'Hyperion Quantum Vessel',
    },
    description: {
      'es-AR': 'Nave insignia interplanetaria desbloqueada a los 240⚡.',
      'en-US': 'Interplanetary flagship unlocked at 240⚡ total energy.',
    },
    requiredEnergy: 240,
  },
];

export const PLANET_DESTINATIONS: PlanetDestination[] = [
  {
    id: 'planet-suma',
    topicId: 'addition-subtraction',
    name: { 'es-AR': 'Planeta Suma-1', 'en-US': 'Planet Suma-1' },
    guardianName: { 'es-AR': 'Comandante Ábaco', 'en-US': 'Commander Abacus' },
    guardianTitle: {
      'es-AR': 'Guardián de los Cristales Decimales',
      'en-US': 'Keeper of the Base-Ten Crystals',
    },
    requiredSolvedCount: 0,
    coordinates: { x: 14, y: 65 },
    colorHex: '#0284C7',
  },
  {
    id: 'planet-multi',
    topicId: 'multiplication-division',
    name: { 'es-AR': 'Estación Multi-Anillo', 'en-US': 'Multi-Ring Station' },
    guardianName: { 'es-AR': 'Capitán Grilla', 'en-US': 'Captain Grid' },
    guardianTitle: {
      'es-AR': 'Arquitecto de los Paneles Solares',
      'en-US': 'Architect of the Solar Arrays',
    },
    requiredSolvedCount: 3,
    coordinates: { x: 30, y: 38 },
    colorHex: '#059669',
  },
  {
    id: 'planet-fractions',
    topicId: 'fractions',
    name: { 'es-AR': 'Luna Partida', 'en-US': 'Split Moon' },
    guardianName: { 'es-AR': 'Guardián Cuarto', 'en-US': 'Quarter Guardian' },
    guardianTitle: {
      'es-AR': 'Custodio de las Partes Iguales',
      'en-US': 'Custodian of Equal Shares',
    },
    requiredSolvedCount: 6,
    coordinates: { x: 48, y: 68 },
    colorHex: '#D97706',
  },
  {
    id: 'planet-negatives',
    topicId: 'negative-numbers',
    name: { 'es-AR': 'Nebulosa Bajo Cero', 'en-US': 'Sub-Zero Nebula' },
    guardianName: { 'es-AR': 'Barón Termómetro', 'en-US': 'Baron Thermometer' },
    guardianTitle: {
      'es-AR': 'Navegante del Horizonte Cero',
      'en-US': 'Navigator of the Zero Horizon',
    },
    requiredSolvedCount: 9,
    coordinates: { x: 64, y: 32 },
    colorHex: '#0EA5E9',
  },
  {
    id: 'planet-percents',
    topicId: 'percentages-proportions',
    name: { 'es-AR': 'Púlsar Proporción', 'en-US': 'Ratio Pulsar' },
    guardianName: { 'es-AR': 'Oráculo Centésimo', 'en-US': 'Centennial Oracle' },
    guardianTitle: {
      'es-AR': 'Maestra de la Escala 100',
      'en-US': 'Master of the 100-Scale',
    },
    requiredSolvedCount: 12,
    coordinates: { x: 79, y: 62 },
    colorHex: '#8B5CF6',
  },
  {
    id: 'planet-equations',
    topicId: 'linear-equations',
    name: { 'es-AR': 'Equilibria Prime', 'en-US': 'Equilibria Prime' },
    guardianName: { 'es-AR': 'Arquitecta Balanza', 'en-US': 'Architect Balance' },
    guardianTitle: {
      'es-AR': 'Defensora de la Igualdad Cósmica',
      'en-US': 'Defender of Cosmic Equality',
    },
    requiredSolvedCount: 15,
    coordinates: { x: 91, y: 28 },
    colorHex: '#E11D48',
  },
];

export interface AttemptRecord {
  attemptId: string;
  exerciseId: string;
  topicId: TopicId;
  seed: number;
  difficulty: 1 | 2 | 3;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: string;
  syncedToServer: boolean;
}

export interface PlayerGameState {
  energy: number;
  stars: number;
  totalSolved: number;
  totalAttempts: number;
  topicMastery: Record<TopicId, { solved: number; attempts: number; guardianDefeated: boolean }>;
  unlockedCosmetics: string[];
  equippedCosmetics: {
    hat: string | null;
    suit: string | null;
    accessory: string | null;
  };
  unlockedPlanets: string[];
  currentPlanetId: string;
  reducedMotion: boolean;
  pendingSyncAttempts: AttemptRecord[];
}

export type GameEvent =
  | { type: 'ENERGY_EARNED'; amount: number }
  | { type: 'OUTFIT_UNLOCKED'; itemId: string }
  | { type: 'VEHICLE_UPGRADED'; shipId: string }
  | { type: 'PLANET_UNLOCKED'; planetId: string }
  | { type: 'GUARDIAN_OVERCOME'; topicId: TopicId };

export const INITIAL_GAME_STATE: PlayerGameState = {
  energy: 20,
  stars: 1,
  totalSolved: 0,
  totalAttempts: 0,
  topicMastery: {
    'addition-subtraction': { solved: 0, attempts: 0, guardianDefeated: false },
    'multiplication-division': { solved: 0, attempts: 0, guardianDefeated: false },
    fractions: { solved: 0, attempts: 0, guardianDefeated: false },
    'negative-numbers': { solved: 0, attempts: 0, guardianDefeated: false },
    'percentages-proportions': { solved: 0, attempts: 0, guardianDefeated: false },
    'linear-equations': { solved: 0, attempts: 0, guardianDefeated: false },
  },
  unlockedCosmetics: ['hat-astro-helmet'],
  equippedCosmetics: {
    hat: 'hat-astro-helmet',
    suit: null,
    accessory: null,
  },
  unlockedPlanets: ['planet-suma'],
  currentPlanetId: 'planet-suma',
  reducedMotion: false,
  pendingSyncAttempts: [],
};

/**
 * Pure state transition function that applies a validated exercise outcome
 * to the player's adventure state and returns emitted reward events.
 */
export function applyExerciseOutcome(
  prevState: PlayerGameState,
  attempt: AttemptRecord,
  isPremiumEntitled: boolean
): { nextState: PlayerGameState; events: GameEvent[] } {
  const events: GameEvent[] = [];
  const prevTopic = prevState.topicMastery[attempt.topicId] || {
    solved: 0,
    attempts: 0,
    guardianDefeated: false,
  };

  if (!attempt.isCorrect) {
    return {
      nextState: {
        ...prevState,
        totalAttempts: prevState.totalAttempts + 1,
        topicMastery: {
          ...prevState.topicMastery,
          [attempt.topicId]: {
            ...prevTopic,
            attempts: prevTopic.attempts + 1,
          },
        },
        pendingSyncAttempts: [...prevState.pendingSyncAttempts, attempt],
      },
      events,
    };
  }

  const energyGain = attempt.difficulty === 1 ? 20 : attempt.difficulty === 2 ? 30 : 40;
  const newEnergy = prevState.energy + energyGain;
  const newStars = prevState.stars + 1;
  const newTotalSolved = prevState.totalSolved + 1;
  const newTopicSolved = prevTopic.solved + 1;

  events.push({ type: 'ENERGY_EARNED', amount: energyGain });

  // Check vehicle tier upgrades
  for (const tier of VEHICLE_TIERS) {
    if (prevState.energy < tier.requiredEnergy && newEnergy >= tier.requiredEnergy) {
      events.push({ type: 'VEHICLE_UPGRADED', shipId: tier.id });
    }
  }

  // Check guardian completion (3 correct answers in a topic defeats the topic's friendly guardian)
  const guardianDefeatedNow = !prevTopic.guardianDefeated && newTopicSolved >= 3;
  if (guardianDefeatedNow) {
    events.push({ type: 'GUARDIAN_OVERCOME', topicId: attempt.topicId });
  }

  // Check cosmetic unlocks
  const unlockedCosmetics = [...prevState.unlockedCosmetics];
  const equippedCosmetics = { ...prevState.equippedCosmetics };
  for (const item of COSMETIC_CATALOG) {
    if (item.premiumOnly && !isPremiumEntitled) continue;
    const topicSolvedOk =
      item.requiredTopic === attempt.topicId && newTopicSolved >= 3;
    const starsOk = newStars >= item.requiredStars;
    if ((topicSolvedOk || starsOk) && !unlockedCosmetics.includes(item.id)) {
      unlockedCosmetics.push(item.id);
      if (!equippedCosmetics[item.slot]) {
        equippedCosmetics[item.slot] = item.id;
      }
      events.push({ type: 'OUTFIT_UNLOCKED', itemId: item.id });
    }
  }

  // Check planet destination unlocks
  const unlockedPlanets = [...prevState.unlockedPlanets];
  for (const planet of PLANET_DESTINATIONS) {
    if (
      newTotalSolved >= planet.requiredSolvedCount &&
      !unlockedPlanets.includes(planet.id)
    ) {
      unlockedPlanets.push(planet.id);
      events.push({ type: 'PLANET_UNLOCKED', planetId: planet.id });
    }
  }

  return {
    nextState: {
      ...prevState,
      energy: newEnergy,
      stars: newStars,
      totalSolved: newTotalSolved,
      totalAttempts: prevState.totalAttempts + 1,
      topicMastery: {
        ...prevState.topicMastery,
        [attempt.topicId]: {
          solved: newTopicSolved,
          attempts: prevTopic.attempts + 1,
          guardianDefeated: prevTopic.guardianDefeated || guardianDefeatedNow,
        },
      },
      unlockedCosmetics,
      equippedCosmetics,
      unlockedPlanets,
      pendingSyncAttempts: [...prevState.pendingSyncAttempts, attempt],
    },
    events,
  };
}
