import { isGameTimeHeld } from './gameClock.js'
import { gameNow } from './gameClock.js'
import { create } from 'zustand'
import { playGameSound } from '../audio/audioManager.js'
import { useCampaignState } from './campaignSystem.js'
import { useBossState } from './bossSystem.js'
import { useCombatState } from './combatSystem.js'
import { usePlayerInput } from './player/playerInputStore.js'
import { useNarrativeCueState } from './narrativeCueSystem.js'

const STARTING_HEALTH = 100
const MISSION_TWO_STARTING_HEALTH = 150
const MISSION_TWO_PYLON_HEAL = 20
const MISSION_THREE_STARTING_HEALTH = 150
const MISSION_THREE_BEACON_HEAL = 25
const DAMAGE_AMOUNT = 20
const DAMAGE_IMMUNITY_MS = 1800
const MISSION_TWO_DAMAGE_IMMUNITY_MS = 2200
const MAX_OVERDRIVE_CHARGES = 3
const OVERDRIVE_DURATION_MS = 5000

const playerPosition = { x: 0, y: -0.22, z: 8 }

function getStartingHealth() {
  const missionId = useCampaignState.getState().selectedMissionId
  if (missionId === 'mission-2') return MISSION_TWO_STARTING_HEALTH
  if (missionId === 'mission-3') return MISSION_THREE_STARTING_HEALTH
  return STARTING_HEALTH
}

export const useGameplayState = create((set, get) => ({
  health: getStartingHealth(),
  score: 0,
  collectedCrystalIds: [],
  activatedPylonIds: [],
  missionObjectiveIds: [],
  overdriveCharges: 0,
  overdriveUntil: 0,
  gameOver: false,
  invulnerableUntil: 0,
  damagedAt: 0,
  roundId: 0,
  isOverdriveActive() {
    return gameNow() < get().overdriveUntil
  },
  collectCrystal(crystalId) {
    if (isGameTimeHeld()) return false
    const state = get()
    if (state.gameOver || state.collectedCrystalIds.includes(crystalId)) return false

    set({
      collectedCrystalIds: [...state.collectedCrystalIds, crystalId],
      score: state.score + 100,
      overdriveCharges: Math.min(MAX_OVERDRIVE_CHARGES, state.overdriveCharges + 1),
    })
    void playGameSound('crystalCollect')
    return true
  },
  activatePylon(pylonId) {
    if (isGameTimeHeld()) return false
    const state = get()
    if (state.gameOver || state.activatedPylonIds.includes(pylonId)) return false

    set({
      activatedPylonIds: [...state.activatedPylonIds, pylonId],
      score: state.score + 200,
      ...(useCampaignState.getState().selectedMissionId === 'mission-2'
        ? { health: Math.min(MISSION_TWO_STARTING_HEALTH, state.health + MISSION_TWO_PYLON_HEAL) }
        : {}),
    })
    void playGameSound('crystalCollect')
    return true
  },
  completeMissionObjective(objectiveId) {
    if (isGameTimeHeld()) return false
    const state = get()
    if (state.gameOver || state.missionObjectiveIds.includes(objectiveId)) return false
    const missionThree = useCampaignState.getState().selectedMissionId === 'mission-3'
    set({
      missionObjectiveIds: [...state.missionObjectiveIds, objectiveId],
      score: state.score + 200,
      ...(missionThree
        ? { health: Math.min(MISSION_THREE_STARTING_HEALTH, state.health + MISSION_THREE_BEACON_HEAL) }
        : {}),
    })
    void playGameSound('crystalCollect')
    return true
  },
  activateOverdrive() {
    if (isGameTimeHeld()) return false
    const state = get()
    if (state.gameOver || state.overdriveCharges <= 0 || state.isOverdriveActive()) return false

    set({
      overdriveCharges: state.overdriveCharges - 1,
      overdriveUntil: gameNow() + OVERDRIVE_DURATION_MS,
    })
    void playGameSound('specialMove')
    return true
  },
  takeDamage(amount = DAMAGE_AMOUNT, source = 'environment') {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new RangeError('Damage must be a positive finite number.')
    }

    if (isGameTimeHeld()) return false
    const state = get()
    const now = gameNow()
    if (state.gameOver || now < state.invulnerableUntil) return false

    const missionId = useCampaignState.getState().selectedMissionId
    const immunityMs = missionId === 'mission-2' || missionId === 'mission-3'
      ? MISSION_TWO_DAMAGE_IMMUNITY_MS
      : DAMAGE_IMMUNITY_MS
    const damage = usePlayerInput.getState().blocking ? amount * 0.3 : amount
    const health = Math.max(0, state.health - damage)
    const gameOver = health === 0
    set({
      health,
      gameOver,
      invulnerableUntil: now + immunityMs,
      damagedAt: now,
    })
    if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('frameMetrics') === '1') {
      console.info('KALKI damage receipt', JSON.stringify({
        source, requested: amount, applied: damage, blocking: usePlayerInput.getState().blocking,
        healthBefore: state.health, healthAfter: health, gameOver,
      }))
    }
    void playGameSound('playerDamage')
    if (gameOver) void playGameSound('gameOver')
    return true
  },
  restart() {
    useNarrativeCueState.getState().reset()
    useCombatState.getState().restart()
    useBossState.getState().reset()

    set((state) => ({
      health: getStartingHealth(),
      score: 0,
      collectedCrystalIds: [],
      activatedPylonIds: [],
      missionObjectiveIds: [],
      overdriveCharges: 0,
      overdriveUntil: 0,
      gameOver: false,
      invulnerableUntil: 0,
      damagedAt: 0,
      roundId: state.roundId + 1,
    }))
    setPlayerWorldPosition(0, -0.22, 8)
  },
}))

export function setPlayerWorldPosition(x, y, z) {
  playerPosition.x = x
  playerPosition.y = y
  playerPosition.z = z
}

export function getPlayerWorldPosition() {
  return playerPosition
}
