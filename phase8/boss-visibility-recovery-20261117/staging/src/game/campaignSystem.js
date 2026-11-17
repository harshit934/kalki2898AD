import { create } from 'zustand'
import { STORY_MISSIONS } from './storyCampaign.js'
import { normalizeProgress } from './progressValidation.js'

// Stable mission IDs and save format. Story plans never unlock unbuilt gameplay.
export const CAMPAIGN_MISSIONS = STORY_MISSIONS

const PROGRESS_STORAGE_KEY = 'kalki-campaign-progress'
const INITIAL_UNLOCKED_MISSIONS = ['mission-1']

function readProgress() {
  const empty = { completedMissionIds: [], unlockedMissionIds: INITIAL_UNLOCKED_MISSIONS, rewards: {} }
  if (typeof window === 'undefined') return empty
  try {
    return normalizeProgress(JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) || '{}'), CAMPAIGN_MISSIONS)
  } catch (error) {
    console.warn('[Kalki campaign] Could not read saved campaign progress.', error)
    return empty
  }
}

function saveProgress(progress) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress)) }
  catch (error) { console.warn('[Kalki campaign] Could not save campaign progress.', error) }
}

export const useCampaignState = create((set, get) => ({
  selectedMissionId: 'mission-1',
  ...readProgress(),
  isPlaying: false,
  selectMission(missionId) {
    if (!CAMPAIGN_MISSIONS.some((mission) => mission.id === missionId) || !get().unlockedMissionIds.includes(missionId)) return false
    set({ selectedMissionId: missionId })
    const { completedMissionIds, unlockedMissionIds, rewards } = get()
    saveProgress({ completedMissionIds, unlockedMissionIds, rewards, selectedMissionId: missionId })
    return true
  },
  startMission() {
    const mission = CAMPAIGN_MISSIONS.find(({ id }) => id === get().selectedMissionId)
    if (!mission?.playable || !get().unlockedMissionIds.includes(mission.id)) return false
    set({ isPlaying: true })
    return true
  },
  returnToSelection() { set({ isPlaying: false }) },
  completeMission(missionId, rewardKey, amount) {
    if (!CAMPAIGN_MISSIONS.some(({ id, playable }) => id === missionId && playable)) return false
    if (!get().unlockedMissionIds.includes(missionId)) return false
    if (typeof rewardKey !== 'string' || !Number.isFinite(amount) || amount < 0) throw new RangeError('Mission rewards require a key and a non-negative finite amount.')
    const state = get()
    const completedMissionIds = state.completedMissionIds.includes(missionId) ? state.completedMissionIds : [...state.completedMissionIds, missionId]
    const missionIndex = CAMPAIGN_MISSIONS.findIndex(({ id }) => id === missionId)
    const nextMission = CAMPAIGN_MISSIONS[missionIndex + 1]
    const unlockedMissionIds = nextMission ? [...new Set([...state.unlockedMissionIds, nextMission.id])] : state.unlockedMissionIds
    const rewards = { ...state.rewards, [missionId]: { ...(state.rewards[missionId] ?? {}), [rewardKey]: Math.max(state.rewards[missionId]?.[rewardKey] ?? 0, amount) } }
    set({ completedMissionIds, unlockedMissionIds, rewards })
    saveProgress({ completedMissionIds, unlockedMissionIds, rewards, selectedMissionId: state.selectedMissionId })
    return true
  },
  recordMissionReward(missionId, rewardKey, amount) {
    if (!get().completedMissionIds.includes(missionId)) return false
    if (typeof rewardKey !== 'string' || !Number.isFinite(amount) || amount < 0) throw new RangeError('Mission rewards require a key and a non-negative finite amount.')
    const state = get()
    const missionRewards = state.rewards[missionId] ?? {}
    if (missionRewards[rewardKey] !== undefined) return false
    const rewards = { ...state.rewards, [missionId]: { ...missionRewards, [rewardKey]: amount } }
    set({ rewards })
    saveProgress({ completedMissionIds: state.completedMissionIds, unlockedMissionIds: state.unlockedMissionIds, rewards, selectedMissionId: state.selectedMissionId })
    return true
  },
}))
