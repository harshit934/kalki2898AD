// Enemy Archetype System — Reusable templates for 100 missions
// Each archetype defines base identity, appearance, stats, behavior, and visual variants

export const ENEMY_ARCHETYPES = {
  SCOUT: {
    key: 'SCOUT',
    baseType: 'scout',
    role: 'fast',
    namePrefix: 'Sentry',
    description: 'Lightly armored reconnaissance unit. Fast, evasive, prefers hit-and-run.',
    baseStats: { health: 50, speed: 3.25, detectionRange: 12, attackRange: 1.45, attackDamage: 7, attackCooldown: 1250 },
    color: '#61f2dc',
    visualVariants: ['standard', 'scout', 'outrider', 'pathfinder'],
    behaviorProfile: { aggression: 0.4, flanking: 0.8, retreatThreshold: 0.3, groupCoordination: 0.3 },
    weight: 1
  },

  WARRIOR: {
    key: 'WARRIOR',
    baseType: 'warrior',
    role: 'melee',
    namePrefix: 'Guard',
    description: 'Standard combat unit. Balanced offense and defense. Engages directly.',
    baseStats: { health: 100, speed: 2.05, detectionRange: 13, attackRange: 1.85, attackDamage: 12, attackCooldown: 1750 },
    color: '#ff9b59',
    visualVariants: ['standard', 'veteran', 'sergeant', 'centurion'],
    behaviorProfile: { aggression: 0.7, flanking: 0.4, retreatThreshold: 0.15, groupCoordination: 0.6 },
    weight: 2
  },

  HEAVY: {
    key: 'HEAVY',
    baseType: 'heavy',
    role: 'heavy',
    namePrefix: 'Juggernaut',
    description: 'Heavily armored shock unit. Slow but devastating. Area denial.',
    baseStats: { health: 180, speed: 1.4, detectionRange: 15, attackRange: 2.25, attackDamage: 18, attackCooldown: 2300 },
    color: '#df6aff',
    visualVariants: ['standard', 'enforcer', 'bulwark', 'colossus'],
    behaviorProfile: { aggression: 0.8, flanking: 0.1, retreatThreshold: 0.05, groupCoordination: 0.4 },
    weight: 3
  },

  RANGED: {
    key: 'RANGED',
    baseType: 'ranged',
    role: 'ranged',
    namePrefix: 'Sharpshooter',
    description: 'Energy weapon specialist. Maintains distance. Suppresses and snipes.',
    baseStats: { health: 80, speed: 2.2, detectionRange: 19, attackRange: 11, attackDamage: 9, attackCooldown: 2300 },
    color: '#ffcc00',
    visualVariants: ['standard', 'marksman', 'sniper', 'artillery'],
    behaviorProfile: { aggression: 0.5, flanking: 0.3, retreatThreshold: 0.4, groupCoordination: 0.7 },
    weight: 2
  },

  ELITE: {
    key: 'ELITE',
    baseType: 'elite',
    role: 'elite',
    namePrefix: 'Champion',
    description: 'Elite combatant. Superior stats, advanced tactics. Adapts to player.',
    baseStats: { health: 145, speed: 2.7, detectionRange: 17, attackRange: 2.1, attackDamage: 15, attackCooldown: 1800 },
    color: '#ff3366',
    visualVariants: ['standard', 'vanguard', 'paragon', 'apex'],
    behaviorProfile: { aggression: 0.9, flanking: 0.6, retreatThreshold: 0.02, groupCoordination: 0.9 },
    weight: 4
  },

  GLASS_STALKER: {
    key: 'GLASS_STALKER',
    baseType: 'glassStalker',
    role: 'fast',
    namePrefix: 'Stalker',
    description: 'Fragile but extremely fast glass-cannon. Ambushes from unexpected angles.',
    baseStats: { health: 85, speed: 2.8, detectionRange: 17, attackRange: 1.5, attackDamage: 6, attackCooldown: 2100 },
    color: '#75f4ef',
    visualVariants: ['standard', 'phantom', 'wraith', 'specter'],
    behaviorProfile: { aggression: 0.6, flanking: 0.9, retreatThreshold: 0.5, groupCoordination: 0.2 },
    weight: 1.5
  },

  GLASS_BRUTE: {
    key: 'GLASS_BRUTE',
    baseType: 'glassBrute',
    role: 'heavy',
    namePrefix: 'Brute',
    description: 'Massive glass-cannon. Devastating damage but shatters under sustained fire.',
    baseStats: { health: 210, speed: 1.1, detectionRange: 18, attackRange: 2, attackDamage: 10, attackCooldown: 3200 },
    color: '#d88bff',
    visualVariants: ['standard', 'behemoth', 'titan', 'leviathan'],
    behaviorProfile: { aggression: 0.85, flanking: 0.15, retreatThreshold: 0.1, groupCoordination: 0.3 },
    weight: 3
  }
}

// Helper: Get archetype by key
export function getArchetype(key) {
  return ENEMY_ARCHETYPES[key]
}

// Helper: Get all archetype keys
export function getArchetypeKeys() {
  return Object.keys(ENEMY_ARCHETYPES)
}

// Helper: Select visual variant based on progression (0-1)
export function selectVisualVariant(archetypeKey, progress, tier = 0) {
  const archetype = ENEMY_ARCHETYPES[archetypeKey]
  const variants = archetype.visualVariants
  const variantIndex = Math.min(Math.floor(progress * variants.length) + tier, variants.length - 1)
  return variants[variantIndex]
}

// Helper: Generate unique enemy identity
export function generateEnemyIdentity(archetypeKey, buildingName, index, missionNumber) {
  const archetype = ENEMY_ARCHETYPES[archetypeKey]
  const variant = selectVisualVariant(archetypeKey, index / 10, Math.floor((missionNumber - 1) / 10))
  return {
    name: `${archetype.namePrefix} ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
    title: `${archetype.namePrefix} of ${buildingName}`,
    archetype: archetypeKey,
    variant,
    description: archetype.description,
    visualVariant: variant
  }
}