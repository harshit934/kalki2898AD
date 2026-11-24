// Mission Family Templates — 10 families that repeat across 100 missions
// Each family defines theme, archetype progression, boss, environment, and weapon reward

export const MISSION_FAMILIES = {
  // Family 1: Salvage Outpost (Missions 1, 11, 21, 31, 41, 51, 61, 71, 81, 91)
  1: {
    id: 1,
    theme: 'salvage_outpost',
    displayName: 'Salvage Outpost',
    description: 'Desert salvage operations. Scavenger camps, trade posts, and watch towers.',
    archetypeProgression: [
      { archetype: 'SCOUT', weight: 3, range: [0, 0.2] },      // Early: scouts
      { archetype: 'WARRIOR', weight: 3, range: [0.15, 0.45] }, // Early-mid: warriors
      { archetype: 'RANGED', weight: 2, range: [0.35, 0.6] },   // Mid: ranged
      { archetype: 'HEAVY', weight: 2, range: [0.55, 0.8] },    // Mid-late: heavies
      { archetype: 'ELITE', weight: 2, range: [0.75, 1] }       // Late: elites
    ],
    bossArchetype: 'ELITE',
    bossTitle: 'OUTPOST WARLORD',
    environment: 'desert_outpost',
    weaponReward: {
      family: 'PLASMA_CUTTER',
      type: 'melee',
      baseName: 'Plasma Cutter',
      description: 'High-energy melee weapon. Charged strikes pierce armor.',
      baseStats: { damage: 48, attackSpeed: 0.85, range: 2.5, criticalChance: 0.15 }
    },
    buildingTypes: ['outpost', 'watchtower', 'trade_post', 'salvage_yard', 'barracks'],
    colorScheme: { primary: '#c9a876', secondary: '#8b7355', accent: '#d4a574' },
    skybox: { turbidity: 3.2, rayleigh: 1.25, mieCoefficient: 0.004, mieDirectionalG: 0.8 }
  },

  // Family 2: Glass Wastes (Missions 2, 12, 22, 32, 42, 52, 62, 72, 82, 92)
  2: {
    id: 2,
    theme: 'glass_wastes',
    displayName: 'Glass Wastes',
    description: 'Crystalline deserts. Prism formations, resonance fields, and glass horrors.',
    archetypeProgression: [
      { archetype: 'GLASS_STALKER', weight: 3, range: [0, 0.25] },
      { archetype: 'GLASS_BRUTE', weight: 2, range: [0.2, 0.5] },
      { archetype: 'ELITE', weight: 2, range: [0.4, 0.7] },
      { archetype: 'RANGED', weight: 2, range: [0.55, 0.8] },
      { archetype: 'WARRIOR', weight: 1, range: [0.7, 1] }
    ],
    bossArchetype: 'GLASS_BRUTE',
    bossTitle: 'PRISM SOVEREIGN',
    environment: 'glass_wastes',
    weaponReward: {
      family: 'PRISM_RIFLE',
      type: 'ranged',
      baseName: 'Prism Rifle',
      description: 'Resonance beam weapon. Charged shots penetrate multiple targets.',
      baseStats: { damage: 32, attackSpeed: 1.2, range: 25, criticalChance: 0.1 }
    },
    buildingTypes: ['resonance_tower', 'prism_mine', 'glass_citadel', 'harmonic_chamber'],
    colorScheme: { primary: '#5a4a8c', secondary: '#7b68b8', accent: '#a890e0' },
    skybox: { turbidity: 2.8, rayleigh: 1.1, mieCoefficient: 0.006, mieDirectionalG: 0.85 }
  },

  // Family 3: Contract Enforcement (Missions 3, 13, 23, 33, 43, 53, 63, 73, 83, 93)
  3: {
    id: 3,
    theme: 'contract_enforcement',
    displayName: 'Contract Enforcement',
    description: 'Urban sectors. Corporate security, mercenary companies, and legal enforcers.',
    archetypeProgression: [
      { archetype: 'WARRIOR', weight: 3, range: [0, 0.3] },
      { archetype: 'RANGED', weight: 3, range: [0.2, 0.55] },
      { archetype: 'ELITE', weight: 2, range: [0.4, 0.75] },
      { archetype: 'HEAVY', weight: 2, range: [0.6, 0.85] },
      { archetype: 'SCOUT', weight: 1, range: [0.7, 1] }
    ],
    bossArchetype: 'ELITE',
    bossTitle: 'CONTRACT ENFORCER PRIME',
    environment: 'urban_market',
    weaponReward: {
      family: 'CONTRACT_PISTOL',
      type: 'sidearm',
      baseName: 'Contract Pistol',
      description: 'Burst-fire sidearm. Marks targets for execution.',
      baseStats: { damage: 24, attackSpeed: 2.5, range: 15, criticalChance: 0.25, burstCount: 3 }
    },
    buildingTypes: ['corporate_office', 'mercenary_barracks', 'evidence_vault', 'tribunal'],
    colorScheme: { primary: '#2d3a4a', secondary: '#1e2a36', accent: '#00b4d8' },
    skybox: { turbidity: 3.0, rayleigh: 1.0, mieCoefficient: 0.005, mieDirectionalG: 0.75 }
  },

  // Family 4: Convoy Pursuit (Missions 4, 14, 24, 34, 44, 54, 64, 74, 84, 94)
  4: {
    id: 4,
    theme: 'convoy_pursuit',
    displayName: 'Convoy Pursuit',
    description: 'Wasteland highways. Armored convoys, vehicle combat, and mobile fortresses.',
    archetypeProgression: [
      { archetype: 'HEAVY', weight: 3, range: [0, 0.35] },
      { archetype: 'ELITE', weight: 2, range: [0.25, 0.6] },
      { archetype: 'WARRIOR', weight: 2, range: [0.4, 0.7] },
      { archetype: 'RANGED', weight: 2, range: [0.55, 0.8] },
      { archetype: 'GLASS_BRUTE', weight: 1, range: [0.75, 1] }
    ],
    bossArchetype: 'HEAVY',
    bossTitle: 'CONVOY BREAKER',
    environment: 'convoy_highway',
    weaponReward: {
      family: 'CONVOY_CANNON',
      type: 'heavy',
      baseName: 'Convoy Cannon',
      description: 'Shoulder-mounted artillery. Charged shots devastate vehicles and structures.',
      baseStats: { damage: 80, attackSpeed: 0.4, range: 30, criticalChance: 0.05, chargeTime: 2.0 }
    },
    buildingTypes: ['supply_depot', 'vehicle_bay', 'command_carrier', 'fuel_station'],
    colorScheme: { primary: '#4a3728', secondary: '#3d2f22', accent: '#c4742e' },
    skybox: { turbidity: 3.5, rayleigh: 1.3, mieCoefficient: 0.004, mieDirectionalG: 0.8 }
  },

  // Family 5: Tier City (Missions 5, 15, 25, 35, 45, 55, 65, 75, 85, 95)
  5: {
    id: 5,
    theme: 'tier_city',
    displayName: 'Tier City',
    description: 'Vertical metropolis. Multi-level districts, industrial zones, and elite towers.',
    archetypeProgression: [
      { archetype: 'ELITE', weight: 3, range: [0, 0.3] },
      { archetype: 'HEAVY', weight: 2, range: [0.2, 0.5] },
      { archetype: 'RANGED', weight: 2, range: [0.4, 0.7] },
      { archetype: 'GLASS_BRUTE', weight: 2, range: [0.55, 0.8] },
      { archetype: 'ELITE', weight: 2, range: [0.7, 1] }
    ],
    bossArchetype: 'ELITE',
    bossTitle: 'TIER SENTINEL PRIME',
    environment: 'tier_city',
    weaponReward: {
      family: 'TIER_BLADE',
      type: 'melee',
      baseName: 'Tier Blade',
      description: 'Phase-shifting blade. Teleports through defenses for critical strikes.',
      baseStats: { damage: 56, attackSpeed: 1.1, range: 3.0, criticalChance: 0.3, teleportRange: 5 }
    },
    buildingTypes: ['industrial_sector', 'residential_tower', 'admin_spire', 'hydroponics', 'reactor'],
    colorScheme: { primary: '#3a3a4a', secondary: '#2d2d3a', accent: '#8b5cf6' },
    skybox: { turbidity: 2.5, rayleigh: 0.9, mieCoefficient: 0.007, mieDirectionalG: 0.9 }
  },

  // Family 6: Void Corridors (Missions 6, 16, 26, 36, 46, 56, 66, 76, 86, 96)
  6: {
    id: 6,
    theme: 'void_corridors',
    displayName: 'Void Corridors',
    description: 'Subterranean anomaly zones. Reality distortions, void entities, and ancient tech.',
    archetypeProgression: [
      { archetype: 'GLASS_STALKER', weight: 2, range: [0, 0.25] },
      { archetype: 'ELITE', weight: 3, range: [0.15, 0.5] },
      { archetype: 'GLASS_BRUTE', weight: 2, range: [0.4, 0.7] },
      { archetype: 'HEAVY', weight: 2, range: [0.55, 0.85] },
      { archetype: 'RANGED', weight: 1, range: [0.75, 1] }
    ],
    bossArchetype: 'ELITE',
    bossTitle: 'VOID WALKER PRIME',
    environment: 'void_corridors',
    weaponReward: {
      family: 'VOID_LAUNCHER',
      type: 'explosive',
      baseName: 'Void Launcher',
      description: 'Reality-warping grenade launcher. Creates singularity zones.',
      baseStats: { damage: 120, attackSpeed: 0.3, range: 20, criticalChance: 0.05, aoeRadius: 8 }
    },
    buildingTypes: ['anomaly_chamber', 'containment_vault', 'research_outpost', 'reality_anchor'],
    colorScheme: { primary: '#1a1a2e', secondary: '#16213e', accent: '#e94560' },
    skybox: { turbidity: 2.0, rayleigh: 0.5, mieCoefficient: 0.008, mieDirectionalG: 0.95 }
  },

  // Family 7: Phase Ruins (Missions 7, 17, 27, 37, 47, 57, 67, 77, 87, 97)
  7: {
    id: 7,
    theme: 'phase_ruins',
    displayName: 'Phase Ruins',
    description: 'Ancient civilization remnants. Phase-shifting tech, temporal anomalies, and guardians.',
    archetypeProgression: [
      { archetype: 'SCOUT', weight: 2, range: [0, 0.2] },
      { archetype: 'ELITE', weight: 3, range: [0.15, 0.5] },
      { archetype: 'WARRIOR', weight: 2, range: [0.4, 0.7] },
      { archetype: 'GLASS_STALKER', weight: 2, range: [0.6, 0.85] },
      { archetype: 'HEAVY', weight: 1, range: [0.8, 1] }
    ],
    bossArchetype: 'ELITE',
    bossTitle: 'PHASE KEEPER PRIME',
    environment: 'phase_ruins',
    weaponReward: {
      family: 'PHASE_DAGGER',
      type: 'melee',
      baseName: 'Phase Dagger',
      description: 'Teleporting blade. Short-range blink strikes bypass all defenses.',
      baseStats: { damage: 36, attackSpeed: 1.5, range: 2.0, criticalChance: 0.35, teleportRange: 8 }
    },
    buildingTypes: ['temporal_archive', 'phase_gate', 'guardian_shrine', 'echo_chamber'],
    colorScheme: { primary: '#2d1b4e', secondary: '#1a0f2e', accent: '#a855f7' },
    skybox: { turbidity: 2.2, rayleigh: 0.7, mieCoefficient: 0.006, mieDirectionalG: 0.9 }
  },

  // Family 8: Arc Foundry (Missions 8, 18, 28, 38, 48, 58, 68, 78, 88, 98)
  8: {
    id: 8,
    theme: 'arc_foundry',
    displayName: 'Arc Foundry',
    description: 'Industrial energy complexes. Plasma forges, lightning conductors, and arc reactors.',
    archetypeProgression: [
      { archetype: 'RANGED', weight: 3, range: [0, 0.3] },
      { archetype: 'ELITE', weight: 2, range: [0.2, 0.55] },
      { archetype: 'HEAVY', weight: 2, range: [0.45, 0.75] },
      { archetype: 'GLASS_BRUTE', weight: 2, range: [0.6, 0.85] },
      { archetype: 'WARRIOR', weight: 1, range: [0.8, 1] }
    ],
    bossArchetype: 'HEAVY',
    bossTitle: 'ARC OVERLORD PRIME',
    environment: 'arc_foundry',
    weaponReward: {
      family: 'ARC_CASTER',
      type: 'ranged',
      baseName: 'Arc Caster',
      description: 'Chain lightning projector. Jumps between multiple targets.',
      baseStats: { damage: 40, attackSpeed: 1.0, range: 18, criticalChance: 0.15, chainCount: 4, chainRange: 6 }
    },
    buildingTypes: ['plasma_forge', 'conductor_tower', 'capacitor_bank', 'transformer_station'],
    colorScheme: { primary: '#1a3a4a', secondary: '#0f2a3a', accent: '#06b6d4' },
    skybox: { turbidity: 3.0, rayleigh: 1.0, mieCoefficient: 0.005, mieDirectionalG: 0.8 }
  },

  // Family 9: Singularity Zone (Missions 9, 19, 29, 39, 49, 59, 69, 79, 89, 99)
  9: {
    id: 9,
    theme: 'singularity_zone',
    displayName: 'Singularity Zone',
    description: 'Gravitational anomaly regions. Warped space, time dilation, and singularity entities.',
    archetypeProgression: [
      { archetype: 'GLASS_BRUTE', weight: 2, range: [0, 0.3] },
      { archetype: 'ELITE', weight: 3, range: [0.2, 0.6] },
      { archetype: 'HEAVY', weight: 2, range: [0.45, 0.75] },
      { archetype: 'RANGED', weight: 2, range: [0.6, 0.9] },
      { archetype: 'GLASS_STALKER', weight: 1, range: [0.85, 1] }
    ],
    bossArchetype: 'ELITE',
    bossTitle: 'SINGULARITY LORD PRIME',
    environment: 'singularity_zone',
    weaponReward: {
      family: 'SINGULARITY_RIFLE',
      type: 'ranged',
      baseName: 'Singularity Rifle',
      description: 'Gravity-manipulating rifle. Creates localized black holes.',
      baseStats: { damage: 60, attackSpeed: 0.7, range: 22, criticalChance: 0.1, gravityRadius: 5, pullForce: 15 }
    },
    buildingTypes: ['gravity_anchor', 'time_dilation_chamber', 'event_horizon_monitor', 'mass_compressor'],
    colorScheme: { primary: '#0d0d1a', secondary: '#050510', accent: '#ff6b6b' },
    skybox: { turbidity: 1.5, rayleigh: 0.3, mieCoefficient: 0.01, mieDirectionalG: 0.95 }
  },

  // Family 10: Omega Citadel (Missions 10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
  10: {
    id: 10,
    theme: 'omega_citadel',
    displayName: 'Omega Citadel',
    description: 'Final strongholds. Ultimate defenses, ancient weapons, and omega entities.',
    archetypeProgression: [
      { archetype: 'ELITE', weight: 3, range: [0, 0.25] },
      { archetype: 'HEAVY', weight: 2, range: [0.2, 0.5] },
      { archetype: 'RANGED', weight: 2, range: [0.4, 0.65] },
      { archetype: 'GLASS_BRUTE', weight: 2, range: [0.55, 0.8] },
      { archetype: 'ELITE', weight: 3, range: [0.7, 1] }
    ],
    bossArchetype: 'ELITE',
    bossTitle: 'OMEGA SENTINEL PRIME',
    environment: 'omega_citadel',
    weaponReward: {
      family: 'OMEGA_EDGE',
      type: 'melee',
      baseName: 'Omega Edge',
      description: 'Ultimate blade. Reality-cutting strikes that ignore all defenses.',
      baseStats: { damage: 100, attackSpeed: 0.9, range: 4.0, criticalChance: 0.4, trueDamage: 0.25 }
    },
    buildingTypes: ['citadel_gate', 'throne_room', 'armory', 'war_room', 'core_reactor'],
    colorScheme: { primary: '#1a0a2e', secondary: '#0d051a', accent: '#ffd700' },
    skybox: { turbidity: 1.0, rayleigh: 0.2, mieCoefficient: 0.012, mieDirectionalG: 0.98 }
  }
}

// Helper: Get family for mission number
export function getMissionFamily(missionNumber) {
  const familyId = ((missionNumber - 1) % 10) + 1
  return MISSION_FAMILIES[familyId]
}

// Helper: Get tier for mission (0-9 for missions 1-100)
export function getMissionTier(missionNumber) {
  return Math.floor((missionNumber - 1) / 10)
}

// Helper: Calculate scaled stats based on tier
export function scaleStatsForTier(baseStats, tier) {
  const healthMult = 1 + tier * 0.25
  const damageMult = 1 + tier * 0.15
  const speedMult = 1 + tier * 0.05
  return {
    ...baseStats,
    health: Math.round(baseStats.health * healthMult),
    attackDamage: Math.round(baseStats.attackDamage * damageMult),
    speed: baseStats.speed * speedMult
  }
}