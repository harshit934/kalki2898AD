import { create } from 'zustand'
import { STORY_MISSIONS } from './storyCampaign.js'
import { createCampaignPersistence } from './campaignStorage.js'

// Stable mission IDs and save format. Story plans never unlock unbuilt gameplay.
export const CAMPAIGN_MISSIONS = STORY_MISSIONS

let storage
try { storage = typeof window === 'undefined' ? null : window.localStorage } catch { /* Report unavailable below. */ }
const persistence = createCampaignPersistence(storage, CAMPAIGN_MISSIONS)
const loaded = persistence.load()
function saveProgress(progress) {
  const result = persistence.commit(progress)
  useCampaignState.setState({ saveStatus: result.status, ...(result.ok ? { campaignScore: result.progress.campaignScore } : {}) })
  return result.ok
}
export const useCampaignState = create((set, get) => ({
  selectedMissionId: 'mission-1',
  ...loaded.progress,
  saveStatus: loaded.status,
  isPlaying: false,
  selectMission(missionId) {
    if (!CAMPAIGN_MISSIONS.some((mission) => mission.id === missionId) || !get().unlockedMissionIds.includes(missionId)) return false
    set({ selectedMissionId: missionId })
    const { completedMissionIds, unlockedMissionIds, rewards } = get()
    saveProgress({ completedMissionIds, unlockedMissionIds, rewards, selectedMissionId: missionId })
    return true
  },
  flushProgress() {
    const { completedMissionIds, unlockedMissionIds, rewards, selectedMissionId, checkpoint } = get()
    return saveProgress({ completedMissionIds, unlockedMissionIds, rewards, selectedMissionId, checkpoint })
  },
  newCampaign(confirmed = false) {
    if (confirmed !== true) return false
    const fresh = { completedMissionIds: [], unlockedMissionIds: ['mission-1'], rewards: {}, selectedMissionId: 'mission-1', characterProgression: {}, checkpoint: { kind: 'mission-entry', missionId: 'mission-1' } }
    const result = persistence.commit(fresh, true)
    set({ saveStatus: result.status })
    if (!result.ok) return false
    set({ ...result.progress, isPlaying: false })
    return true
  },
  startMission() {
    const mission = CAMPAIGN_MISSIONS.find(({ id }) => id === get().selectedMissionId)
    if (!mission?.playable || !get().unlockedMissionIds.includes(mission.id)) return false
    const checkpoint = { kind: 'mission-entry', missionId: mission.id }
    set({ isPlaying: true, checkpoint })
    get().flushProgress()
    return true
  },
  returnToSelection() { get().flushProgress(); set({ isPlaying: false }) },
  completeMission(missionId, rewardKey, amount) {
    if (!CAMPAIGN_MISSIONS.some(({ id, playable }) => id === missionId && playable)) return false
    if (!get().unlockedMissionIds.includes(missionId)) return false
    if (typeof rewardKey !== 'string' || !Number.isFinite(amount) || amount < 0) throw new RangeError('Mission rewards require a key and a non-negative finite amount.')
    const state = get()
    const completedMissionIds = state.completedMissionIds.includes(missionId) ? state.completedMissionIds : [...state.completedMissionIds, missionId]
    const missionIndex = CAMPAIGN_MISSIONS.findIndex(({ id }) => id === missionId)
    const nextMission = CAMPAIGN_MISSIONS[missionIndex + 1]
    const unlockedMissionIds = nextMission ? [...new Set([...state.unlockedMissionIds, nextMission.id])] : state.unlockedMissionIds
    const rewards = { ...state.rewards, [missionId]: { ...(state.rewards[missionId] ?? {}), [rewardKey]: state.rewards[missionId]?.[rewardKey] ?? amount } }
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
