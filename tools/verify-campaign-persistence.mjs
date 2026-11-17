import assert from 'node:assert/strict'

// Isolated localStorage double: never reads or writes a real browser profile.
let saved = JSON.stringify({
  completedMissionIds: ['mission-1', 'mission-3'],
  unlockedMissionIds: ['mission-1', 'mission-2', 'mission-3', 'mission-5'],
  rewards: { 'mission-1': { score: 500 } },
  selectedMissionId: 'mission-2',
})
globalThis.window = { localStorage: {
  getItem: () => saved,
  setItem: (key, value) => { assert.equal(key, 'kalki-campaign-progress'); saved = value },
} }
async function reload(label) {
  return (await import(`../src/game/campaignSystem.js?test=${label}`)).useCampaignState
}
let store = await reload('initial')
assert.deepEqual(store.getState().completedMissionIds, ['mission-1', 'mission-3'])
assert.ok(store.getState().unlockedMissionIds.includes('mission-5'))
assert.ok(store.getState().unlockedMissionIds.includes('mission-4'))
assert.equal(store.getState().selectedMissionId, 'mission-2')
const before = saved
assert.equal(store.getState().startMission(), true)
store.getState().returnToSelection()
assert.equal(saved, before, 'exiting must not overwrite progress')
assert.equal(store.getState().completeMission('mission-2', 'score', 600), true)
assert.equal(store.getState().selectMission('mission-5'), true)
store = await reload('restart')
assert.equal(store.getState().selectedMissionId, 'mission-5')
assert.ok(store.getState().completedMissionIds.includes('mission-2'))
assert.equal(store.getState().rewards['mission-1'].score, 500)
assert.equal(store.getState().rewards['mission-2'].score, 600)
saved = JSON.stringify({ unlockedMissionIds: ['mission-1', 'mission-2'], completedMissionIds: [] })
store = await reload('legacy-unlock')
assert.ok(store.getState().unlockedMissionIds.includes('mission-2'))
assert.equal(store.getState().selectedMissionId, 'mission-2')
console.log('PASS: saved completions, explicit unlocks, next unlock, rewards, selection, exit, and module reload. No real player data accessed.')
