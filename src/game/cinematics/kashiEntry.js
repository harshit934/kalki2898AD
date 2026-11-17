import { lazy } from 'react'

const KashiSet = lazy(() => import('./KashiPlayableSet.jsx'))

const SEEN_KEY = 'kalki-kashi-entry-production-v1'
let seenThisPage = false

export function hasSeenKashiEntry() {
  try { return seenThisPage || localStorage.getItem(SEEN_KEY) === '1' }
  catch { return seenThisPage }
}

export function markKashiEntrySeen() {
  seenThisPage = true
  try { localStorage.setItem(SEEN_KEY, '1') }
  catch { /* Storage can be disabled. Keep the in-page guard. */ }
}

const step = '/audio/cinematics/kashi-step.wav'
const chime = '/audio/cinematics/phase41-chime.wav'

export const kashiEntry = {
  id: 'kashi-riverfront-arrival',
  storyPlacement: 'mission-opening',
  duration: 26.5,
  waitForSpawn: true,
  enterDuration: 0.85,
  returnDuration: 1.05,
  presentation: 'kashi',
  Set: KashiSet,
  titles: [{ at: 1.25, duration: 3.25, eyebrow: 'THE LAST CITY', text: 'KASHI' }],
  transitions: [3.1, 5, 10.2, 16.4, 20.4].map(at => ({ at: at - 0.22, duration: 0.44 })),
  camera: [
    { at: 0, position: [-26, 4.8, 12], focus: [-17, .8, -22], fov: 51 },
    { at: 3.09, position: [-23, 4.2, 8], focus: [-16, 1.1, -22], fov: 48 },
    { at: 3.1, transition: 'cut', position: [-5, 6.1, 9], focus: [0, 5.8, -26], fov: 50 },
    { at: 4.99, position: [-3.6, 5.3, 7.8], focus: [0, 3.8, -24], fov: 43 },
    { at: 5, transition: 'cut', position: [2.4, 4.7, 7.2], focusActor: 'bhairava', focus: [0, 1.05, 0], fov: 44 },
    { at: 10.19, position: [1.85, 1.7, 3.4], focusActor: 'bhairava', focus: [0, 1.18, 0], fov: 39 },
    { at: 10.2, transition: 'cut', position: [1.55, 1.58, -1.9], focusActor: 'bhairava', focus: [0, 1.38, 0], fov: 37 },
    { at: 16.39, position: [0.94, 1.55, -1.53], focusActor: 'bhairava', focus: [0, 1.46, 0], fov: 34 },
    { at: 16.4, transition: 'cut', position: [1.15, 1.82, 2.55], focus: [-0.5, 1.1, -8], fov: 42 },
    { at: 20.39, position: [0.87, 1.82, 2.1], focus: [-1, 1.1, -11], fov: 38 },
    { at: 20.4, transition: 'cut', position: [2.8, 1.9, 1.1], focusActor: 'bhairava', focus: [0, 1.18, 0], fov: 41 },
    { at: 23.4, position: [1.8, 2.15, 3.65], focus: [0, 1.23, 0], fov: 42 },
    { at: 26.5, position: [0.75, 2.72, 5.35], focus: [0, 1.25, 0], fov: 42 },
  ],
  actors: [{
    id: 'bhairava',
    src: '/models/bhairava-free-rig.glb?v=4',
    height: 1.78,
    appearance: 'bhairava',
    weapon: true,
    enterAt: 5,
    rotation: [0, Math.PI, 0],
    path: [
      { at: 5, position: [0, 0, 3.6] },
      { at: 10.25, position: [0, 0, 0] },
    ],
    actions: [
      { at: 5, clip: 'Walk', speed: 0.85 },
      { at: 10.05, clip: 'Sword idle (guard)', fade: 0.32 },
      { at: 18.2, clip: 'Sword block', fade: 0.22, loop: false },
      { at: 20.4, clip: 'Sword idle (guard)', fade: 0.4 },
    ],
  }],
  dialogue: [
    { at: 11.25, duration: 3.6, speaker: 'BUJJI', lang:'te', text:'దారి నిశ్శబ్దంగా ఉందని పని సులువని అనుకోకు.',translation:'A quiet street doesn’t mean an easy job.' },
    { at: 17.1, duration: 2.85, speaker: 'BHAIRAVA', lang:'te', text:'నువ్వు దారి చూసుకో. కాపలా సంగతి నేను చూసుకుంటా.',translation:'You watch the route. I’ll handle the guards.' },
    { at: 21.6, duration: 3.2, speaker: 'BUJJI', lang:'te', text:'మూడు రిలేలు ఉన్నాయి. దగ్గరకు వెళ్తే దారి సమాచారం ఇస్తా.',translation:'Three field relays are nearby. Scan them for route intelligence.' },
  ],
  audio: [
    { at: 0.15, src: '/audio/cinematics/kashi-wind.wav', channel: 'ambience', loop: true, gain: 0.37 },
    ...[5.55, 6.33, 7.1, 7.87, 8.65, 9.42].map(at => ({ at, src: step, channel: 'effects', gain: 0.36 })),
    { at: 10.2, src: chime, channel: 'effects', gain: 0.5 },
    { at: 17.05, src: chime, channel: 'effects', gain: 0.23 },
  ],
}

