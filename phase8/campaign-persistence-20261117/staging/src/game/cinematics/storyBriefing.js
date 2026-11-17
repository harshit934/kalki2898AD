import { BATCH_CONTENT, batchMission } from '../chapters/batch20Content.js'
import { getStoryMission } from '../storyCampaign.js'
import { SCOUTING_FOCUS } from '../storyProgress.js'
import { kashiEntry } from './kashiEntry.js'
import { arcBossFor } from '../phase54e/arcBosses.js'

const LINES = {
  'mission-1': ['Salvage lights ahead. The crystals are inside a guarded site.', 'Then we take the contract one obstacle at a time.'],
  'mission-2': ['Three pylons hold the resonance grid. The sentinels are still active.', 'Open the route. We face the Sovereign when the gate is clear.'],
  'mission-3': ['The contract beacons are contested. Expect rival hunters along the road.', 'A claim is easier to argue when we are already standing on it.'],
  'mission-4': ['Engine parts first. The convoy breaker is blocking the recovery route.', 'You get the parts. I will handle the interruption.'],
  'mission-5': ['The tier-lift relays are guarded. We need all three before the district gate opens.', 'One level at a time. Keep the way back on your map.'],
  'mission-6': ['Several claims point to the same route. Follow the markers before facing the enforcer.', 'I prefer a contract with one owner. Me.'],
  'mission-7': ['The target left a trail through the alleys. Interceptors are already waiting.', 'Keep the last sighting marked. I will clear the approach.'],
  'mission-8': ['The circuit has marked stages. The champion waits beyond the guards.', 'Then let us not keep the final payment waiting.'],
  'mission-9': ['The bargain markers lead toward the collector. This is a local debt, not a clean road.', 'It will be a cleaner road when we are finished.'],
  'mission-10': ['The departure route is blocked. We need the markers and a clear exit.', 'No victory lap. We leave together.'],
}

export function createStoryBriefing(id, focus = 'terrain') {
  const mission = getStoryMission(id)
  if (!mission?.playable) return null
  if (id === 'mission-1') return {...kashiEntry}
  const duel = arcBossFor(id)
  const lines = (batchMission(id) ? BATCH_CONTENT[id].opening : LINES[id]) ?? (duel ? [
    `${duel.name}. ${duel.subtitle}. This is an original local challenge.`,
    'One opponent. Read the opening, settle the challenge, then return to our route.',
  ] : null)
  if (!lines) return null
  return {
    storyPlacement: 'mission-opening',
    id: `story-briefing-${id}`, duration: 15.5, waitForSpawn: true,
    enterDuration: 0.8, returnDuration: 0.85,
    titles: [{ at: 0.3, duration: 3, eyebrow: 'GAME-ORIGINAL ADAPTATION', text: mission.title }],
    camera: [
      { at: 0, position: [3.4, 2.6, 4.6], focus: [0, 1.1, 0], fov: 48 },
      { at: 3.5, position: [2.2, 1.8, 3.1], focus: [0, 1.22, 0], fov: 43 },
      { at: 7, position: [1.05, 1.6, -2.1], focus: [0, 1.4, 0], fov: 37 },
      { at: 11, position: [1.9, 1.9, 1.5], focus: [0, 1.2, -5], fov: 44 },
      { at: 15.5, position: [0.8, 2.5, 4.8], focus: [0, 1.1, -3], fov: 48 },
    ],
    actors: [{ id: 'bhairava', src: '/models/bhairava-free-rig.glb?v=4', height: 1.78, appearance: 'bhairava',
      weapon: true, position: [0, 0, 0], rotation: [0, Math.PI, 0], actions: [{ at: 0, clip: 'Sword idle (guard)' }] }],
    dialogue: [
      { at: 1, duration: 4, speaker: 'Bujji', text: lines[0] },
      { at: 5.4, duration: 3.8, speaker: 'Bhairava', text: lines[1] },
      { at: 9.7, duration: 5.3, speaker: 'Bujji', text: (SCOUTING_FOCUS[focus] ?? SCOUTING_FOCUS.terrain).response },
    ],
    // Existing synthesized original accent only. No movie audio or video.
    audio: [{ at: 0.7, src: '/audio/cinematics/phase41-chime.wav', channel: 'effects', gain: 0.25 }],
    references: ['P43-02', 'P43-04'],
  }
}
