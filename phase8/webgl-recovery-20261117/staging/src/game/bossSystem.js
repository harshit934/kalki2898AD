import { arcBossFor } from './phase54e/arcBosses.js'
import { isGameTimeHeld } from './gameClock.js'
import { setGameTimeout } from './gameClock.js'
import { gameNow, gameTime } from './gameClock.js'
import { create } from 'zustand'
import { playGameSound } from '../audio/audioManager.js'
import { useCampaignState } from './campaignSystem.js'
import { useGameplayState } from './gameplayStore.js'
import { useNarrativeCueState } from './narrativeCueSystem.js'

export const BOSS_MAX_HEALTH = 720
export const MISSION_TWO_BOSS_MAX_HEALTH = 840
export const MISSION_THREE_BOSS_MAX_HEALTH = 540
export const BOSS_ARENA = Object.freeze({
  minX: -8.6,
  maxX: 8.6,
  entranceZ: -58.2,
  minZ: -77,
  bossPosition: Object.freeze([0, -0.22, -69]),
})
export const BOSS_REWARD_SCORE = 2500
export const RELIC_REWARD_SCORE = 750
export const MISSION_TWO_BOSS_REWARD_SCORE = 3200
export const MISSION_TWO_RELIC_REWARD_SCORE = 900

export const BOSS_PHASES = Object.freeze([
  { phase: 1, threshold: 0.66, speed: 1.15, cooldown: 3300 },
  { phase: 2, threshold: 0.33, speed: 1.7, cooldown: 2650 },
  { phase: 3, threshold: 0, speed: 2.35, cooldown: 2050 },
])

export const MISSION_TWO_BOSS_PHASES = Object.freeze([
  { phase: 1, threshold: 0.7, speed: 1.05, cooldown: 3000 },
  { phase: 2, threshold: 0.38, speed: 1.55, cooldown: 2250 },
  { phase: 3, threshold: 0, speed: 2.1, cooldown: 1750 },
])

export const MISSION_THREE_BOSS_PHASES = Object.freeze([
  { phase: 1, threshold: 0.66, speed: 0.9, cooldown: 3400 },
  { phase: 2, threshold: 0.33, speed: 1.25, cooldown: 2900 },
  { phase: 3, threshold: 0, speed: 1.6, cooldown: 2450 },
])

export function getBossMaxHealth(missionId) {
  if(arcBossFor(missionId)) return arcBossFor(missionId).health
  if (missionId === 'mission-2') return MISSION_TWO_BOSS_MAX_HEALTH
  if (missionId === 'mission-3') return MISSION_THREE_BOSS_MAX_HEALTH
  return BOSS_MAX_HEALTH
}

export function getBossPhases(missionId) {
  if(arcBossFor(missionId)) return arcBossFor(missionId).phases
  if (missionId === 'mission-2') return MISSION_TWO_BOSS_PHASES
  if (missionId === 'mission-3') return MISSION_THREE_BOSS_PHASES
  return BOSS_PHASES
}

let effectSequence = 0

export function getBossPhase(health, maxHealth = BOSS_MAX_HEALTH, missionId = 'mission-1') {
  if (!Number.isFinite(maxHealth) || maxHealth <= 0) {
    throw new RangeError('Maximum boss health must be a positive finite number.')
  }
  if (!Number.isFinite(health) || health < 0 || health > maxHealth) {
    throw new RangeError(`Boss health must be between 0 and ${maxHealth}.`)
  }
  const phases = getBossPhases(missionId)
  const fraction = health / maxHealth
  return phases.find((phase) => fraction >= phase.threshold) ??
    phases[phases.length - 1]
}

export const bossRuntime = {
  body: null,
  position: {
    x: BOSS_ARENA.bossPosition[0],
    y: BOSS_ARENA.bossPosition[1],
    z: BOSS_ARENA.bossPosition[2],
  },
  projectile: null,
}

const initialMissionId = useCampaignState.getState().selectedMissionId
const initialBossMaxHealth = getBossMaxHealth(initialMissionId)

