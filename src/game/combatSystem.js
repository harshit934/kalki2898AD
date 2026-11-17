import { difficultyFor } from './phase54e/arcBosses.js'
import { isGameTimeHeld } from './gameClock.js'
import { gameNow, gameTime } from './gameClock.js'
import { create } from 'zustand'
import { playGameSound } from '../audio/audioManager.js'
import { useCampaignState } from './campaignSystem.js'
import { useGameplayState } from './gameplayStore.js'
import { EXPANSION_MISSIONS } from './missionExpansionContent.js'
import { useNarrativeCueState } from './narrativeCueSystem.js'

export const ENEMY_TYPES = Object.freeze({
  scout: {
    label: 'SCOUT',
    health: 50,
    speed: 3.25,
    detectionRange: 12,
    attackRange: 1.45,
    attackDamage: 7,
    attackCooldown: 1250,
    patrolRadius: 3.4,
    scoreReward: 150,
    crystalDropChance: 0.45,
    color: '#61f2dc',
  },
  warrior: {
    label: 'WARRIOR',
    health: 100,
    speed: 2.05,
    detectionRange: 13,
    attackRange: 1.85,
    attackDamage: 12,
    attackCooldown: 1750,
    patrolRadius: 2.6,
    scoreReward: 250,
    crystalDropChance: 0.65,
    color: '#ff9b59',
  },
  heavy: {
    label: 'HEAVY',
    health: 180,
    speed: 1.4,
    detectionRange: 15,
    attackRange: 2.25,
    attackDamage: 18,
    attackCooldown: 2300,
    patrolRadius: 2,
    scoreReward: 400,
    crystalDropChance: 1,
    color: '#df6aff',
  },
  glassStalker: {
    label: 'GLASS STALKER',
    health: 85,
    speed: 2.8,
    detectionRange: 17,
    attackRange: 1.5,
    attackDamage: 6,
    attackCooldown: 2100,
    patrolRadius: 3.1,
    scoreReward: 220,
    crystalDropChance: 0.6,
    color: '#75f4ef',
  },
  glassBrute: {
    label: 'GLASS BRUTE',
    health: 210,
    speed: 1.1,
    detectionRange: 18,
    attackRange: 2,
    attackDamage: 10,
    attackCooldown: 3200,
    patrolRadius: 2.2,
    scoreReward: 450,
    crystalDropChance: 1,
    color: '#d88bff',
  },
})

const scaledStats = new Map()
export function getEnemyStats(type, missionId=useCampaignState.getState().selectedMissionId) {
 const key=`${missionId}/${type}`
 if(!scaledStats.has(key)){const base=ENEMY_TYPES[type],d=difficultyFor(missionId);if(!base)throw new RangeError(`Unknown enemy type ${type}`);scaledStats.set(key,Object.freeze({...base,health:Math.round(base.health*d.health),speed:base.speed*d.speed,attackDamage:Math.round(base.attackDamage*d.damage),attackCooldown:Math.round(base.attackCooldown*d.cooldown)}))}
 return scaledStats.get(key)
}

const MISSION_ONE_ENEMY_SPAWNS = Object.freeze([
  { id: 'scout-01', type: 'scout', position: [-4, -0.22, -5], phase: 0.6 },
  { id: 'warrior-01', type: 'warrior', position: [4, -0.22, -17], phase: 2.4 },
  { id: 'heavy-01', type: 'heavy', position: [-3, -0.22, -31], phase: 4.1 },
])

export const MISSION_TWO_ENEMY_SPAWNS = Object.freeze([
  { id: 'glass-stalker-01', type: 'glassStalker', position: [-4, -0.22, -9], phase: 0.4 },
  { id: 'glass-stalker-02', type: 'glassStalker', position: [4, -0.22, -19], phase: 2.3 },
  { id: 'glass-brute-01', type: 'glassBrute', position: [-3, -0.22, -29], phase: 4.1 },
  { id: 'glass-stalker-03', type: 'glassStalker', position: [4, -0.22, -39], phase: 1.6 },
  { id: 'glass-brute-02', type: 'glassBrute', position: [-2, -0.22, -47], phase: 3.2 },
])

export function getEnemySpawns(missionId) {
  if (missionId === 'mission-2') return MISSION_TWO_ENEMY_SPAWNS
  return EXPANSION_MISSIONS[missionId]?.enemies ?? MISSION_ONE_ENEMY_SPAWNS
}

