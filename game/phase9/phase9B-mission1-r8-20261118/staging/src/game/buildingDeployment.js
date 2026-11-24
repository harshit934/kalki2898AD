// Building Deployment Manager — Generates deployments for all 100 missions
// Uses mission families, enemy archetypes, and building layouts

import {MISSION_FAMILIES, getMissionFamily, getMissionTier, scaleStatsForTier} from './missionFamilies.js'
import {ENEMY_ARCHETYPES, getArchetype, selectVisualVariant, generateEnemyIdentity} from './enemyArchetypes.js'
import {MISSION_ONE_BUILDINGS} from './buildingCampaign.js'

// Stable identity-based animation offset; never changes with render order.
export function deploymentPhase(enemyId){
  let hash=2166136261
  for(const character of enemyId)hash=Math.imul(hash^character.charCodeAt(0),16777619)>>>0
  return hash/4294967296*Math.PI*2
}

// Building count formula: 10 + ((mission - 1) % 10)
export function getBuildingCount(missionNumber) {
  return 11 + ((missionNumber - 1) % 10)
}

// Generate building layout for missions beyond the first 11
// Uses procedural generation for additional buildings
function generateAdditionalBuildings(missionNumber, requiredCount) {
  const existingBuildings = MISSION_ONE_BUILDINGS
  if (requiredCount <= existingBuildings.length) {
    return existingBuildings.slice(0, requiredCount)
  }

  const additional = requiredCount - existingBuildings.length
  const generated = []
  const baseZ = 420 // Beyond existing district
  const spacing = 35

  for (let i = 0; i < additional; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const row = Math.floor(i / 2)
    const z = baseZ + row * spacing
    const x = side * (3 + (row % 3) * 4)

    const buildingTypes = ['outpost', 'tower', 'bunker', 'facility', 'complex', 'citadel', 'spire', 'vault', 'forge', 'nexus']
    const type = buildingTypes[i % buildingTypes.length]

    generated.push({
      id: `generated-${type}-${i}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      kind: type,
      x,
      z,
      w: 12,
      d: 14,
      h: 6 + (i % 4) * 2,
      front: side === -1 ? 1 : -1,
      color: '#8b7355',
      interior: true,
      at: [x + 1, -0.22, z + 2],
      route: [
        [x + 1, z + 2],
        [x + 1, z],
        [x + 1, z + 2]
      ],
      spawnOffset: [x + (side === -1 ? 3 : -3), -0.22, z],
      patrolRoute: [
        [x + 1, z + 2],
        [x + 1 + side * 4, z + 2],
        [x + 1 + side * 4, z + 6],
        [x + 1, z + 6],
        [x + 1, z + 2]
      ]
    })
  }

  return [...existingBuildings, ...generated]
}

// Select archetype based on mission family progression and building progress
function selectArchetypeForBuilding(archetypeProgression, progress) {
  // Find matching archetype for this progress point
  for (const entry of archetypeProgression) {
    if (progress >= entry.range[0] && progress <= entry.range[1]) {
      return entry.archetype
    }
  }
  // Fallback to last archetype
  return archetypeProgression[archetypeProgression.length - 1].archetype
}

// Generate difficulty scaling
function calculateDifficulty(missionNumber, buildingProgress, tier) {
  const baseDifficulty = 1 + buildingProgress * 1.5 // 1.0 to 2.5
  const tierMult = 1 + tier * 0.2 // +20% per tier
  const missionMult = 1 + (missionNumber - 1) * 0.02 // +2% per mission
  return Math.min(baseDifficulty * tierMult * missionMult, 10)
}

// Main deployment generator
export function generateMissionDeployment(missionNumber) {
  const buildingCount = getBuildingCount(missionNumber)
  const family = getMissionFamily(missionNumber)
  const tier = getMissionTier(missionNumber)
  const buildings = generateAdditionalBuildings(missionNumber, buildingCount)

  return buildings.slice(0, buildingCount).map((building, index) => {
    const progress = buildingCount > 1 ? index / (buildingCount - 1) : 0
    const archetypeKey = selectArchetypeForBuilding(family.archetypeProgression, progress)
    const archetype = ENEMY_ARCHETYPES[archetypeKey]
    const visualVariant = selectVisualVariant(archetypeKey, progress, tier)
    const identity = generateEnemyIdentity(archetypeKey, building.name, index, missionNumber)

    // Scale stats for tier
    const scaledStats = scaleStatsForTier(archetype.baseStats, tier)
    const difficulty = calculateDifficulty(missionNumber, progress, tier)

    // Building spawn position
    const spawnPos = building.spawnOffset || [
      building.at[0] + (building.front === -1 ? -3 : 3),
      -0.22,
      building.at[2]
    ]

    // Patrol route
    const patrol = building.patrolRoute || building.route || [
      [building.at[0], building.at[2]],
      [building.at[0] + 4, building.at[2]],
      [building.at[0], building.at[2]]
    ]

    return {
      buildingId: building.id,
      buildingName: building.name,
      buildingType: building.kind || 'standard',
      coordinates: building.at,
      coordinates: building.at,
      enemies: [{
        id: `${building.id}-opponent-m${missionNumber}`,
        phase: deploymentPhase(`${building.id}-opponent-m${missionNumber}`),
        name: identity.name,
        title: identity.title,
        archetype: archetypeKey,
        type: archetype.baseType,
        role: archetype.role,
        visualVariant,
        color: archetype.color,
        stats: {
          ...scaledStats,
          health: Math.round(scaledStats.health * difficulty),
          attackDamage: Math.round(scaledStats.attackDamage * difficulty),
          attackCooldown: Math.round(scaledStats.attackCooldown / difficulty)
        },
        behaviorProfile: archetype.behaviorProfile,
        spawnPosition: spawnPos,
        patrolRoute: patrol,
        activationRadius: 44,
        retirementRadius: 95,
        identity: {
          name: identity.name,
          title: identity.title,
          description: archetype.description,
          visualVariant,
          archetype: archetypeKey
        }
      }],
      // Boss reference (will be separate)
      hasBoss: index === buildingCount - 1,
      bossArena: family.environment + '_boss'
    }
  })
}

// Generate final boss for mission
export function generateMissionBoss(missionNumber) {
  const family = getMissionFamily(missionNumber)
  const tier = getMissionTier(missionNumber)
  const bossArchetype = ENEMY_ARCHETYPES[family.bossArchetype]

  // Scale boss stats significantly
  const bossStats = {
    health: Math.round(bossArchetype.baseStats.health * (3 + tier * 0.5)),
    speed: bossArchetype.baseStats.speed * (1 + tier * 0.05),
    detectionRange: bossArchetype.baseStats.detectionRange * 1.5,
    attackRange: bossArchetype.baseStats.attackRange * (1 + tier * 0.1),
    attackDamage: Math.round(bossArchetype.baseStats.attackDamage * (1.5 + tier * 0.2)),
    attackCooldown: Math.round(bossArchetype.baseStats.attackCooldown * 0.8)
  }

  return {
    id: `boss-m${missionNumber}`,
    name: `${family.displayName.toUpperCase()} ${bossArchetype.namePrefix} PRIME`,
    title: family.bossTitle,
    archetype: family.bossArchetype,
    type: bossArchetype.baseType,
    role: bossArchetype.role,
    tier,
    stats: bossStats,
    phases: 2 + (tier >= 5 ? 1 : 0) + (tier >= 8 ? 1 : 0), // 2-4 phases
    uniqueMechanics: generateBossMechanics(family.theme, tier),
    arena: family.environment + '_boss',
    weaponReward: {
      ...family.weaponReward,
      tier: tier + 1,
      name: `${family.weaponReward.baseName} MK${tier + 1}`,
      stats: {
        ...family.weaponReward.baseStats,
        damage: Math.round(family.weaponReward.baseStats.damage * (1 + tier * 0.15))
      }
    }
  }
}

// Generate unique boss mechanics per family/tier
function generateBossMechanics(theme, tier) {
  const baseMechanics = {
    salvage_outpost: ['charge_attack', 'ground_slam', 'summon_reinforcements'],
    glass_wastes: ['prism_beam', 'crystal_shards', 'resonance_wave'],
    contract_enforcement: ['precision_strike', 'contract_beam', 'summon_mercenaries'],
    convoy_pursuit: ['vehicle_ram', 'artillery_barrage', 'deploy_turrets'],
    tier_city: ['phase_shift', 'vertical_slam', 'drone_swarm'],
    void_corridors: ['void_walk', 'reality_tear', 'anomaly_spawn'],
    phase_ruins: ['phase_blink', 'temporal_echo', 'chronal_bomb'],
    arc_foundry: ['arc_overload', 'chain_lightning', 'emp_pulse'],
    singularity_zone: ['gravity_well', 'time_dilation', 'mass_compression'],
    omega_citadel: ['reality_cut', 'omega_beam', 'ultimate_judgment']
  }

  const mechanics = [...(baseMechanics[theme] || ['charge_attack'])]
  if (tier >= 3) mechanics.push('adaptive_ai')
  if (tier >= 5) mechanics.push('phase_transition')
  if (tier >= 7) mechanics.push('environmental_hazard')
  if (tier >= 9) mechanics.push('reality_rewrite')

  return mechanics
}

// Export all deployment data for a mission
export function getMissionDeployment(missionNumber) {
  return {
    missionNumber,
    tier: getMissionTier(missionNumber),
    family: getMissionFamily(missionNumber),
    buildings: generateMissionDeployment(missionNumber),
    boss: generateMissionBoss(missionNumber),
    buildingCount: getBuildingCount(missionNumber)
  }
}

// Get deployment for specific building
export function getBuildingDeployment(missionNumber, buildingIndex) {
  const deployment = getMissionDeployment(missionNumber)
  return deployment.buildings[buildingIndex]
}

// Get boss deployment
export function getBossDeployment(missionNumber) {
  const deployment = getMissionDeployment(missionNumber)
  return deployment.boss
}