export const useBossState = create((set, get) => ({
  status: 'dormant',
  introStartedAt: 0,
  phase: 1,
  health: initialBossMaxHealth,
  maxHealth: initialBossMaxHealth,
  hitAt: 0,
  attack: null,
  targetEnemyId: null,
  scoreAwarded: false,
  relicCollected: false,
  victoryDismissed: false,
  victoryReady: false,
  projectile: null,
  roundId: 0,
  effects: [],
  beginEncounter() {
    if (get().status !== 'dormant') return false
    set({ status: 'intro', introStartedAt: gameTime() / 1000 })
    void playGameSound('bossIntroduction')
    return true
  },
  beginFight() {
    if (get().status !== 'intro') return false
    set({ status: 'active' })
    return true
  },
  setAttack(attack) {
    set({ attack })
  },
  setProjectile(projectile) {
    set({ projectile })
    bossRuntime.projectile = projectile
  },
  removeProjectile(projectileId) {
    if (get().projectile?.id === projectileId) set({ projectile: null })
    if (bossRuntime.projectile?.id === projectileId) bossRuntime.projectile = null
  },
  completeDefeatSequence() {
    if (get().status === 'defeated' && !get().victoryReady) set({ victoryReady: true })
  },
  damageBoss(amount, position) {
    if (isGameTimeHeld()) return false
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new RangeError('Boss damage must be a positive finite number.')
    }

    const state = get()
    if (state.status !== 'active' || state.health <= 0) return false

    const missionId = useCampaignState.getState().selectedMissionId
    const health = Math.max(0, state.health - amount)
    const defeated = health === 0
    const nextPhase = getBossPhase(health, state.maxHealth, missionId).phase
    const bossReward = missionId === 'mission-2'
      ? MISSION_TWO_BOSS_REWARD_SCORE
      : BOSS_REWARD_SCORE
    const effect = {
      id: ++effectSequence,
      type: defeated ? 'defeat' : 'impact',
      position: { x: position.x, y: position.y + 2.1, z: position.z },
      color: '#70f5e8',
      createdAt: gameTime() / 1000,
      duration: defeated ? 2.1 : 0.65,
    }
    const next = {
      health,
      phase: nextPhase,
      hitAt: gameNow(),
      attack: null,
      effects: [...state.effects, effect],
      status: defeated ? 'defeated' : 'active',
    }

    if (defeated && !state.scoreAwarded) {
      useNarrativeCueState.getState().announceFightDialogue('bossDefeated', { force: true })
      next.scoreAwarded = true
      useGameplayState.setState((gameplay) => ({
        score: gameplay.score + bossReward,
      }))
      useCampaignState.getState().completeMission(
        missionId,
        'boss',
        bossReward,
      )
      void playGameSound('bossDefeat')
      setGameTimeout(() => {
        if (get().roundId === state.roundId) get().completeDefeatSequence()
      }, 2100)
    } else {
      if (nextPhase !== state.phase) {
        useNarrativeCueState.getState().announceFightDialogue('bossPhase', { force: true })
      }
      void playGameSound('bossDamage')
    }

    set(next)
    return true
  },
  collectRelic() {
    if (isGameTimeHeld()) return false
    const state = get()
    if (state.status !== 'defeated' || !state.victoryReady || state.relicCollected) return false
    const missionId = useCampaignState.getState().selectedMissionId
    const relicReward = missionId === 'mission-2'
      ? MISSION_TWO_RELIC_REWARD_SCORE
      : RELIC_REWARD_SCORE
    set({ relicCollected: true })
    // The run objective can be recovered on replay, but the saved reward is unique.
    const awarded = useCampaignState.getState().recordMissionReward(
      missionId,
      'relic',
      relicReward,
    )
    if (awarded) {
      useGameplayState.setState((gameplay) => ({ score: gameplay.score + relicReward }))
    }
    return true
  },
  dismissVictory() {
    if (get().status === 'defeated') set({ victoryDismissed: true })
  },
  setTargetEnemyId(enemyId) {
    if (get().targetEnemyId !== enemyId) set({ targetEnemyId: enemyId })
  },
  removeEffect(effectId) {
    set((state) => ({
      effects: state.effects.filter((effect) => effect.id !== effectId),
    }))
  },
  reset() {
    const missionId = useCampaignState.getState().selectedMissionId
    const maxHealth = getBossMaxHealth(missionId)
    effectSequence = 0
    bossRuntime.body = null
    bossRuntime.position.x = BOSS_ARENA.bossPosition[0]
    bossRuntime.position.y = BOSS_ARENA.bossPosition[1]
    bossRuntime.position.z = BOSS_ARENA.bossPosition[2]
    bossRuntime.projectile = null
    set((state) => ({
      status: 'dormant',
      introStartedAt: 0,
      phase: 1,
      health: maxHealth,
      maxHealth,
      hitAt: 0,
      attack: null,
      targetEnemyId: null,
      scoreAwarded: false,
      relicCollected: false,
      victoryDismissed: false,
      victoryReady: false,
      projectile: null,
      effects: [],
      roundId: state.roundId + 1,
    }))
  },
}))