export function getEnemyBehavior(type, distance, playerAlive = true) {
  const enemyType = ENEMY_TYPES[type]
  if (!enemyType) throw new RangeError(`Unknown enemy type: "${type}".`)
  if (!Number.isFinite(distance) || distance < 0) {
    throw new RangeError('Enemy distance must be a non-negative finite number.')
  }
  if (!playerAlive || distance > enemyType.detectionRange) return 'patrol'
  if (distance <= enemyType.attackRange) return 'attack'
  return 'chase'
}

function getEnemyMaxHealth(missionId) {
  return Object.fromEntries(
    getEnemySpawns(missionId).map(({ id, type }) => [id, getEnemyStats(type,missionId).health]),
  )
}

let effectSequence = 0

export const enemyRuntime = new Map()

export const useCombatState = create((set, get) => ({
  enemyHealth: getEnemyMaxHealth(useCampaignState.getState().selectedMissionId),
  defeatedEnemyIds: [],
  enemyHitAt: {},
  targetEnemyId: null,
  droppedEnemyCrystals: [],
  totalEnemyCrystalsSpawned: 0,
  effects: [],
  roundId: 0,
  setTargetEnemyId(enemyId) {
    if (get().targetEnemyId !== enemyId) set({ targetEnemyId: enemyId })
  },
  damageEnemy(enemyId, amount, position) {
    if (isGameTimeHeld()) return false
    const state = get()
    const currentHealth = state.enemyHealth[enemyId]
    if (currentHealth === undefined || state.defeatedEnemyIds.includes(enemyId)) return false

    const enemy = [
      ...MISSION_ONE_ENEMY_SPAWNS,
      ...MISSION_TWO_ENEMY_SPAWNS,
      ...Object.values(EXPANSION_MISSIONS).flatMap(({ enemies }) => enemies),
    ]
      .find((spawn) => spawn.id === enemyId)
    if (!enemy) return false
    const enemyType = ENEMY_TYPES[enemy.type]
    const health = Math.max(0, currentHealth - amount)
    const defeated = health === 0
    const hitEffect = {
      id: ++effectSequence,
      type: defeated ? 'defeat' : 'impact',
      position: { x: position.x, y: position.y + 1, z: position.z },
      color: enemyType.color,
      createdAt: gameTime() / 1000,
      duration: defeated ? 0.9 : 0.55,
    }

    const next = {
      enemyHealth: { ...state.enemyHealth, [enemyId]: health },
      enemyHitAt: { ...state.enemyHitAt, [enemyId]: gameNow() },
      targetEnemyId: enemyId,
      effects: [...state.effects, hitEffect],
    }

    if (defeated) {
      useNarrativeCueState.getState().announceFightDialogue('enemyDown')
      next.defeatedEnemyIds = [...state.defeatedEnemyIds, enemyId]
      next.targetEnemyId = enemyId
      const gameplay = useGameplayState.getState()
      useGameplayState.setState({ score: gameplay.score + enemyType.scoreReward })
      if (Math.random() < enemyType.crystalDropChance) {
        const crystalId = `enemy-crystal-${enemyId}-${get().roundId}`
        next.droppedEnemyCrystals = [
          ...state.droppedEnemyCrystals,
          { id: crystalId, position: [position.x, 0.92, position.z] },
        ]
        next.totalEnemyCrystalsSpawned = state.totalEnemyCrystalsSpawned + 1
      }
      enemyRuntime.delete(enemyId)
      void playGameSound('enemyDefeat')
    }

    set(next)
    return true
  },
  collectDroppedCrystal(crystalId) {
    const state = get()
    if (!state.droppedEnemyCrystals.some((crystal) => crystal.id === crystalId)) return false
    set({
      droppedEnemyCrystals: state.droppedEnemyCrystals.filter(
        (crystal) => crystal.id !== crystalId,
      ),
    })
    return true
  },
  removeEffect(effectId) {
    set((state) => ({
      effects: state.effects.filter((effect) => effect.id !== effectId),
    }))
  },
  restart() {
    effectSequence = 0
    enemyRuntime.clear()
    set((state) => ({
      enemyHealth: getEnemyMaxHealth(useCampaignState.getState().selectedMissionId),
      defeatedEnemyIds: [],
      enemyHitAt: {},
      targetEnemyId: null,
      droppedEnemyCrystals: [],
      totalEnemyCrystalsSpawned: 0,
      effects: [],
      roundId: state.roundId + 1,
    }))
  },
}))
